
// Common utility functions and constants

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper to create a standard transcript segment structure
export interface TranscriptSegment {
  text: string;
  start: number;
  duration: number;
}

// Extract segments from JSON format transcript data
export function extractSegmentsFromJson(transcriptData: any): TranscriptSegment[] {
  if (!transcriptData.events) {
    return [];
  }
  
  return transcriptData.events
    .filter((event: any) => event.segs && event.segs.length > 0)
    .map((event: any) => {
      const text = event.segs
        .map((seg: any) => seg.utf8 || '')
        .join('')
        .trim();
      
      return {
        text,
        start: event.tStartMs / 1000,
        duration: (event.dDurationMs || 1000) / 1000
      };
    })
    .filter((segment: any) => segment.text.length > 0);
}

// Extract segments from XML format transcript data
export function extractSegmentsFromXml(xmlText: string): TranscriptSegment[] {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "text/xml");
  const textElements = xmlDoc.getElementsByTagName("text");
  
  const transcript = [];
  for (let i = 0; i < textElements.length; i++) {
    const element = textElements[i];
    const start = parseFloat(element.getAttribute("start") || "0");
    const duration = parseFloat(element.getAttribute("dur") || "0");
    const text = element.textContent || "";
    
    transcript.push({
      text: text.trim(),
      start,
      duration
    });
  }
  
  return transcript;
}
