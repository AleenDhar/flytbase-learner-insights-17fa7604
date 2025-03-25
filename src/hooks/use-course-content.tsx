
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

  const fetchVideoQuestions = async (videoId: string) => {
    try {
      // Fetch video questions from Supabase
      const { data: questionsData, error: questionsError } = await supabase
        .from('video_questions')
        .select(`
          id,
          question_text,
          video_question_options (
            id,
            option_text,
            is_correct
          )
        `)
        .eq('video_id', videoId);
      
      if (questionsError) throw questionsError;
      
      if (questionsData && questionsData.length > 0) {
        // Format questions into the expected structure
        const questions = questionsData.map(q => ({
          question: q.question_text,
          options: q.video_question_options.map(opt => ({
            id: opt.id,
            text: opt.option_text
          })),
          correctAnswer: q.video_question_options.find(opt => opt.is_correct)?.id || ''
        }));
        
        return questions;
      }
      
      // If no questions found in the database, proceed with AI generation
      return null;
    } catch (error) {
      console.error("Error fetching video questions:", error);
      return null;
    }
  };

  const fetchContent = async (videoId: string, retryCount: number) => {
    setContent(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      console.log(`Fetching content for video ${videoId}, attempt #${retryCount + 1}`);
      
      // 1. First try to fetch pre-defined questions from the database
      const dbQuestions = await fetchVideoQuestions(videoId);
      
      if (dbQuestions) {
        console.log(`Found ${dbQuestions.length} pre-defined questions for video ${videoId}`);
        setContent({
          summary: null, // No summary needed when using pre-defined questions
          questions: dbQuestions,
          loading: false,
          error: null,
          retryCount,
          retry: () => fetchContent(videoId, retryCount + 1)
        });
        return;
      }
      
      // 2. If no pre-defined questions, fetch transcript and generate content
      const transcript = await fetchTranscript(videoId);
      
      if (!transcript) {
        const errorMsg = 'Failed to fetch transcript for this video. The video might not have captions available.';
        console.error(errorMsg);
        throw new Error(errorMsg);
      }
      
      console.log(`Successfully fetched transcript with ${transcript.length} segments, proceeding to content generation`);
      
      // 3. Generate summary
      const summaryResponse = await supabase.functions.invoke('generate-course-content', {
        body: { transcript, contentType: 'summary' }
      });
      
      if (summaryResponse.error) {
        console.error('Failed to generate summary:', summaryResponse.error);
        throw new Error(`Failed to generate summary: ${summaryResponse.error.message}`);
      }
      
      // 4. Generate questions
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
