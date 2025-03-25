
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { List, PlayCircle } from 'lucide-react';
import { CourseProps } from '@/components/CourseCard';
import { useYouTubePlaylist } from '@/utils/youtubeAPI';
import CourseHeader from '@/components/course/CourseHeader';
import CourseModuleList from '@/components/course/CourseModuleList';
import CourseVideoPlayer from '@/components/course/CourseVideoPlayer';
import CourseContentDetails from '@/components/course/CourseContentDetails';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

const defaultModulesData: ModuleData[] = [
  { 
    title: "Introduction to Drones", 
    duration: "45 mins",
    description: "Overview of drone technology and applications",
    videoId: "O-b1_T_1xGs",
    completed: true,
    lessons: [
      { title: "What are Drones?", duration: "10 mins", completed: true },
      { title: "History of Drone Technology", duration: "15 mins", completed: true },
      { title: "Types of Drones", duration: "20 mins", completed: true }
    ]
  },
  { 
    title: "Basic Flight Controls", 
    duration: "1 hour",
    description: "Learn the fundamental controls for piloting a drone",
    videoId: "U1Z-iqLVHnk",
    completed: false,
    lessons: [
      { title: "Pre-Flight Checklist", duration: "12 mins", completed: false },
      { title: "Takeoff and Landing", duration: "18 mins", completed: false },
      { title: "Basic Maneuvers", duration: "15 mins", completed: false },
      { title: "Emergency Procedures", duration: "15 mins", completed: false }
    ]
  },
  { 
    title: "Understanding Flight Dynamics", 
    duration: "1.5 hours",
    description: "Learn about drone physics and how they affect flight",
    videoId: "E9j8GtuQUHk",
    completed: false,
    lessons: [
      { title: "Principles of Flight", duration: "20 mins", completed: false },
      { title: "Weather Considerations", duration: "25 mins", completed: false },
      { title: "Flight Planning", duration: "25 mins", completed: false }
    ]
  }
];

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<CourseProps | null>(null);
  const [activeModule, setActiveModule] = useState(0);
  const [expandedModules, setExpandedModules] = useState<number[]>([0]);
  const [modulesData, setModulesData] = useState<ModuleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPlaylist, setHasPlaylist] = useState(false);
  const [playlistId, setPlaylistId] = useState<string | undefined>(undefined);
  const [showContent, setShowContent] = useState(false);
  const [moduleCompleted, setModuleCompleted] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true);
      
      try {
        // First try to fetch from Supabase
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('*')
          .eq('id', courseId)
          .single();
        
        if (courseError || !courseData) {
          // If not found in Supabase, use the mock data
          const mockCourse = {
            id: courseId || '',
            title: 'Drone Flight Fundamentals',
            description: 'Master the essentials of drone piloting with our comprehensive course.',
            category: 'Drone Piloting',
            level: 'Beginner',
            modules: 3,
            duration: '3 hours',
            instructorName: 'John Smith',
            instructorTitle: 'Chief Drone Pilot',
            youtubePlaylistId: undefined,
            thumbnail: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1',
            rating: 4.8,
            reviews: 120,
          };
          
          setCourse(mockCourse);
          setHasPlaylist(false);
          setModulesData(defaultModulesData);
          setIsLoading(false);
          setPlaylistId(undefined);
        } else {
          // Use Supabase data
          const supabaseCourse = {
            id: courseData.id,
            title: courseData.title,
            description: courseData.description || '',
            category: 'Drone Piloting',
            level: 'Beginner',
            modules: courseData.video_count || 0,
            duration: `${courseData.video_count || 0} modules`,
            instructorName: 'FlytBase Academy',
            instructorTitle: 'Drone Education Team',
            youtubePlaylistId: courseData.playlist_id,
            thumbnail: courseData.thumbnail || 'https://images.unsplash.com/photo-1531297484001-80022131f5a1',
            rating: 4.5,
            reviews: 50,
          };
          
          setCourse(supabaseCourse);
          
          if (courseData.playlist_id) {
            setHasPlaylist(true);
            setPlaylistId(courseData.playlist_id);
          } else {
            // If no playlist, fetch videos directly
            const { data: videosData, error: videosError } = await supabase
              .from('videos')
              .select('*')
              .eq('course_id', courseId);
            
            if (!videosError && videosData && videosData.length > 0) {
              // Map videos to modules format
              const videoModules = videosData.map((video) => ({
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
              setIsLoading(false);
            } else {
              // Fallback to default modules
              setModulesData(defaultModulesData);
              setIsLoading(false);
            }
            
            setHasPlaylist(false);
          }
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        setCourse(null);
        setIsLoading(false);
      }
    };
    
    fetchCourse();
  }, [courseId]);

  const { videos, loading, error } = useYouTubePlaylist(playlistId);

  useEffect(() => {
    if (!hasPlaylist || !course) return;

    if (!loading) {
      if (videos.length > 0) {
        console.log(`Processing ${videos.length} videos for course modules`);
        
        const playlistModules = videos.map((video, index) => ({
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
        setIsLoading(false);
      } else if (error) {
        console.error("Using default modules due to YouTube API error:", error);
        
        if (!error.includes('API key')) {
          toast({
            title: "Error Loading Content",
            description: "Couldn't load course videos. Showing default content instead.",
            variant: "destructive"
          });
        }
        
        setModulesData(defaultModulesData);
        setIsLoading(false);
      } else {
        console.log("No videos found in playlist, using default modules");
        setModulesData(defaultModulesData);
        setIsLoading(false);
      }
    }
  }, [course, videos, loading, error, hasPlaylist]);

  // Check if module has been completed by user
  useEffect(() => {
    const checkModuleProgress = async () => {
      if (!courseId) return;
      
      try {
        const { data: userCoursesData } = await supabase
          .from('user_courses')
          .select('progress, status')
          .eq('course_id', courseId)
          .single();
          
        if (userCoursesData) {
          // Mark modules as completed based on user progress
          const progress = userCoursesData.progress;
          const completedModulesCount = Math.floor((progress / 100) * modulesData.length);
          
          const updatedModules = [...modulesData];
          for (let i = 0; i < completedModulesCount; i++) {
            if (updatedModules[i]) {
              updatedModules[i].completed = true;
            }
          }
          
          setModulesData(updatedModules);
        }
      } catch (error) {
        console.error("Error checking module progress:", error);
      }
    };
    
    if (modulesData.length > 0 && !isLoading) {
      checkModuleProgress();
    }
  }, [courseId, modulesData.length, isLoading]);

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

  if (!course) {
    return (
      <div className="min-h-screen bg-flytbase-light">
        <Navigation />
        <div className="pt-24 pb-12 text-center">
          <h1 className="text-2xl font-bold">Course not found</h1>
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
                loading={loading || isLoading}
                error={error}
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
                  loading={loading || isLoading}
                  moduleVideoId={modulesData[activeModule]?.videoId}
                  moduleTitle={modulesData[activeModule]?.title}
                  hasModules={modulesData.length > 0}
                />
                
                <div className="p-6">
                  <CourseContentDetails 
                    loading={loading || isLoading}
                    modules={modulesData}
                    activeModule={activeModule}
                    courseId={courseId || ""}
                    showContent={showContent}
                    setShowContent={setShowContent}
                    moduleCompleted={moduleCompleted}
                    handleQuizComplete={handleQuizComplete}
                    handlePreviousModule={handlePreviousModule}
                    handleNextModule={handleNextModule}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetail;
