import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { formatDuration } from './formatters';
import { YouTubeVideo, YouTubePlaylistResponse } from './types';
import { 
  YOUTUBE_API_KEY, 
  MAX_API_RETRIES,
  PLAYLIST_ITEMS_ENDPOINT,
  VIDEOS_ENDPOINT
} from './constants';

/**
 * Custom hook to fetch YouTube playlist data
 * @param playlistId YouTube playlist ID
 * @returns Object containing videos array, loading state, and error
 */
export const useYouTubePlaylist = (playlistId: string | undefined): YouTubePlaylistResponse => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Reset state on playlistId change to avoid stale data
    setVideos([]);
    setError(null);
    setLoading(true);
    
    // Don't fetch if no playlistId is provided
    if (!playlistId) {
      setLoading(false);
      return;
    }

    let isMounted = true; // Flag to prevent state updates if component unmounts

    const fetchPlaylistItems = async () => {
      try {
        console.log(`Fetching playlist items for ID: ${playlistId}`);
        
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
            // If there are no items on the first page, set empty array and exit
            if (allVideos.length === 0) {
              if (isMounted) {
                setVideos([]);
                setLoading(false);
              }
              return;
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
        
        // Update state with all videos
        if (isMounted) {
          setVideos(allVideos);
          setError(null); // Clear any previous errors
          console.log(`Successfully fetched ${allVideos.length} videos from YouTube playlist`);
        }
      } catch (err) {
        console.error('Error fetching YouTube data:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        
        // Only update state if component is still mounted
        if (isMounted) {
          setError(errorMessage);
          
          // Show error toast for API key issues
          if (errorMessage.includes('API key not valid') || errorMessage.includes('Invalid YouTube API key')) {
            toast({
              title: "YouTube API Error",
              description: "Unable to load videos due to an API configuration issue. Default content will be shown instead.",
              variant: "destructive"
            });
          }
          
          // Retry logic
          if (retryCount < MAX_API_RETRIES) {
            console.log(`Retrying fetch (${retryCount + 1}/${MAX_API_RETRIES})...`);
            setRetryCount(prev => prev + 1);
            // We'll retry with an exponential backoff
            setTimeout(() => {
              if (isMounted) {
                fetchPlaylistItems();
              }
            }, 1000 * Math.pow(2, retryCount));
            return;
          }
        }
      } finally {
        // Always update loading state if component is mounted
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPlaylistItems();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [playlistId, retryCount]);

  return { videos, loading, error };
};
