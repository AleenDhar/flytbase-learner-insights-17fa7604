
import React from 'react';
import Navigation from '@/components/Navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { RocketIcon, Bookmark, CheckCircle, Clock } from 'lucide-react';
import UserCourses from '@/components/UserCourses';
import UserWatchlist from '@/components/UserWatchlist';

const Dashboard = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-flytbase-primary">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-100">Student Dashboard</h1>
            <p className="text-neutral-400 mt-1">Welcome, {user?.email?.split('@')[0] || "Student"}! Track your progress and explore your courses</p>
          </div>
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
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
