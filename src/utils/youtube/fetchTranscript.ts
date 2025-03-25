
/**
 * Utility to fetch YouTube video transcripts
 */

export interface TranscriptSegment {
  text: string;
  start: number;
  duration: number;
}

/**
 * Fetches the transcript for a YouTube video
 * @param videoId The YouTube video ID
 * @returns An array of transcript segments or null if no transcript is available
 */
export const fetchTranscript = async (videoId: string): Promise<TranscriptSegment[] | null> => {
  try {
    // Make 3 attempts to fetch the transcript with exponential backoff
    let attempt = 0;
    const maxAttempts = 3;
    let lastError: any = null;
    
    while (attempt < maxAttempts) {
      try {
        console.log(`Attempting to fetch transcript for video ${videoId}, attempt ${attempt + 1}/${maxAttempts}`);
        
        // Add timestamp to prevent caching issues
        const timestamp = new Date().getTime();
        const response = await fetch(
          `https://api.supabase.flytbase.com/functions/v1/get-youtube-transcript?videoId=${videoId}&_=${timestamp}`,
          {
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          }
        );
        
        if (!response.ok) {
          console.error(`Attempt ${attempt + 1}/${maxAttempts} - Failed to fetch transcript:`, response.statusText);
          throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
          console.error(`Attempt ${attempt + 1}/${maxAttempts} - Error from transcript API:`, data.error);
          throw new Error(data.error);
        }
        
        if (!data.transcript || data.transcript.length === 0) {
          console.error(`Attempt ${attempt + 1}/${maxAttempts} - No transcript segments returned`);
          throw new Error('No transcript segments returned');
        }
        
        console.log(`Successfully fetched transcript with ${data.transcript.length} segments`);
        return data.transcript;
      } catch (error) {
        lastError = error;
        attempt++;
        
        if (attempt < maxAttempts) {
          // Exponential backoff: 1s, 2s, 4s...
          const delay = Math.pow(2, attempt - 1) * 1000;
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    
    // If we're here, all attempts failed
    console.error('All transcript fetch attempts failed:', lastError);
    return null;
  } catch (error) {
    console.error('Error fetching transcript:', error);
    return null;
  }
};
