
import { fetchTimedTextTranscriptDirect } from "./direct-fetcher.ts";
import { fetchTranscriptFromPage } from "./page-fetcher.ts";
import { TranscriptSegment } from "./utils.ts";

// Try multiple approaches with retry logic
export async function fetchTranscriptWithRetries(videoId: string): Promise<TranscriptSegment[]> {
  // First try to get transcript directly
  let transcript = await fetchTimedTextTranscriptDirect(videoId);
    
  // If direct method fails, try the page parsing approach
  if (!transcript || transcript.length === 0) {
    console.log("Direct transcript fetch failed, trying page parsing approach...");
    transcript = await fetchTranscriptFromPage(videoId);
  }
  
  return transcript;
}
