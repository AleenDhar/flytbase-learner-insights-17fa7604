
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

/**
 * Interface for transcript segments
 */
export interface TranscriptSegment {
  text: string;
  start: number;
  duration: number;
}

/**
 * Multiple choice question option
 */
export interface QuestionOption {
  id: string; // A, B, C, D
  text: string;
}

/**
 * Multiple choice question
 */
export interface Question {
  question: string;
  options: QuestionOption[];
  correctAnswer: string; // A, B, C, D
}

/**
 * Course content generated from video
 */
export interface CourseContent {
  summary: string;
  questions: Question[];
}
