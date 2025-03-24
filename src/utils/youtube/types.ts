
/**
 * Type definitions for YouTube API integration
 */

/**
 * Interface for a single YouTube video item
 */
export interface YouTubeVideo {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
}

/**
 * Response structure for useYouTubePlaylist hook
 */
export interface YouTubePlaylistResponse {
  videos: YouTubeVideo[];
  loading: boolean;
  error: string | null;
}
