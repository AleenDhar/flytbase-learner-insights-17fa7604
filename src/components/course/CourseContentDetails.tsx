
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Info } from 'lucide-react';
import CourseContentSection from '@/components/CourseContentSection';

interface ModuleData {
  title: string;
  duration: string;
  description: string;
  videoId: string;
  completed: boolean;
  lessons: any[];
}

interface CourseContentDetailsProps {
  loading: boolean;
  modules: ModuleData[];
  activeModule: number;
  courseId: string;
  showContent: boolean;
  setShowContent: (show: boolean) => void;
  moduleCompleted: boolean;
  handleQuizComplete: () => void;
  handlePreviousModule: () => void;
  handleNextModule: () => void;
}

const CourseContentDetails: React.FC<CourseContentDetailsProps> = ({
  loading,
  modules,
  activeModule,
  courseId,
  showContent,
  setShowContent,
  moduleCompleted,
  handleQuizComplete,
  handlePreviousModule,
  handleNextModule
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-2/3 bg-white/5" />
        <Skeleton className="h-4 w-24 bg-white/5" />
        <Skeleton className="h-4 w-full bg-white/5" />
        <Skeleton className="h-4 w-full bg-white/5" />
        <Skeleton className="h-4 w-2/3 bg-white/5" />
      </div>
    );
  }

  if (modules.length === 0) {
    return (
      <div className="text-center py-8">
        <Info className="h-10 w-10 text-white/40 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-white">No module information</h3>
        <p className="text-white/60 mt-1 max-w-lg mx-auto">
          Module information for this course is not available at the moment.
        </p>
      </div>
    );
  }

  const currentModule = modules[activeModule];

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-white">{currentModule.title}</h2>
        <Badge variant="outline" className="flex items-center border-white/20 text-white/80">
          <Clock className="mr-1.5 h-3 w-3" />
          {currentModule.duration}
        </Badge>
      </div>
      
      <p className="text-white/70 mb-6">
        {currentModule.description}
      </p>
      
      <Button
        onClick={() => setShowContent(true)}
        className="mb-6 bg-flytbase-secondary hover:bg-flytbase-secondary/90 w-full"
      >
        Show Content & Knowledge Check
      </Button>
      
      {showContent && (
        <CourseContentSection 
          videoId={currentModule.videoId}
          courseId={courseId}
          onQuizComplete={handleQuizComplete}
        />
      )}
      
      <Separator className="my-6 bg-white/10" />
      
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          disabled={activeModule === 0}
          onClick={handlePreviousModule}
          className="border-white/10 text-white hover:bg-white/5 hover:text-white"
        >
          Previous Module
        </Button>
        
        <Button
          disabled={activeModule === modules.length - 1 || (!moduleCompleted && !currentModule.completed)}
          onClick={handleNextModule}
          className="bg-flytbase-secondary hover:bg-flytbase-secondary/90"
        >
          {(!moduleCompleted && !currentModule.completed) 
            ? "Complete Quiz to Continue" 
            : "Next Module"}
        </Button>
      </div>
    </>
  );
};

export default CourseContentDetails;
