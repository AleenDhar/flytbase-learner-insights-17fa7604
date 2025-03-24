
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, Award, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface CourseProps {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  modules: number;
  thumbnail: string;
  youtubePlaylistId?: string; // Make this optional
}

const CourseCard = ({
  id,
  title,
  description,
  level,
  duration,
  modules,
  thumbnail,
  youtubePlaylistId
}: CourseProps) => {
  // Get badge color based on level
  const getBadgeVariant = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-blue-950/60 text-blue-200';
      case 'intermediate':
        return 'bg-yellow-900/60 text-yellow-200';
      case 'advanced':
        return 'bg-red-950/60 text-red-200';
      default:
        return 'bg-gray-800/60 text-gray-200';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-[#131A27] border-white/5 text-white h-full flex flex-col">
      <div className="aspect-video overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge className={`${getBadgeVariant(level)}`}>{level}</Badge>
          {youtubePlaylistId && (
            <Badge variant="outline" className="border-white/10 text-white/70 flex items-center">
              <Youtube className="mr-1 h-3 w-3" />
              Playlist
            </Badge>
          )}
        </div>
        <h3 className="text-xl font-semibold mt-2 text-white">{title}</h3>
      </CardHeader>
      
      <CardContent className="text-white/70">
        <p className="line-clamp-2">{description}</p>
        
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex items-center text-white/60 text-sm">
            <BookOpen className="mr-1.5 h-4 w-4" />
            <span>{modules} Modules</span>
          </div>
          <div className="flex items-center text-white/60 text-sm">
            <Clock className="mr-1.5 h-4 w-4" />
            <span>{duration}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="mt-auto pt-4">
        <Link to={`/courses/${id}`} className="w-full">
          <Button 
            variant="default" 
            className="w-full bg-flytbase-secondary hover:bg-flytbase-secondary/90"
          >
            View Course
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
