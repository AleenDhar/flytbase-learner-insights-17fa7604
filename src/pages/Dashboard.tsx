
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentProgress from '@/components/StudentProgress';
import LearningPaths from '@/components/LearningPaths';
import { useUser } from '@clerk/clerk-react';
import TestimonialForm from '@/components/TestimonialForm';
import { Button } from "@/components/ui/button";
import { RocketIcon } from 'lucide-react';

const Dashboard = () => {
  const { user } = useUser();
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [completedCourse, setCompletedCourse] = useState<{id: string, name: string} | null>(null);
  
  // This function would be called when a course is completed
  const handleCourseCompletion = (courseId: string, courseName: string) => {
    setCompletedCourse({ id: courseId, name: courseName });
    setShowTestimonialForm(true);
  };
  
  return (
    <div className="min-h-screen bg-flytbase-primary">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-100">Student Dashboard</h1>
            <p className="text-neutral-400 mt-1">Welcome, {user?.firstName || "Student"}! Track your progress and explore learning opportunities</p>
          </div>
          
          {/* Demo button to simulate course completion - remove in production */}
          <Button 
            onClick={() => handleCourseCompletion("demo-course-123", "Drone Piloting Fundamentals")}
            className="bg-flytbase-secondary text-white hover:bg-flytbase-secondary/90"
          >
            <RocketIcon className="mr-2 h-4 w-4" />
            Demo: Complete Course
          </Button>
        </div>
        
        <Tabs defaultValue="progress" className="space-y-8">
          <TabsList className="bg-[#1A1F2C] border border-white/5">
            <TabsTrigger value="progress">My Progress</TabsTrigger>
            <TabsTrigger value="paths">Learning Paths</TabsTrigger>
          </TabsList>
          
          <TabsContent value="progress" className="animate-fade-in">
            <StudentProgress />
          </TabsContent>
          
          <TabsContent value="paths" className="animate-fade-in">
            <LearningPaths />
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Testimonial form popup */}
      <TestimonialForm 
        isOpen={showTestimonialForm}
        onClose={() => setShowTestimonialForm(false)}
        courseId={completedCourse?.id}
        courseName={completedCourse?.name}
      />
    </div>
  );
};

export default Dashboard;
