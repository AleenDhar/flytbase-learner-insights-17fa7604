
import { useState, useEffect } from 'react';
import { fetchTranscript } from '@/utils/youtube/fetchTranscript';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Question {
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
}

interface CourseContent {
  summary: string | null;
  questions: Question[] | null;
  loading: boolean;
  error: string | null;
  retryCount: number;
  retry: () => void;
}

export const useCourseContent = (videoId: string | undefined) => {
  const [content, setContent] = useState<CourseContent>({
    summary: null,
    questions: null,
    loading: false,
    error: null,
    retryCount: 0,
    retry: () => {}
  });

  const fetchContent = async (videoId: string, retryCount: number) => {
    setContent(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      console.log(`Fetching content for video ${videoId}, attempt #${retryCount + 1}`);
      
      // 1. Fetch transcript
      const transcript = await fetchTranscript(videoId);
      
      if (!transcript) {
        const errorMsg = 'Failed to fetch transcript for this video. The video might not have captions available.';
        console.error(errorMsg);
        throw new Error(errorMsg);
      }
      
      console.log(`Successfully fetched transcript with ${transcript.length} segments, proceeding to content generation`);
      
      // 2. Generate summary
      const summaryResponse = await supabase.functions.invoke('generate-course-content', {
        body: { transcript, contentType: 'summary' }
      });
      
      if (summaryResponse.error) {
        console.error('Failed to generate summary:', summaryResponse.error);
        throw new Error(`Failed to generate summary: ${summaryResponse.error.message}`);
      }
      
      // 3. Generate questions
      const questionsResponse = await supabase.functions.invoke('generate-course-content', {
        body: { transcript, contentType: 'questions' }
      });
      
      if (questionsResponse.error) {
        console.error('Failed to generate questions:', questionsResponse.error);
        throw new Error(`Failed to generate questions: ${questionsResponse.error.message}`);
      }
      
      setContent({
        summary: summaryResponse.data.summary,
        questions: questionsResponse.data.questions,
        loading: false,
        error: null,
        retryCount,
        retry: () => fetchContent(videoId, retryCount + 1)
      });
    } catch (error) {
      console.error('Error fetching course content:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      
      // Show error toast to user
      toast({
        title: "Content Generation Failed",
        description: errorMessage,
        variant: "destructive"
      });
      
      setContent(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        retryCount,
        retry: () => fetchContent(videoId, retryCount + 1)
      }));
    }
  };

  useEffect(() => {
    if (!videoId) return;
    
    fetchContent(videoId, 0);
  }, [videoId]);

  return content;
};
