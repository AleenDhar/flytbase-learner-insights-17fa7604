
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
export const useYouTubePlaylist = (playlistId: string) => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaylistItems = async () => {
      try {
        setLoading(true);
        
        // First fetch playlist items (this gives us video IDs)
        const playlistResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${API_KEY}`
        );
        
        if (!playlistResponse.ok) {
          throw new Error('Failed to fetch playlist data');
        }
        
        const playlistData = await playlistResponse.json();
        
        if (!playlistData.items || playlistData.items.length === 0) {
          setVideos([]);
          setLoading(false);
          return;
        }
        
        // Extract video IDs from playlist items
        const videoIds = playlistData.items.map((item: any) => item.snippet.resourceId.videoId).join(',');
        
        // Then fetch video details (this gives us duration)
        const videoDetailsResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds}&key=${API_KEY}`
        );
        
        if (!videoDetailsResponse.ok) {
          throw new Error('Failed to fetch video details');
        }
        
        const videoDetailsData = await videoDetailsResponse.json();
        
        // Map the response to our simpler format
        const processedVideos = videoDetailsData.items.map((video: any) => ({
          id: video.id,
          title: video.snippet.title,
          duration: formatDuration(video.contentDetails.duration),
          thumbnail: video.snippet.thumbnails.medium.url
        }));
        
        setVideos(processedVideos);
      } catch (err) {
        console.error('Error fetching YouTube data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (playlistId) {
      fetchPlaylistItems();
    }
  }, [playlistId]);

  return { videos, loading, error };
};
