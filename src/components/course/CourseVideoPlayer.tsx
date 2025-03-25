
import React, { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Info, Volume2, VolumeX, Maximize, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
  const [showControls, setShowControls] = useState(false);
  
  // Loading state skeleton
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

  // No video available state
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
    <div 
      className="aspect-video relative"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <iframe 
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${moduleVideoId}?rel=0`}
        title={moduleTitle || "Course video"}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      
      {/* Custom controls overlay - only shown on hover */}
      <div 
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 transition-opacity duration-200",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="flex justify-between items-center">
          <div className="text-white text-sm truncate max-w-[60%]">
            {moduleTitle}
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20"
              title="Volume"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20"
              title="Fullscreen"
            >
              <Maximize className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/20"
              title="Settings"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseVideoPlayer;
