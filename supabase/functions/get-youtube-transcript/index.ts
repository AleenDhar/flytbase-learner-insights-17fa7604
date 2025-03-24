
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const videoId = url.searchParams.get('videoId');

    if (!videoId) {
      return new Response(
        JSON.stringify({ error: 'Video ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // First, fetch the video page to get the captions track URL
    const videoPageResponse = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
    const videoPageHtml = await videoPageResponse.text();

    // Extract captions data from the page
    const transcript = await extractTranscriptFromPage(videoPageHtml, videoId);

    if (!transcript || transcript.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: 'No transcript available for this video',
          transcript: [] 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ transcript }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in get-youtube-transcript function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        transcript: [] 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function extractTranscriptFromPage(html: string, videoId: string): Promise<any[]> {
  try {
    // Extract the serializedShareEntity parameter which contains video metadata
    const playerResponseMatch = html.match(/"playerCaptionsTracklistRenderer":({.+?}),"/);
    
    if (!playerResponseMatch) {
      // Try an alternative method by fetching the timedtext directly
      return await fetchTimedTextTranscript(videoId);
    }
    
    // Extract captions data
    const captionsMatch = html.match(/"captionTracks":\[(.*?)\]/);
    if (!captionsMatch || captionsMatch.length < 2) {
      return await fetchTimedTextTranscript(videoId);
    }
    
    // Extract the URL for the first English caption track
    const captionsData = captionsMatch[1];
    const urlMatch = captionsData.match(/"baseUrl":"(.*?)"/);
    
    if (!urlMatch || urlMatch.length < 2) {
      return await fetchTimedTextTranscript(videoId);
    }
    
    // Fetch and parse the transcript file
    let transcriptUrl = urlMatch[1].replace(/\\u0026/g, '&');
    transcriptUrl = `${transcriptUrl}&fmt=json3`;
    
    const transcriptResponse = await fetch(transcriptUrl);
    if (!transcriptResponse.ok) {
      return await fetchTimedTextTranscript(videoId);
    }
    
    const transcriptData = await transcriptResponse.json();
    
    // Format the transcript data into our expected structure
    if (transcriptData.events) {
      return transcriptData.events
        .filter((event: any) => event.segs && event.segs.length > 0)
        .map((event: any) => {
          const text = event.segs
            .map((seg: any) => seg.utf8 || '')
            .join('')
            .trim();
          
          return {
            text,
            start: event.tStartMs / 1000,
            duration: (event.dDurationMs || 1000) / 1000
          };
        })
        .filter((segment: any) => segment.text.length > 0);
    }
    
    return await fetchTimedTextTranscript(videoId);
  } catch (error) {
    console.error("Error extracting transcript from page:", error);
    return await fetchTimedTextTranscript(videoId);
  }
}

// Fallback method to get transcript using the timedtext API
async function fetchTimedTextTranscript(videoId: string): Promise<any[]> {
  try {
    // First try to get available transcript info
    const infoUrl = `https://www.youtube.com/api/timedtext?type=list&v=${videoId}`;
    const infoResponse = await fetch(infoUrl);
    const infoText = await infoResponse.text();
    
    // Try to get the first available language
    const langMatch = infoText.match(/lang_code="([^"]+)"/);
    if (!langMatch) {
      return [];
    }
    
    const langCode = langMatch[1];
    
    // Fetch the transcript with the identified language
    const transcriptUrl = `https://www.youtube.com/api/timedtext?lang=${langCode}&v=${videoId}`;
    const transcriptResponse = await fetch(transcriptUrl);
    const transcriptXml = await transcriptResponse.text();
    
    // Parse the XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(transcriptXml, "text/xml");
    const textElements = xmlDoc.getElementsByTagName("text");
    
    // Convert to our expected format
    const transcript = [];
    for (let i = 0; i < textElements.length; i++) {
      const element = textElements[i];
      const start = parseFloat(element.getAttribute("start") || "0");
      const duration = parseFloat(element.getAttribute("dur") || "0");
      const text = element.textContent || "";
      
      transcript.push({
        text: text.trim(),
        start,
        duration
      });
    }
    
    return transcript;
  } catch (error) {
    console.error("Error in fallback transcript method:", error);
    return [];
  }
}
