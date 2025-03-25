import { 
  YOUTUBE_API_KEY, 
  MAX_API_RETRIES,
  PLAYLIST_ITEMS_ENDPOINT,
  VIDEOS_ENDPOINT
} from './constants';
import { YouTubeVideo } from './types';
import { formatDuration } from './formatters';

/**
 * Fetches all videos from a YouTube playlist with pagination support
 * @param playlistId The YouTube playlist ID
 * @returns Array of videos with formatted data
 */
export const fetchPlaylistVideos = async (playlistId: string): Promise<YouTubeVideo[]> => {
  // We'll use this to collect all videos from the playlist across multiple pages
  let allVideos: YouTubeVideo[] = [];
  let nextPageToken: string | undefined = undefined;
  
  // Loop to fetch all pages of playlist items
  do {
    // Construct URL with page token if available
    const pageParam = nextPageToken ? `&pageToken=${nextPageToken}` : '';
    
    // Fetch this page of playlist items
    const playlistResponse = await fetch(
      `${PLAYLIST_ITEMS_ENDPOINT}?part=snippet&maxResults=50&playlistId=${playlistId}${pageParam}&key=${YOUTUBE_API_KEY}`
    );
    
    if (!playlistResponse.ok) {
      const errorData = await playlistResponse.json().catch(() => ({}));
      console.error("YouTube API Error:", errorData);
      
      // If we have an API key error, show a specific error message
      if (errorData?.error?.message?.includes('API key not valid')) {
        throw new Error('Invalid YouTube API key. Please update the key to access videos.');
      }
      
      throw new Error(`Failed to fetch playlist data: ${playlistResponse.status} ${playlistResponse.statusText}`);
    }
    
    const playlistData = await playlistResponse.json();
    console.log(`Retrieved playlist page with ${playlistData.items?.length || 0} items`);
    
    if (!playlistData.items || playlistData.items.length === 0) {
      // If there are no items on the first page, return empty array
      if (allVideos.length === 0) {
        return [];
      }
      // Otherwise, we've reached the end of pagination
      break;
    }
    
    // Extract video IDs from this page of playlist items
    const videoIds = playlistData.items
      .map((item: any) => item.snippet?.resourceId?.videoId)
      .filter(Boolean) // Filter out any undefined/null values
      .join(',');
    
    // If we have video IDs, fetch their details
    if (videoIds) {
      const videoDetailsResponse = await fetch(
        `${VIDEOS_ENDPOINT}?part=contentDetails,snippet&id=${videoIds}&key=${YOUTUBE_API_KEY}`
      );
      
      if (!videoDetailsResponse.ok) {
        const errorData = await videoDetailsResponse.json().catch(() => ({}));
        console.error("YouTube Video Details API Error:", errorData);
        throw new Error(`Failed to fetch video details: ${videoDetailsResponse.status} ${videoDetailsResponse.statusText}`);
      }
      
      const videoDetailsData = await videoDetailsResponse.json();
      
      // Map the response to our simpler format
      const processedVideos = videoDetailsData.items.map((video: any) => ({
        id: video.id,
        title: video.snippet.title,
        duration: formatDuration(video.contentDetails.duration),
        thumbnail: video.snippet.thumbnails.medium.url
      }));
      
      // Add these videos to our accumulator
      allVideos = [...allVideos, ...processedVideos];
    }
    
    // Update the page token for the next iteration
    nextPageToken = playlistData.nextPageToken;
    
  } while (nextPageToken); // Continue until there are no more pages
  
  return allVideos;
};
