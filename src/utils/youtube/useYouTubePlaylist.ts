
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { 
  YouTubeVideo, 
  YouTubePlaylistResponse 
} from './types';
import { formatDuration } from './formatters';
import { fetchPlaylistVideos } from './api';

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

    const loadPlaylistData = async () => {
      try {
        console.log(`Fetching playlist items for ID: ${playlistId}`);
        
        const results = await fetchPlaylistVideos(playlistId);
        
        // Update state with all videos if component is still mounted
        if (isMounted) {
          setVideos(results);
          setError(null);
          console.log(`Successfully fetched ${results.length} videos from YouTube playlist`);
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
          
          // Retry logic implemented in fetchPlaylistVideos
          if (retryCount < 3) {
            console.log(`Retrying fetch (${retryCount + 1}/3)...`);
            setRetryCount(prev => prev + 1);
          }
        }
      } finally {
        // Always update loading state if component is mounted
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadPlaylistData();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [playlistId, retryCount]);

  return { videos, loading, error };
};
