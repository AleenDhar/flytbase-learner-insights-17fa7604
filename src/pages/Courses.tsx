
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navigation from '@/components/Navigation';
import CourseCard from '@/components/CourseCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  const filters = [
    { name: 'All', value: null },
    { name: 'Beginner', value: 'Beginner' },
    { name: 'Intermediate', value: 'Intermediate' },
    { name: 'Advanced', value: 'Advanced' }
  ];
  
  const { data: coursesData, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      return data.map(course => ({
        id: course.id,
        title: course.title,
        description: course.description,
        level: course.difficulty || 'Beginner', // Default to Beginner if not specified
        duration: `${course.video_count || 0} modules`,
        modules: course.video_count || 0,
        thumbnail: course.thumbnail || 'https://images.unsplash.com/photo-1531297484001-80022131f5a1',
        youtubePlaylistId: course.playlist_id
      }));
    }
  });
  
  const filteredCourses = coursesData?.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter ? course.level === activeFilter : true;
    return matchesSearch && matchesFilter;
  }) || [];

  return (
    <div className="min-h-screen bg-flytbase-primary">
      <Navigation />
      
      {/* Header */}
      <section className="pt-20 md:pt-24 bg-flytbase-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Explore Our Courses</h1>
              <p className="mt-2 text-neutral-300 max-w-2xl">
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
                      className={activeFilter === filter.value ? "bg-flytbase-secondary text-white" : "text-white hover:bg-white/20"}
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
      <div className="bg-[#131A27] border-b border-white/5 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search courses by title or description..."
              className="pl-10 w-full bg-[#1A2133] border-white/10 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {/* Course Grid */}
      <section className="py-12 bg-flytbase-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse bg-[#1A1F2C] rounded-lg h-96"></div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16 text-white">
              <p>Error loading courses. Please try again later.</p>
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="mx-auto h-12 w-12 text-neutral-300" />
              <h3 className="mt-4 text-lg font-medium text-white">No courses found</h3>
              <p className="mt-1 text-neutral-400">Try adjusting your search or filter to find what you're looking for.</p>
              <Button 
                className="mt-6 bg-flytbase-secondary hover:bg-flytbase-secondary/90"
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
