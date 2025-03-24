
import { useState, useEffect } from 'react';
import { fetchTranscript } from '@/utils/youtube/fetchTranscript';
import { supabase } from '@/integrations/supabase/client';

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
}

export const useCourseContent = (videoId: string | undefined) => {
  const [content, setContent] = useState<CourseContent>({
    summary: null,
    questions: null,
    loading: false,
    error: null
  });

  useEffect(() => {
    if (!videoId) return;

    const fetchContent = async () => {
      setContent(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        // 1. Fetch transcript
        const transcript = await fetchTranscript(videoId);
        
        if (!transcript) {
          throw new Error('Failed to fetch transcript for this video');
        }
        
        // 2. Generate summary
        const summaryResponse = await supabase.functions.invoke('generate-course-content', {
          body: { transcript, contentType: 'summary' }
        });
        
        if (summaryResponse.error) {
          throw new Error(`Failed to generate summary: ${summaryResponse.error.message}`);
        }
        
        // 3. Generate questions
        const questionsResponse = await supabase.functions.invoke('generate-course-content', {
          body: { transcript, contentType: 'questions' }
        });
        
        if (questionsResponse.error) {
          throw new Error(`Failed to generate questions: ${questionsResponse.error.message}`);
        }
        
        setContent({
          summary: summaryResponse.data.summary,
          questions: questionsResponse.data.questions,
          loading: false,
          error: null
        });
      } catch (error) {
        console.error('Error fetching course content:', error);
        setContent(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'An unknown error occurred'
        }));
      }
    };

    fetchContent();
  }, [videoId]);

  return content;
};
