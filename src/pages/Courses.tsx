import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import CourseCard, { CourseProps } from '@/components/CourseCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Search } from 'lucide-react';

// Mock data for courses
export const coursesData: CourseProps[] = [
  {
    id: "drone-basics",
    title: "Drone Piloting Fundamentals",
    description: "Learn the basics of drone piloting, from takeoff and landing to advanced maneuvers. This course covers all essential skills for beginners.",
    level: "Beginner",
    duration: "4 weeks",
    modules: 8,
    thumbnail: "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
    youtubePlaylistId: "PLZ8REt5zt2Plg5jpTAo6RvPg0H_JGvd2n"
  },
  {
    id: "advanced-flight",
    title: "Advanced Flight Operations",
    description: "Take your piloting skills to the next level with complex operations, obstacle navigation, and emergency procedures training.",
    level: "Intermediate",
    duration: "6 weeks",
    modules: 12,
    thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    youtubePlaylistId: "PLZ8REt5zt2Plg5jpTAo6RvPg0H_JGvd2n"
  },
  {
    id: "drone-programming",
    title: "Drone Programming & Automation",
    description: "Learn to automate drone flights and operations using Python and DroneKit. Build custom solutions for various industry applications.",
    level: "Advanced",
    duration: "8 weeks",
    modules: 10,
    thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    youtubePlaylistId: "PLZ8REt5zt2Plg5jpTAo6RvPg0H_JGvd2n"
  },
  {
    id: "aerial-photography",
    title: "Aerial Photography Masterclass",
    description: "Master the art of aerial photography with composition techniques, camera settings, and post-processing workflows.",
    level: "Intermediate",
    duration: "5 weeks",
    modules: 8,
    thumbnail: "https://images.unsplash.com/photo-1576037728058-fe4689fe765c",
    youtubePlaylistId: "PLZ8REt5zt2Plg5jpTAo6RvPg0H_JGvd2n"
  },
  {
    id: "mapping-surveying",
    title: "Drone Mapping & Surveying",
    description: "Learn photogrammetry and mapping techniques to create accurate 3D models and orthomosaic maps using drone imagery.",
    level: "Advanced",
    duration: "7 weeks",
    modules: 9,
    thumbnail: "https://images.unsplash.com/photo-1523427303326-1108cf995090",
    youtubePlaylistId: "PLZ8REt5zt2Plg5jpTAo6RvPg0H_JGvd2n"
  },
  {
    id: "regulations",
    title: "Drone Regulations & Compliance",
    description: "Understand the legal framework for drone operations, including airspace regulations, certification requirements, and flight restrictions.",
    level: "Beginner",
    duration: "3 weeks",
    modules: 6,
    thumbnail: "https://images.unsplash.com/photo-1495714096525-285e85481090",
    youtubePlaylistId: "PLZ8REt5zt2Plg5jpTAo6RvPg0H_JGvd2n"
  }
];

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  const filters = [
    { name: 'All', value: null },
    { name: 'Beginner', value: 'Beginner' },
    { name: 'Intermediate', value: 'Intermediate' },
    { name: 'Advanced', value: 'Advanced' }
  ];
  
  const filteredCourses = coursesData.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter ? course.level === activeFilter : true;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-neutral-100">
      <Navigation />
      
      {/* Header */}
      <section className="pt-20 md:pt-24 bg-flytbase-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Explore Our Courses</h1>
              <p className="mt-2 text-blue-100 max-w-2xl">
                From beginner to advanced, find the perfect drone course to elevate your skills and knowledge
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <div className="flex items-center bg-white/10 rounded-lg p-1 backdrop-blur-sm">
                <div className="flex space-x-1 p-1">
                  {filters.map((filter) => (
                    <Button
                      key={filter.name}
                      variant={activeFilter === filter.value ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setActiveFilter(filter.value)}
                      className={activeFilter === filter.value ? "bg-white text-flytbase-primary" : "text-white hover:bg-white/20"}
                    >
                      {filter.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Search Bar */}
      <div className="bg-white border-b border-neutral-200 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search courses by title or description..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {/* Course Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredCourses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="mx-auto h-12 w-12 text-neutral-300" />
              <h3 className="mt-4 text-lg font-medium text-neutral-900">No courses found</h3>
              <p className="mt-1 text-neutral-500">Try adjusting your search or filter to find what you're looking for.</p>
              <Button 
                className="mt-6"
                onClick={() => {
                  setSearchTerm('');
                  setActiveFilter(null);
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Courses;
