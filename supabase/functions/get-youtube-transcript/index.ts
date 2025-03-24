
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

    // First, try to get transcript directly from timedtext API
    let transcript = await fetchTimedTextTranscriptDirect(videoId);
    
    // If direct method fails, try the page parsing approach
    if (!transcript || transcript.length === 0) {
      console.log("Direct transcript fetch failed, trying page parsing approach...");
      transcript = await fetchTranscriptFromPage(videoId);
    }

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

// Direct approach - fetch from timedtext API without page parsing
async function fetchTimedTextTranscriptDirect(videoId: string): Promise<any[]> {
  try {
    // First try to get available transcript info
    const infoUrl = `https://www.youtube.com/api/timedtext?type=list&v=${videoId}`;
    const infoResponse = await fetch(infoUrl);
    
    if (!infoResponse.ok) {
      console.error(`Failed to fetch transcript info: ${infoResponse.status}`);
      return [];
    }
    
    const infoText = await infoResponse.text();
    
    // Try to get the first available language
    const langMatch = infoText.match(/lang_code="([^"]+)"/);
    if (!langMatch) {
      console.log("No language codes found in transcript info");
      return [];
    }
    
    const langCode = langMatch[1];
    
    // Fetch the transcript with the identified language
    const transcriptUrl = `https://www.youtube.com/api/timedtext?lang=${langCode}&v=${videoId}&fmt=json3`;
    const transcriptResponse = await fetch(transcriptUrl);
    
    if (!transcriptResponse.ok) {
      console.error(`Failed to fetch transcript: ${transcriptResponse.status}`);
      return [];
    }
    
    try {
      // Try JSON format first (newer videos)
      const transcriptData = await transcriptResponse.json();
      
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
    } catch (e) {
      // If JSON parsing fails, try XML format (older videos)
      console.log("JSON parsing failed, trying XML format");
      
      const xmlUrl = `https://www.youtube.com/api/timedtext?lang=${langCode}&v=${videoId}`;
      const xmlResponse = await fetch(xmlUrl);
      
      if (!xmlResponse.ok) {
        console.error(`Failed to fetch XML transcript: ${xmlResponse.status}`);
        return [];
      }
      
      const xmlText = await xmlResponse.text();
      
      // Parse the XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
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
    }
    
    return [];
  } catch (error) {
    console.error("Error in direct transcript fetch method:", error);
    return [];
  }
}

// Page parsing approach - fetch the YouTube page and extract transcript data
async function fetchTranscriptFromPage(videoId: string): Promise<any[]> {
  try {
    // Fetch the video page
    const videoPageResponse = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      }
    });
    
    if (!videoPageResponse.ok) {
      console.error(`Failed to fetch video page: ${videoPageResponse.status}`);
      return [];
    }
    
    const videoPageHtml = await videoPageResponse.text();
    
    // Extract the serializedShareEntity parameter which contains video metadata
    const playerResponseMatch = videoPageHtml.match(/"playerCaptionsTracklistRenderer":({.+?}),"/);
    
    if (!playerResponseMatch) {
      console.log("Failed to extract captions data from page");
      return [];
    }
    
    // Extract captions data
    const captionsMatch = videoPageHtml.match(/"captionTracks":\[(.*?)\]/);
    if (!captionsMatch || captionsMatch.length < 2) {
      console.log("No caption tracks found in page data");
      return [];
    }
    
    // Extract the URL for the first English caption track
    const captionsData = captionsMatch[1];
    const urlMatch = captionsData.match(/"baseUrl":"(.*?)"/);
    
    if (!urlMatch || urlMatch.length < 2) {
      console.log("No baseUrl found in caption tracks");
      return [];
    }
    
    // Fetch and parse the transcript file
    let transcriptUrl = urlMatch[1].replace(/\\u0026/g, '&');
    transcriptUrl = `${transcriptUrl}&fmt=json3`;
    
    const transcriptResponse = await fetch(transcriptUrl);
    if (!transcriptResponse.ok) {
      console.error(`Failed to fetch transcript data: ${transcriptResponse.status}`);
      return [];
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
    
    return [];
  } catch (error) {
    console.error("Error in page parsing transcript method:", error);
    return [];
  }
}
