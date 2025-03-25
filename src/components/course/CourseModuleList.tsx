
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, CheckCircle, ChevronDown, ChevronUp, Video } from 'lucide-react';

interface LessonData {
  title: string;
  duration: string;
  completed: boolean;
}

interface ModuleData {
  title: string;
  duration: string;
  description: string;
  videoId: string;
  completed: boolean;
  lessons: LessonData[];
  playlistId?: string;
}

interface CourseModuleListProps {
  loading: boolean;
  error?: string | null;
  modules: ModuleData[];
  activeModule: number;
  expandedModules: number[];
  setActiveModule: (index: number) => void;
  toggleModuleExpand: (index: number) => void;
  setShowContent: (show: boolean) => void;
}

const CourseModuleList: React.FC<CourseModuleListProps> = ({
  loading,
  error,
  modules,
  activeModule,
  expandedModules,
  setActiveModule,
  toggleModuleExpand,
  setShowContent
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((_, index) => (
          <div key={index} className="border border-white/10 rounded-lg overflow-hidden">
            <div className="p-3">
              <Skeleton className="h-6 w-full bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-500/20 bg-red-900/10 rounded-lg">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-300">
            Error loading course content: Using default modules
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {modules.map((module, index) => (
        <div key={index} className="border border-white/10 rounded-lg overflow-hidden bg-[#1A2133]">
          <button
            className={`w-full flex justify-between items-center p-3 text-left transition-colors ${
              activeModule === index ? 'bg-flytbase-secondary/20 text-flytbase-secondary' : 'hover:bg-[#1E2639]'
            }`}
            onClick={() => {
              setActiveModule(index);
              setShowContent(false);
              if (!expandedModules.includes(index)) {
                toggleModuleExpand(index);
              }
            }}
          >
            <div className="flex items-center">
              {module.completed ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <Video className="h-5 w-5 text-white/60 mr-2" />
              )}
              <span className="font-medium truncate">{module.title}</span>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleModuleExpand(index);
              }}
              className="p-1 rounded-full hover:bg-white/5"
            >
              {expandedModules.includes(index) ? (
                <ChevronUp className="h-4 w-4 text-white/60" />
              ) : (
                <ChevronDown className="h-4 w-4 text-white/60" />
              )}
            </button>
          </button>
          
          {expandedModules.includes(index) && (
            <div className="bg-[#17202F] p-3 border-t border-white/5">
              <p className="text-sm text-white/60 mb-2">{module.duration}</p>
              <ul className="space-y-2">
                {module.lessons.map((lesson, lessonIndex) => (
                  <li key={lessonIndex} className="flex items-center text-sm">
                    {lesson.completed ? (
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    ) : (
                      <div className="h-4 w-4 border border-white/20 rounded-full mr-2 flex-shrink-0" />
                    )}
                    <span className="flex-1 text-white/80 truncate">{lesson.title}</span>
                    <span className="text-white/40 text-xs">{lesson.duration}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CourseModuleList;
