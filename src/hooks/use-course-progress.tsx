
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

export const useCourseProgress = (courseId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  
  const updateProgress = useMutation({
    mutationFn: async ({ progress, status }: { progress: number; status: 'not_started' | 'in_progress' | 'completed' }) => {
      if (!user) throw new Error('User not authenticated');
      
      setLoading(true);
      
      // First check if the user already has a record for this course
      const { data: existingRecord, error: checkError } = await supabase
        .from('user_courses')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingRecord) {
        // Update existing record
        const { error } = await supabase
          .from('user_courses')
          .update({
            progress,
            status,
            last_accessed_at: new Date().toISOString(),
            completed_at: status === 'completed' ? new Date().toISOString() : null
          })
          .eq('id', existingRecord.id);
        
        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('user_courses')
          .insert({
            user_id: user.id,
            course_id: courseId,
            progress,
            status,
            started_at: new Date().toISOString(),
            last_accessed_at: new Date().toISOString(),
            completed_at: status === 'completed' ? new Date().toISOString() : null
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userCourses'] });
      setLoading(false);
    },
    onError: (error) => {
      console.error('Error updating course progress:', error);
      toast({
        title: "Error",
        description: "Failed to update course progress",
        variant: "destructive"
      });
      setLoading(false);
    }
  });
  
  return {
    updateProgress: updateProgress.mutate,
    loading: loading || updateProgress.isPending
  };
};

export default useCourseProgress;
