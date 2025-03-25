
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navigation from '@/components/Navigation';
import { List, PlayCircle } from 'lucide-react';
import { useYouTubePlaylist } from '@/utils/youtubeAPI';
import CourseHeader from '@/components/course/CourseHeader';
import CourseModuleList from '@/components/course/CourseModuleList';
import CourseVideoPlayer from '@/components/course/CourseVideoPlayer';
import CourseContentDetails from '@/components/course/CourseContentDetails';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface ModuleData {
  title: string;
  duration: string;
  description: string;
  videoId: string;
  completed: boolean;
  lessons: {
    title: string;
    duration: string;
    completed: boolean;
  }[];
  playlistId?: string;
}

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const [activeModule, setActiveModule] = useState(0);
  const [expandedModules, setExpandedModules] = useState<number[]>([0]);
  const [modulesData, setModulesData] = useState<ModuleData[]>([]);
  const [hasPlaylist, setHasPlaylist] = useState(false);
  const [playlistId, setPlaylistId] = useState<string | undefined>(undefined);
  const [showContent, setShowContent] = useState(false);
  const [moduleCompleted, setModuleCompleted] = useState(false);

  // Fetch course data from Supabase
  const { data: course, isLoading: isCourseLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      if (!courseId) throw new Error('Course ID is required');
      
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        title: data.title,
        description: data.description || '',
        category: 'Drone Piloting',
        level: 'Beginner', // We don't have this in our database yet
        modules: data.video_count || 0,
        duration: `${data.video_count || 0} modules`,
        instructorName: 'FlytBase Academy',
        instructorTitle: 'Drone Education Team',
        youtubePlaylistId: data.playlist_id,
        thumbnail: data.thumbnail || 'https://images.unsplash.com/photo-1531297484001-80022131f5a1',
        rating: 4.5,
        reviews: 50,
      };
    },
    enabled: !!courseId,
  });

  // Fetch videos for this course
  const { data: videos, isLoading: isVideosLoading } = useQuery({
    queryKey: ['course-videos', courseId],
    queryFn: async () => {
      if (!courseId) throw new Error('Course ID is required');
      
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('course_id', courseId);
      
      if (error) throw error;
      
      return data;
    },
    enabled: !!courseId,
  });

  // Fetch user course progress
  const { data: userProgress, isLoading: isProgressLoading } = useQuery({
    queryKey: ['user-course-progress', courseId, user?.id],
    queryFn: async () => {
      if (!courseId || !user) return null;
      
      const { data, error } = await supabase
        .from('user_courses')
        .select('*')
        .eq('course_id', courseId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      
      return data;
    },
    enabled: !!courseId && !!user,
  });
  
  useEffect(() => {
    if (course?.youtubePlaylistId) {
      setHasPlaylist(true);
      setPlaylistId(course.youtubePlaylistId);
    } else if (videos && videos.length > 0) {
      // Map videos to modules format
      const videoModules = videos.map((video) => ({
        title: video.title,
        duration: '15 mins', // Default value
        description: video.about || `${video.title} module`,
        videoId: video.youtube_video_id,
        completed: false,
        lessons: [
          { title: video.title, duration: '15 mins', completed: false }
        ]
      }));
      
      setModulesData(videoModules);
      
      // Mark modules as completed based on user progress
      if (userProgress) {
        const progress = userProgress.progress;
        const completedModulesCount = Math.floor((progress / 100) * videoModules.length);
        
        const updatedModules = [...videoModules];
        for (let i = 0; i < completedModulesCount; i++) {
          if (updatedModules[i]) {
            updatedModules[i].completed = true;
          }
        }
        
        setModulesData(updatedModules);
      }
    }
  }, [course, videos, userProgress]);

  const { videos: playlistVideos, loading: isPlaylistLoading } = useYouTubePlaylist(playlistId);

  useEffect(() => {
    if (!hasPlaylist || !course) return;

    if (!isPlaylistLoading && playlistVideos.length > 0) {
      console.log(`Processing ${playlistVideos.length} videos for course modules`);
      
      const playlistModules = playlistVideos.map((video, index) => ({
        title: video.title,
        duration: video.duration,
        description: `Module ${index + 1} of the ${course.title} course`,
        videoId: video.id,
        completed: false,
        playlistId: course.youtubePlaylistId,
        lessons: [
          { title: video.title, duration: video.duration, completed: false }
        ]
      }));
      
      setModulesData(playlistModules);
      
      // Mark modules as completed based on user progress
      if (userProgress) {
        const progress = userProgress.progress;
        const completedModulesCount = Math.floor((progress / 100) * playlistModules.length);
        
        const updatedModules = [...playlistModules];
        for (let i = 0; i < completedModulesCount; i++) {
          if (updatedModules[i]) {
            updatedModules[i].completed = true;
          }
        }
        
        setModulesData(updatedModules);
      }
    }
  }, [course, playlistVideos, isPlaylistLoading, hasPlaylist, userProgress]);

  const toggleModuleExpand = (index: number) => {
    setExpandedModules(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  const handleQuizComplete = () => {
    setModuleCompleted(true);
    
    if (activeModule < modulesData.length - 1) {
      const updatedModules = [...modulesData];
      updatedModules[activeModule].completed = true;
      setModulesData(updatedModules);
    }
  };
  
  const handlePreviousModule = () => {
    if (activeModule > 0) {
      setActiveModule(activeModule - 1);
      setShowContent(false);
    }
  };
  
  const handleNextModule = () => {
    if (activeModule < modulesData.length - 1) {
      setActiveModule(activeModule + 1);
      setShowContent(false);
      setModuleCompleted(false);
    }
  };

  if (isCourseLoading || !course) {
    return (
      <div className="min-h-screen bg-flytbase-primary">
        <Navigation />
        <div className="pt-24 pb-12 text-center">
          <div className="animate-pulse max-w-7xl mx-auto">
            <div className="h-20 bg-neutral-800 rounded-lg mb-6"></div>
            <div className="h-96 bg-neutral-800 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-flytbase-primary text-white">
      <Navigation />
      
      <CourseHeader 
        course={course} 
        courseId={courseId || ""} 
        moduleCount={modulesData.length > 0 ? modulesData.length : course.modules} 
      />
      
      <section className="py-12 bg-[#0B121E]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1 bg-[#131A27] p-6 rounded-lg shadow-sm border border-white/5">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-white">
                <List className="mr-2 h-5 w-5" />
                Course Modules
              </h2>
              
              <CourseModuleList 
                loading={isPlaylistLoading || isVideosLoading}
                error={null}
                modules={modulesData}
                activeModule={activeModule}
                expandedModules={expandedModules}
                setActiveModule={setActiveModule}
                toggleModuleExpand={toggleModuleExpand}
                setShowContent={setShowContent}
              />
            </div>
            
            <div className="md:col-span-2">
              <div className="bg-[#131A27] rounded-lg shadow-sm overflow-hidden border border-white/5 mb-6">
                <CourseVideoPlayer 
                  loading={isPlaylistLoading || isVideosLoading}
                  moduleVideoId={modulesData[activeModule]?.videoId}
                  moduleTitle={modulesData[activeModule]?.title}
                  hasModules={modulesData.length > 0}
                />
              </div>
              
              {showContent && modulesData[activeModule] && (
                <CourseContentDetails
                  moduleId={modulesData[activeModule]?.videoId}
                  moduleCompleted={moduleCompleted}
                  onQuizComplete={handleQuizComplete}
                  onPreviousModule={handlePreviousModule}
                  onNextModule={handleNextModule}
                  isLastModule={activeModule === modulesData.length - 1}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetail;
