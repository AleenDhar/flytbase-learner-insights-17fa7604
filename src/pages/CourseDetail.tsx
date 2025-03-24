
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
  Youtube
} from 'lucide-react';
import { CourseProps } from '@/components/CourseCard';
import { coursesData } from './Courses';

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<CourseProps | null>(null);
  const [activeModule, setActiveModule] = useState(0);
  const [expandedModules, setExpandedModules] = useState<number[]>([0]);

  // Updated module data for the FlytBase course with the YouTube playlist
  const flytbaseModulesData = [
    { 
      title: "Introduction to FlytBase", 
      duration: "10 mins",
      description: "Get started with FlytBase drone automation platform",
      videoId: "Eb6yAhXlwGY", // First video from the playlist
      completed: false,
      playlistId: "PLmINGqoqKHT1Y9hbHzzFUEpXHcbE4-nko",
      lessons: [
        { title: "FlytBase Introduction", duration: "10 mins", completed: false }
      ]
    },
    { 
      title: "FlytOS Installation", 
      duration: "18 mins",
      description: "Learn how to install FlytOS on your drone",
      videoId: "ZEHG-jQYvfw", // Second video from the playlist
      completed: false,
      playlistId: "PLmINGqoqKHT1Y9hbHzzFUEpXHcbE4-nko",
      lessons: [
        { title: "FlytOS Installation Steps", duration: "18 mins", completed: false }
      ]
    },
    { 
      title: "Getting Started with FlytAPI", 
      duration: "15 mins",
      description: "Introduction to FlytAPI for drone automation",
      videoId: "mHLtI2wWYqw", // Third video from the playlist
      completed: false,
      playlistId: "PLmINGqoqKHT1Y9hbHzzFUEpXHcbE4-nko",
      lessons: [
        { title: "FlytAPI Basics", duration: "15 mins", completed: false }
      ]
    },
    { 
      title: "FlytConsole Interface", 
      duration: "11 mins",
      description: "Navigate and use the FlytConsole web interface",
      videoId: "eo8yZqP1dBU", // Fourth video from the playlist
      completed: false,
      playlistId: "PLmINGqoqKHT1Y9hbHzzFUEpXHcbE4-nko",
      lessons: [
        { title: "FlytConsole Interface Overview", duration: "11 mins", completed: false }
      ]
    }
  ];

  // Original module data for other courses
  const defaultModulesData = [
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

  // Function to determine which module data to use based on the course
  const getModuleDataForCourse = (course: CourseProps | null) => {
    if (!course) return defaultModulesData;
    
    // Check if this is the FlytBase course
    if (course.title.includes("FlytBase")) {
      return flytbaseModulesData;
    }
    
    return defaultModulesData;
  };

  const [modulesData, setModulesData] = useState(defaultModulesData);

  useEffect(() => {
    // In a real app, this would be an API call
    const foundCourse = coursesData.find(c => c.id === courseId) || null;
    setCourse(foundCourse);
    
    // Set the appropriate module data based on the course
    setModulesData(getModuleDataForCourse(foundCourse));
  }, [courseId]);

  const toggleModuleExpand = (index: number) => {
    setExpandedModules(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
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
    <div className="min-h-screen bg-flytbase-light">
      <Navigation />
      
      {/* Header */}
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
                  <span>{course.modules} Modules</span>
                </div>
                <div className="flex items-center text-neutral-300">
                  <Clock className="mr-2 h-5 w-5" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center text-neutral-300">
                  <Award className="mr-2 h-5 w-5" />
                  <span>Certificate on Completion</span>
                </div>
                {modulesData[0].playlistId && (
                  <div className="flex items-center text-neutral-300">
                    <Youtube className="mr-2 h-5 w-5" />
                    <span>YouTube Playlist</span>
                  </div>
                )}
              </div>

              <Button size="lg" className="bg-flytbase-accent-orange text-white hover:bg-flytbase-accent-orange/90">
                Enroll Now
              </Button>
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
      
      {/* Course Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Sidebar - Module List */}
            <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center text-flytbase-primary">
                <List className="mr-2 h-5 w-5" />
                Course Modules
              </h2>
              
              <div className="space-y-3">
                {modulesData.map((module, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <button
                      className={`w-full flex justify-between items-center p-3 text-left transition-colors ${
                        activeModule === index ? 'bg-flytbase-secondary/10 text-flytbase-secondary' : 'hover:bg-neutral-50'
                      }`}
                      onClick={() => {
                        setActiveModule(index);
                        if (!expandedModules.includes(index)) {
                          toggleModuleExpand(index);
                        }
                      }}
                    >
                      <div className="flex items-center">
                        {module.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                          <PlayCircle className="h-5 w-5 text-neutral-400 mr-2" />
                        )}
                        <span className="font-medium">{module.title}</span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleModuleExpand(index);
                        }}
                        className="p-1 rounded-full hover:bg-neutral-100"
                      >
                        {expandedModules.includes(index) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </button>
                    
                    {expandedModules.includes(index) && (
                      <div className="bg-neutral-50 p-3 border-t">
                        <p className="text-sm text-neutral-500 mb-2">{module.duration}</p>
                        <ul className="space-y-2">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <li key={lessonIndex} className="flex items-center text-sm">
                              {lesson.completed ? (
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                              ) : (
                                <div className="h-4 w-4 border border-neutral-300 rounded-full mr-2 flex-shrink-0" />
                              )}
                              <span className="flex-1">{lesson.title}</span>
                              <span className="text-neutral-400 text-xs">{lesson.duration}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Main Content - Video Player & Description */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Video Player */}
                <div className="aspect-video">
                  {modulesData[activeModule].playlistId ? (
                    <iframe 
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${modulesData[activeModule].videoId}?rel=0&list=${modulesData[activeModule].playlistId}`}
                      title={modulesData[activeModule].title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <iframe 
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${modulesData[activeModule].videoId}?rel=0`}
                      title={modulesData[activeModule].title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  )}
                </div>
                
                {/* Module Information */}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-flytbase-primary">{modulesData[activeModule].title}</h2>
                    <Badge variant="outline" className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {modulesData[activeModule].duration}
                    </Badge>
                  </div>
                  
                  <p className="text-neutral-600 mb-6">
                    {modulesData[activeModule].description}
                  </p>
                  
                  {/* YouTube Playlist link if available */}
                  {modulesData[activeModule].playlistId && (
                    <div className="mb-6">
                      <a 
                        href={`https://www.youtube.com/playlist?list=${modulesData[activeModule].playlistId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-flytbase-accent-orange hover:text-flytbase-accent-orange/90 transition-colors"
                      >
                        <Youtube className="mr-2 h-5 w-5" />
                        View Full YouTube Playlist
                      </a>
                    </div>
                  )}
                  
                  <Separator className="my-6" />
                  
                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      disabled={activeModule === 0}
                      onClick={() => activeModule > 0 && setActiveModule(activeModule - 1)}
                    >
                      Previous Module
                    </Button>
                    
                    <Button
                      disabled={activeModule === modulesData.length - 1}
                      onClick={() => activeModule < modulesData.length - 1 && setActiveModule(activeModule + 1)}
                      className="bg-flytbase-secondary hover:bg-flytbase-secondary/90"
                    >
                      Next Module
                    </Button>
                  </div>
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
