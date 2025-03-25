
import { TranscriptSegment, extractSegmentsFromJson, extractSegmentsFromXml } from "./utils.ts";

// Direct approach - fetch from timedtext API without page parsing
export async function fetchTimedTextTranscriptDirect(videoId: string): Promise<TranscriptSegment[]> {
  try {
    console.log("Attempting direct timedtext API approach");
    // First try to get available transcript info
    const infoUrl = `https://www.youtube.com/api/timedtext?type=list&v=${videoId}`;
    const infoResponse = await fetch(infoUrl);
    
    if (!infoResponse.ok) {
      console.error(`Failed to fetch transcript info: ${infoResponse.status}`);
      return [];
    }
    
    const infoText = await infoResponse.text();
    
    // Try to get the first available language
    const langMatch = infoText.match(/lang_code="([^"]+)"/);
    if (!langMatch) {
      console.log("No language codes found in transcript info");
      return [];
    }
    
    const langCode = langMatch[1];
    console.log(`Found language code: ${langCode}`);
    
    // Fetch the transcript with the identified language
    const transcriptUrl = `https://www.youtube.com/api/timedtext?lang=${langCode}&v=${videoId}&fmt=json3`;
    const transcriptResponse = await fetch(transcriptUrl);
    
    if (!transcriptResponse.ok) {
      console.error(`Failed to fetch transcript: ${transcriptResponse.status}`);
      return [];
    }
    
    try {
      // Try JSON format first (newer videos)
      const transcriptData = await transcriptResponse.json();
      const segments = extractSegmentsFromJson(transcriptData);
      
      if (segments.length > 0) {
        console.log(`Direct approach succeeded with ${segments.length} segments`);
        return segments;
      }
    } catch (e) {
      // If JSON parsing fails, try XML format (older videos)
      console.log("JSON parsing failed, trying XML format");
      
      const xmlUrl = `https://www.youtube.com/api/timedtext?lang=${langCode}&v=${videoId}`;
      const xmlResponse = await fetch(xmlUrl);
      
      if (!xmlResponse.ok) {
        console.error(`Failed to fetch XML transcript: ${xmlResponse.status}`);
        return [];
      }
      
      const xmlText = await xmlResponse.text();
      const transcript = extractSegmentsFromXml(xmlText);
      
      if (transcript.length > 0) {
        console.log(`XML approach succeeded with ${transcript.length} segments`);
        return transcript;
      }
    }
    
    return [];
  } catch (error) {
    console.error("Error in direct transcript fetch method:", error);
    return [];
  }
}
