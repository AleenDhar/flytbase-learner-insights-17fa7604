
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, Clock, Award } from 'lucide-react';
import WatchlistButton from '@/components/WatchlistButton';
import { CourseProps } from '@/components/CourseCard';

interface CourseHeaderProps {
  course: CourseProps;
  courseId: string;
  moduleCount: number;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({ course, courseId, moduleCount }) => {
  return (
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
                <span>{moduleCount} Modules</span>
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
              <WatchlistButton courseId={courseId} variant="outline" />
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
  );
};

export default CourseHeader;
