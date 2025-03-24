
/**
 * Utility functions for formatting YouTube API data
 */

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
