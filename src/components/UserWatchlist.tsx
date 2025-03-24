
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookmarkMinus, ArrowRight, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

// Mock course data until we integrate with a real course API
const COURSES = [
  { id: 'course-1', title: 'Drone Basics: Flight Principles', thumbnail: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1' },
  { id: 'course-2', title: 'Advanced Flight Operations', thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d' },
  { id: 'course-3', title: 'Drone Programming & Automation', thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c' },
  { id: 'course-4', title: 'Aerial Photography Techniques', thumbnail: 'https://images.unsplash.com/photo-1552152974-19b9caf99137' },
  { id: 'course-5', title: 'Drone Maintenance & Repair', thumbnail: 'https://images.unsplash.com/photo-1597733336794-12d05021d510' },
];

export interface WatchlistItem {
  id: string;
  course_id: string;
  added_at: string;
}

interface UserWatchlistProps {
  limit?: number;
  showViewAll?: boolean;
}

const UserWatchlist: React.FC<UserWatchlistProps> = ({ limit = 3, showViewAll = false }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const { data: watchlistItems, isLoading, error } = useQuery({
    queryKey: ['userWatchlist', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_watchlist')
        .select('*')
        .eq('user_id', user.id)
        .order('added_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Error fetching watchlist:', error);
        throw error;
      }
      
      return data as WatchlistItem[];
    },
    enabled: !!user,
  });
  
  const removeFromWatchlistMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('user_watchlist')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userWatchlist'] });
      toast({
        title: "Removed from watchlist",
        description: "The course has been removed from your watchlist."
      });
    },
    onError: (error) => {
      console.error('Error removing from watchlist:', error);
      toast({
        title: "Error",
        description: "Failed to remove the course from your watchlist.",
        variant: "destructive"
      });
    }
  });
  
  const getCourseDetails = (courseId: string) => {
    return COURSES.find(course => course.id === courseId) || {
      id: courseId,
      title: 'Unknown Course',
      thumbnail: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1'
    };
  };
  
  const handleRemoveFromWatchlist = (id: string) => {
    removeFromWatchlistMutation.mutate(id);
  };
  
  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-24 bg-neutral-200 rounded-lg" />
      ))}
    </div>;
  }
  
  if (error) {
    return <div className="text-red-500">Error loading watchlist</div>;
  }
  
  if (!watchlistItems || watchlistItems.length === 0) {
    return <div className="text-center py-6">
      <p className="text-neutral-500 mb-4">Your watchlist is empty.</p>
      <Button asChild>
        <Link to="/courses">Browse Courses</Link>
      </Button>
    </div>;
  }
  
  return (
    <div className="space-y-4">
      {watchlistItems.map((item) => {
        const course = getCourseDetails(item.course_id);
        return (
          <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="flex">
              <div className="w-24 h-24 flex-shrink-0">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
              </div>
              <CardContent className="flex-1 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Bookmark className="h-4 w-4 text-flytbase-secondary" />
                      <h3 className="font-medium text-base line-clamp-1">{course.title}</h3>
                    </div>
                    <p className="text-xs text-neutral-500">Added on {new Date(item.added_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => handleRemoveFromWatchlist(item.id)}
                      disabled={removeFromWatchlistMutation.isPending}
                    >
                      <BookmarkMinus className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/courses/${course.id}`}>
                        View
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        );
      })}
      
      {showViewAll && watchlistItems.length > 0 && (
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

export default UserWatchlist;
