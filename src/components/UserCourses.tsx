
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, Book, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface UserCourse {
  id: string;
  course_id: string;
  progress: number;
  status: string; // Changed from union type to string to match DB
  started_at: string | null;
  completed_at: string | null;
  last_accessed_at: string | null;
  course?: {
    id: string;
    title: string;
    thumbnail: string;
  };
  // Additional properties from the database
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface UserCoursesProps {
  type: 'completed' | 'in_progress' | 'all';
  limit?: number;
  showViewAll?: boolean;
}

const UserCourses: React.FC<UserCoursesProps> = ({ type, limit = 3, showViewAll = false }) => {
  const { user } = useAuth();
  
  const { data: userCourses, isLoading, error } = useQuery({
    queryKey: ['userCourses', user?.id, type],
    queryFn: async () => {
      if (!user) return [];
      
      let query = supabase
        .from('user_courses')
        .select('*, course_id')
        .eq('user_id', user.id);
      
      if (type !== 'all') {
        query = query.eq('status', type);
      }
      
      const { data: userCoursesData, error: userCoursesError } = await query
        .order('last_accessed_at', { ascending: false })
        .limit(limit);
      
      if (userCoursesError) {
        console.error('Error fetching user courses:', userCoursesError);
        throw userCoursesError;
      }
      
      // We need to separately fetch the course details
      if (userCoursesData && userCoursesData.length > 0) {
        const courseIds = userCoursesData.map(uc => uc.course_id);
        
        const { data: coursesData, error: coursesError } = await supabase
          .from('courses')
          .select('id, title, thumbnail')
          .in('id', courseIds);
        
        if (coursesError) {
          console.error('Error fetching courses:', coursesError);
          throw coursesError;
        }
        
        // Map the courses to the user courses
        const userCoursesWithCourseDetails = userCoursesData.map(userCourse => {
          const courseDetails = coursesData.find(course => course.id === userCourse.course_id);
          return {
            ...userCourse,
            course: courseDetails ? {
              id: courseDetails.id,
              title: courseDetails.title,
              thumbnail: courseDetails.thumbnail || ''
            } : undefined
          };
        });
        
        return userCoursesWithCourseDetails as UserCourse[];
      }
      
      return [];
    },
    enabled: !!user,
  });
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <Book className="h-5 w-5 text-neutral-500" />;
    }
  };
  
  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-24 bg-neutral-200 rounded-lg" />
      ))}
    </div>;
  }
  
  if (error) {
    return <div className="text-red-500">Error loading courses</div>;
  }
  
  if (!userCourses || userCourses.length === 0) {
    return <div className="text-center py-6">
      <p className="text-neutral-500 mb-4">
        {type === 'completed' ? 'You haven\'t completed any courses yet.' :
         type === 'in_progress' ? 'You don\'t have any courses in progress.' :
         'You haven\'t enrolled in any courses yet.'}
      </p>
      <Button asChild>
        <Link to="/courses">Browse Courses</Link>
      </Button>
    </div>;
  }
  
  return (
    <div className="space-y-4">
      {userCourses.map((userCourse) => {
        return (
          <Card key={userCourse.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="flex">
              <div className="w-24 h-24 flex-shrink-0">
                <img 
                  src={userCourse.course?.thumbnail || 'https://images.unsplash.com/photo-1531297484001-80022131f5a1'} 
                  alt={userCourse.course?.title || 'Course'} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <CardContent className="flex-1 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(userCourse.status)}
                      <h3 className="font-medium text-base line-clamp-1">{userCourse.course?.title || 'Unknown Course'}</h3>
                    </div>
                    <div className="mb-3">
                      <Progress value={userCourse.progress} className="h-2" />
                      <p className="text-xs text-neutral-500 mt-1">{userCourse.progress}% complete</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/courses/${userCourse.course_id}`}>
                      {userCourse.status === 'completed' ? 'Review' : 'Continue'}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        );
      })}
      
      {showViewAll && (
        <div className="text-center mt-4">
          <Button variant="outline" asChild>
            <Link to="/dashboard" className="flex items-center">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserCourses;
