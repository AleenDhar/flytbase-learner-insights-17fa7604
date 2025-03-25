
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { RocketIcon, Bookmark, CheckCircle, Clock, Award, Trash2 } from 'lucide-react';
import UserCourses from '@/components/UserCourses';
import UserWatchlist from '@/components/UserWatchlist';
import UserCertificates from '@/components/UserCertificates';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  
  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      
      // Delete user data from database tables
      // This assumes RLS policies are in place to ensure users can only delete their own data
      await supabase.from('user_watchlist').delete().eq('user_id', user?.id);
      await supabase.from('user_courses').delete().eq('user_id', user?.id);
      
      // Finally, delete the user account itself
      const { error } = await supabase.auth.admin.deleteUser(user?.id || '');
      
      if (error) throw error;
      
      // Sign out after account deletion
      await signOut();
      
      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted.",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Error",
        description: "There was a problem deleting your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-flytbase-primary">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-100">Student Dashboard</h1>
            <p className="text-neutral-400 mt-1">Welcome, {user?.email?.split('@')[0] || "Student"}! Track your progress and explore your courses</p>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  account and remove all of your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                >
                  {isDeleting ? "Deleting..." : "Delete Account"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        
        <Tabs defaultValue="in-progress" className="space-y-8">
          <TabsList className="bg-[#1A1F2C] border border-white/5">
            <TabsTrigger value="in-progress" className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              In Progress
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4" />
              Completed
            </TabsTrigger>
            <TabsTrigger value="watchlist" className="flex items-center">
              <Bookmark className="mr-2 h-4 w-4" />
              Watchlist
            </TabsTrigger>
            <TabsTrigger value="certificates" className="flex items-center">
              <Award className="mr-2 h-4 w-4" />
              Certificates
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="in-progress" className="animate-fade-in">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-4">Continue Learning</h2>
              <UserCourses type="in_progress" />
            </div>
          </TabsContent>
          
          <TabsContent value="completed" className="animate-fade-in">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-4">Completed Courses</h2>
              <UserCourses type="completed" />
            </div>
          </TabsContent>
          
          <TabsContent value="watchlist" className="animate-fade-in">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-4">Your Watchlist</h2>
              <UserWatchlist />
            </div>
          </TabsContent>
          
          <TabsContent value="certificates" className="animate-fade-in">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-4">Your Certificates</h2>
              <UserCertificates />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
