
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

interface WatchlistButtonProps {
  courseId: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

const WatchlistButton: React.FC<WatchlistButtonProps> = ({ courseId, className, variant = "outline" }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  
  const { data: watchlistItem, isLoading: checkingWatchlist } = useQuery({
    queryKey: ['watchlistStatus', user?.id, courseId],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_watchlist')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
        console.error('Error checking watchlist status:', error);
      }
      
      return data;
    },
    enabled: !!user,
  });
  
  const addToWatchlistMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      setIsLoading(true);
      const { error } = await supabase
        .from('user_watchlist')
        .insert({
          user_id: user.id,
          course_id: courseId
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlistStatus'] });
      queryClient.invalidateQueries({ queryKey: ['userWatchlist'] });
      toast({
        title: "Added to watchlist",
        description: "This course has been added to your watchlist"
      });
      setIsLoading(false);
    },
    onError: (error) => {
      console.error('Error adding to watchlist:', error);
      toast({
        title: "Error",
        description: "Failed to add course to your watchlist",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  });
  
  const removeFromWatchlistMutation = useMutation({
    mutationFn: async () => {
      if (!user || !watchlistItem) throw new Error('User not authenticated or item not found');
      
      setIsLoading(true);
      const { error } = await supabase
        .from('user_watchlist')
        .delete()
        .eq('id', watchlistItem.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlistStatus'] });
      queryClient.invalidateQueries({ queryKey: ['userWatchlist'] });
      toast({
        title: "Removed from watchlist",
        description: "This course has been removed from your watchlist"
      });
      setIsLoading(false);
    },
    onError: (error) => {
      console.error('Error removing from watchlist:', error);
      toast({
        title: "Error",
        description: "Failed to remove course from your watchlist",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  });
  
  const handleToggleWatchlist = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add courses to your watchlist",
        variant: "destructive"
      });
      return;
    }
    
    if (watchlistItem) {
      removeFromWatchlistMutation.mutate();
    } else {
      addToWatchlistMutation.mutate();
    }
  };
  
  const inWatchlist = !!watchlistItem;
  
  return (
    <Button
      variant={variant}
      size="sm"
      className={className}
      onClick={handleToggleWatchlist}
      disabled={isLoading || checkingWatchlist}
    >
      {inWatchlist ? (
        <>
          <BookmarkCheck className="h-4 w-4 mr-2" />
          In Watchlist
        </>
      ) : (
        <>
          <Bookmark className="h-4 w-4 mr-2" />
          Add to Watchlist
        </>
      )}
    </Button>
  );
};

export default WatchlistButton;
