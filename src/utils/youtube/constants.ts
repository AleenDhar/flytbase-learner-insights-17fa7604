
/**
 * Constants related to YouTube API integration
 */

// YouTube API key
export const YOUTUBE_API_KEY = 'AIzaSyBnypq4XxELQJprMvw4nYbNx_odCybJSks';

// YouTube API base URLs
export const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3';
export const PLAYLIST_ITEMS_ENDPOINT = `${YOUTUBE_API_BASE_URL}/playlistItems`;
export const VIDEOS_ENDPOINT = `${YOUTUBE_API_BASE_URL}/videos`;

// Maximum number of retries for API calls
export const MAX_API_RETRIES = 3;
