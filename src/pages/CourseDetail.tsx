import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import WatchlistButton from '@/components/WatchlistButton';
import CourseContentSection from '@/components/CourseContentSection';
import { 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  Award, 
  List, 
  PlayCircle, 
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Info,
  AlertCircle,
  Video
} from 'lucide-react';
import { CourseProps } from '@/components/CourseCard';
import { coursesData } from './Courses';
import { useYouTubePlaylist, YouTubeVideo } from '@/utils/youtubeAPI';

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
    const foundCourse = coursesData.find(c => c.id === courseId) || null;
    setCourse(foundCourse);
    setIsLoading(true);
    
    if (foundCourse && foundCourse.youtubePlaylistId) {
      setHasPlaylist(true);
      setPlaylistId(foundCourse.youtubePlaylistId);
    } else {
      setHasPlaylist(false);
      setModulesData(defaultModulesData);
      setIsLoading(false);
      setPlaylistId(undefined);
    }
  }, [courseId]);

  const { videos, loading, error } = useYouTubePlaylist(playlistId);

  useEffect(() => {
    if (!hasPlaylist || !course) return;

    if (!loading) {
      if (videos.length > 0) {
        console.log(`Processing ${videos.length} videos for course modules`);
        
        const playlistModules = videos.map((video: YouTubeVideo, index: number): ModuleData => ({
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
      
      <section className="pt-20 md:pt-24 bg-flytbase-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link to="/courses" className="inline-flex items-center text-neutral-300 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Courses
          </Link>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Badge className="mb-4">{course.level}</Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-neutral-300 text-lg mb-6">{course.description}</p>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center text-neutral-300">
                  <BookOpen className="mr-2 h-5 w-5" />
                  <span>{modulesData.length > 0 ? modulesData.length : course.modules} Modules</span>
                </div>
                <div className="flex items-center text-neutral-300">
                  <Clock className="mr-2 h-5 w-5" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center text-neutral-300">
                  <Award className="mr-2 h-5 w-5" />
                  <span>Certificate on Completion</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="lg" className="bg-flytbase-accent-orange text-white hover:bg-flytbase-accent-orange/90">
                  Enroll Now
                </Button>
                <WatchlistButton courseId={courseId || ""} variant="outline" />
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-12 bg-[#0B121E]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1 bg-[#131A27] p-6 rounded-lg shadow-sm border border-white/5">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-white">
                <List className="mr-2 h-5 w-5" />
                Course Modules
              </h2>
              
              {loading || isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((_, index) => (
                    <div key={index} className="border border-white/10 rounded-lg overflow-hidden">
                      <div className="p-3">
                        <Skeleton className="h-6 w-full bg-white/5" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="p-4 border border-red-500/20 bg-red-900/10 rounded-lg">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-300">
                      Error loading course content: Using default modules
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {modulesData.map((module, index) => (
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
              )}
            </div>
            
            <div className="md:col-span-2">
              <div className="bg-[#131A27] rounded-lg shadow-sm overflow-hidden border border-white/5 mb-6">
                {loading || isLoading ? (
                  <div className="aspect-video bg-[#0F1623]">
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-pulse flex flex-col items-center">
                        <div className="rounded-full bg-white/10 h-12 w-12 flex items-center justify-center mb-3">
                          <PlayCircle className="h-6 w-6 text-white/40" />
                        </div>
                        <div className="h-4 bg-white/10 rounded w-48 mb-2.5"></div>
                        <div className="h-3 bg-white/10 rounded w-32"></div>
                      </div>
                    </div>
                  </div>
                ) : modulesData.length > 0 ? (
                  <div className="aspect-video">
                    <iframe 
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${modulesData[activeModule].videoId}?rel=0`}
                      title={modulesData[activeModule].title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <div className="aspect-video bg-[#0F1623] flex items-center justify-center">
                    <div className="text-center p-8">
                      <Info className="h-10 w-10 text-white/40 mx-auto mb-3" />
                      <p className="text-white/60">No video content available</p>
                    </div>
                  </div>
                )}
                
                <div className="p-6">
                  {loading || isLoading ? (
                    <div className="space-y-4">
                      <Skeleton className="h-8 w-2/3 bg-white/5" />
                      <Skeleton className="h-4 w-24 bg-white/5" />
                      <Skeleton className="h-4 w-full bg-white/5" />
                      <Skeleton className="h-4 w-full bg-white/5" />
                      <Skeleton className="h-4 w-2/3 bg-white/5" />
                    </div>
                  ) : modulesData.length > 0 ? (
                    <>
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold text-white">{modulesData[activeModule].title}</h2>
                        <Badge variant="outline" className="flex items-center border-white/20 text-white/80">
                          <Clock className="mr-1.5 h-3 w-3" />
                          {modulesData[activeModule].duration}
                        </Badge>
                      </div>
                      
                      <p className="text-white/70 mb-6">
                        {modulesData[activeModule].description}
                      </p>
                      
                      <Button
                        onClick={() => setShowContent(true)}
                        className="mb-6 bg-flytbase-secondary hover:bg-flytbase-secondary/90 w-full"
                      >
                        Show Content & Knowledge Check
                      </Button>
                      
                      {showContent && (
                        <CourseContentSection 
                          videoId={modulesData[activeModule].videoId}
                          courseId={courseId || ""}
                          onQuizComplete={handleQuizComplete}
                        />
                      )}
                      
                      <Separator className="my-6 bg-white/10" />
                      
                      <div className="flex justify-between items-center">
                        <Button
                          variant="outline"
                          disabled={activeModule === 0}
                          onClick={() => {
                            if (activeModule > 0) {
                              setActiveModule(activeModule - 1);
                              setShowContent(false);
                            }
                          }}
                          className="border-white/10 text-white hover:bg-white/5 hover:text-white"
                        >
                          Previous Module
                        </Button>
                        
                        <Button
                          disabled={activeModule === modulesData.length - 1 || (!moduleCompleted && !modulesData[activeModule].completed)}
                          onClick={() => {
                            if (activeModule < modulesData.length - 1) {
                              setActiveModule(activeModule + 1);
                              setShowContent(false);
                              setModuleCompleted(false);
                            }
                          }}
                          className="bg-flytbase-secondary hover:bg-flytbase-secondary/90"
                        >
                          {(!moduleCompleted && !modulesData[activeModule].completed) 
                            ? "Complete Quiz to Continue" 
                            : "Next Module"}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Info className="h-10 w-10 text-white/40 mx-auto mb-3" />
                      <h3 className="text-lg font-medium text-white">No module information</h3>
                      <p className="text-white/60 mt-1 max-w-lg mx-auto">
                        Module information for this course is not available at the moment.
                      </p>
                    </div>
                  )}
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
