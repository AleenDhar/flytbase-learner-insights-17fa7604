
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
    // YouTube doesn't provide an official API for transcripts, 
    // so we'll need to use a third-party service or alternative approach
    
    // For now, we'll implement a basic fetch from an API that can extract YouTube transcripts
    const response = await fetch(`https://api.supabase.flytbase.com/functions/v1/get-youtube-transcript?videoId=${videoId}`);
    
    if (!response.ok) {
      console.error('Failed to fetch transcript:', response.statusText);
      return null;
    }
    
    const data = await response.json();
    return data.transcript;
  } catch (error) {
    console.error('Error fetching transcript:', error);
    return null;
  }
};
