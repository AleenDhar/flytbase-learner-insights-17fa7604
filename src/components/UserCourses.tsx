
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, Book, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

// Mock course data until we integrate with a real course API
const COURSES = [
  { id: 'course-1', title: 'Drone Basics: Flight Principles', thumbnail: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1' },
  { id: 'course-2', title: 'Advanced Flight Operations', thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d' },
  { id: 'course-3', title: 'Drone Programming & Automation', thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c' },
  { id: 'course-4', title: 'Aerial Photography Techniques', thumbnail: 'https://images.unsplash.com/photo-1552152974-19b9caf99137' },
  { id: 'course-5', title: 'Drone Maintenance & Repair', thumbnail: 'https://images.unsplash.com/photo-1597733336794-12d05021d510' },
];

export interface UserCourse {
  id: string;
  course_id: string;
  progress: number;
  status: 'completed' | 'in_progress' | 'not_started';
  started_at: string;
  completed_at: string | null;
  last_accessed_at: string;
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
        .select('*')
        .eq('user_id', user.id);
      
      if (type !== 'all') {
        query = query.eq('status', type);
      }
      
      const { data, error } = await query.order('last_accessed_at', { ascending: false }).limit(limit);
      
      if (error) {
        console.error('Error fetching user courses:', error);
        throw error;
      }
      
      return data as UserCourse[];
    },
    enabled: !!user,
  });
  
  const getCourseDetails = (courseId: string) => {
    return COURSES.find(course => course.id === courseId) || {
      id: courseId,
      title: 'Unknown Course',
      thumbnail: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1'
    };
  };
  
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
        const course = getCourseDetails(userCourse.course_id);
        return (
          <Card key={userCourse.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="flex">
              <div className="w-24 h-24 flex-shrink-0">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
              </div>
              <CardContent className="flex-1 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(userCourse.status)}
                      <h3 className="font-medium text-base line-clamp-1">{course.title}</h3>
                    </div>
                    <div className="mb-3">
                      <Progress value={userCourse.progress} className="h-2" />
                      <p className="text-xs text-neutral-500 mt-1">{userCourse.progress}% complete</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link to={`/courses/${course.id}`}>
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
