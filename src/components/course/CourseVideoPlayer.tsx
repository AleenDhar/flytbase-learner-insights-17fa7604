
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Info } from 'lucide-react';

interface CourseVideoPlayerProps {
  loading: boolean;
  moduleVideoId?: string;
  moduleTitle?: string;
  hasModules: boolean;
}

const CourseVideoPlayer: React.FC<CourseVideoPlayerProps> = ({ 
  loading, 
  moduleVideoId, 
  moduleTitle,
  hasModules 
}) => {
  if (loading) {
    return (
      <div className="aspect-video bg-[#0F1623]">
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-white/10 h-12 w-12 flex items-center justify-center mb-3">
              <div className="h-6 w-6 text-white/40" />
            </div>
            <div className="h-4 bg-white/10 rounded w-48 mb-2.5"></div>
            <div className="h-3 bg-white/10 rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!hasModules || !moduleVideoId) {
    return (
      <div className="aspect-video bg-[#0F1623] flex items-center justify-center">
        <div className="text-center p-8">
          <Info className="h-10 w-10 text-white/40 mx-auto mb-3" />
          <p className="text-white/60">No video content available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-video">
      <iframe 
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${moduleVideoId}?rel=0`}
        title={moduleTitle || "Course video"}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default CourseVideoPlayer;
