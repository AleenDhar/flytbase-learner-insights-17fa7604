
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

    // Using a third-party service to get YouTube transcripts
    // This is a temporary implementation - in production, you might want to use a more reliable method
    const ytApiUrl = `https://youtube-transcriptor.p.rapidapi.com/transcript?video_id=${videoId}`;
    
    const response = await fetch(ytApiUrl, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Host': 'youtube-transcriptor.p.rapidapi.com',
        'X-RapidAPI-Key': Deno.env.get('RAPIDAPI_KEY') || '',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch transcript: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Process and format the transcript data
    let transcript = [];
    
    if (data && data.transcript && Array.isArray(data.transcript)) {
      transcript = data.transcript.map((item: any) => ({
        text: item.text,
        start: item.start,
        duration: item.duration
      }));
    }

    return new Response(
      JSON.stringify({ transcript }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in get-youtube-transcript function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
