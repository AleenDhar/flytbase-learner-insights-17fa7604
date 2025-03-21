
import React from 'react';
import Navigation from '@/components/Navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CoursePopularity from '@/components/CoursePopularity';
import StudentProgress from '@/components/StudentProgress';
import LearningPaths from '@/components/LearningPaths';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-flytbase-primary">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-100">Student Dashboard</h1>
            <p className="text-neutral-400 mt-1">Track your progress and explore learning opportunities</p>
          </div>
        </div>
        
        <Tabs defaultValue="progress" className="space-y-8">
          <TabsList className="bg-[#1A1F2C] border border-white/5">
            <TabsTrigger value="progress">My Progress</TabsTrigger>
            <TabsTrigger value="courses">Course Insights</TabsTrigger>
            <TabsTrigger value="paths">Learning Paths</TabsTrigger>
          </TabsList>
          
          <TabsContent value="progress" className="animate-fade-in">
            <StudentProgress />
          </TabsContent>
          
          <TabsContent value="courses" className="animate-fade-in">
            <CoursePopularity />
          </TabsContent>
          
          <TabsContent value="paths" className="animate-fade-in">
            <LearningPaths />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
