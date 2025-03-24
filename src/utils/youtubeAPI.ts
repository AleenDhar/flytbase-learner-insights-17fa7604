
import { useState, useEffect } from 'react';

// Interface for a single YouTube video item
export interface YouTubeVideo {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
}

const API_KEY = 'AIzaSyDOlMICk5Oz6yAM5nHQ_JzixQBGKulOFYA'; // You would typically store this in an environment variable

/**
 * Formats the ISO 8601 duration from YouTube API into a human-readable format
 * @param duration YouTube duration in ISO 8601 format (e.g., PT1H30M45S)
 * @returns Human readable duration (e.g., 1:30:45)
 */
export const formatDuration = (duration: string): string => {
  // Remove the "PT" prefix
  const time = duration.replace('PT', '');
  
  // Initialize hours, minutes, and seconds
  let hours = 0;
  let minutes = 0;
  let seconds = 0;
  
  // Extract hours if present
  if (time.includes('H')) {
    const hoursSplit = time.split('H');
    hours = parseInt(hoursSplit[0], 10);
    duration = hoursSplit[1];
  }
  
  // Extract minutes if present
  if (time.includes('M')) {
    const minutesSplit = time.split('M');
    minutes = parseInt(minutesSplit[0].replace(/[^0-9]/g, ''), 10);
    duration = minutesSplit[1];
  }
  
  // Extract seconds if present
  if (time.includes('S')) {
    seconds = parseInt(time.split('S')[0].replace(/[^0-9]/g, ''), 10);
  }
  
  // Format the output based on whether hours are present
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
};

/**
 * Custom hook to fetch YouTube playlist data
 * @param playlistId YouTube playlist ID
 * @returns Object containing videos array and loading state
 */
export const useYouTubePlaylist = (playlistId: string | undefined) => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

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
            `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}${pageParam}&key=${API_KEY}`
          );
          
          if (!playlistResponse.ok) {
            const errorData = await playlistResponse.json().catch(() => ({}));
            console.error("YouTube API Error:", errorData);
            throw new Error(`Failed to fetch playlist data: ${playlistResponse.status} ${playlistResponse.statusText}`);
          }
          
          const playlistData = await playlistResponse.json();
          console.log(`Retrieved playlist page with ${playlistData.items?.length || 0} items`);
          
          if (!playlistData.items || playlistData.items.length === 0) {
            // If there are no items on the first page, set empty array and exit
            if (allVideos.length === 0) {
              setVideos([]);
              setLoading(false);
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
              `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds}&key=${API_KEY}`
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
        setVideos(allVideos);
        console.log(`Successfully fetched ${allVideos.length} videos from YouTube playlist`);
      } catch (err) {
        console.error('Error fetching YouTube data:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        
        // Retry logic
        if (retryCount < maxRetries) {
          console.log(`Retrying fetch (${retryCount + 1}/${maxRetries})...`);
          setRetryCount(prev => prev + 1);
          // We'll retry with an exponential backoff
          setTimeout(() => {
            fetchPlaylistItems();
          }, 1000 * Math.pow(2, retryCount));
          return;
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylistItems();
  }, [playlistId, retryCount]);

  return { videos, loading, error };
};
