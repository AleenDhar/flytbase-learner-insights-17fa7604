
import { TranscriptSegment, extractSegmentsFromJson } from "./utils.ts";

// Page parsing approach - fetch the YouTube page and extract transcript data
export async function fetchTranscriptFromPage(videoId: string): Promise<TranscriptSegment[]> {
  try {
    console.log("Attempting page parsing approach");
    // Fetch the video page with a realistic user agent
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
    
    // Extract captions data
    const captionsMatch = videoPageHtml.match(/"captionTracks":\[(.*?)\]/);
    if (!captionsMatch || captionsMatch.length < 2) {
      console.log("No caption tracks found in page data");
      return [];
    }
    
    // Extract the URL for the first caption track
    const captionsData = captionsMatch[1];
    const urlMatch = captionsData.match(/"baseUrl":"(.*?)"/);
    
    if (!urlMatch || urlMatch.length < 2) {
      console.log("No baseUrl found in caption tracks");
      return [];
    }
    
    // Fetch and parse the transcript file
    let transcriptUrl = urlMatch[1].replace(/\\u0026/g, '&');
    transcriptUrl = `${transcriptUrl}&fmt=json3`;
    
    console.log(`Attempting to fetch transcript from: ${transcriptUrl}`);
    
    const transcriptResponse = await fetch(transcriptUrl);
    if (!transcriptResponse.ok) {
      console.error(`Failed to fetch transcript data: ${transcriptResponse.status}`);
      return [];
    }
    
    const transcriptData = await transcriptResponse.json();
    const segments = extractSegmentsFromJson(transcriptData);
    
    if (segments.length > 0) {
      console.log(`Page parsing approach succeeded with ${segments.length} segments`);
      return segments;
    }
    
    return [];
  } catch (error) {
    console.error("Error in page parsing transcript method:", error);
    return [];
  }
}
