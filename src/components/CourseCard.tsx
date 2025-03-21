
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface CourseProps {
  id: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  modules: number;
  thumbnail: string;
  youtubePlaylistId?: string;
}

const CourseCard: React.FC<CourseProps> = ({
  id,
  title,
  description,
  level,
  duration,
  modules,
  thumbnail,
  youtubePlaylistId
}) => {
  const getLevelColor = (level: string) => {
    switch(level) {
      case 'Beginner': return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'Intermediate': return 'bg-flytbase-accent-yellow/20 text-flytbase-accent-orange hover:bg-flytbase-accent-yellow/30';
      case 'Advanced': return 'bg-flytbase-secondary/10 text-flytbase-secondary hover:bg-flytbase-secondary/20';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={thumbnail} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {youtubePlaylistId && (
          <div className="absolute inset-0 bg-flytbase-primary/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Play className="h-12 w-12 text-white" />
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className={`${getLevelColor(level)}`}>{level}</Badge>
        </div>
      </div>
      <CardContent className="p-5">
        <div className="flex justify-between items-center mb-2 text-sm text-neutral-500">
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1" />
            <span>{modules} Modules</span>
          </div>
          <span>{duration}</span>
        </div>
        <h3 className="text-xl font-semibold mb-2 line-clamp-2 text-flytbase-primary">{title}</h3>
        <p className="text-neutral-600 mb-4 line-clamp-3">{description}</p>
        <Link to={`/courses/${id}`}>
          <Button className="w-full group bg-flytbase-secondary hover:bg-flytbase-secondary/90">
            View Course
            <ArrowRight className="ml-2 h-4 w-4 transform transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
