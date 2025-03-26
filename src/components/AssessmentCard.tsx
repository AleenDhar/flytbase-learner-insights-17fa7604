
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, HelpCircle, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface AssessmentProps {
  id: string;
  title: string;
  description: string;
  questions: number;
  timeLimit: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnail: string;
  courseId: string; // Added the missing courseId property
}

const AssessmentCard: React.FC<AssessmentProps> = ({
  id,
  title,
  description,
  questions,
  timeLimit,
  difficulty,
  thumbnail,
  courseId // Added parameter
}) => {
  // Function to determine badge color based on difficulty
  const getBadgeColor = (difficulty: string) => {
    switch(difficulty) {
      case 'Beginner':
        return 'bg-green-900/40 text-green-200 hover:bg-green-900/60';
      case 'Intermediate':
        return 'bg-blue-900/40 text-blue-200 hover:bg-blue-900/60';
      case 'Advanced':
        return 'bg-orange-900/40 text-orange-200 hover:bg-orange-900/60';
      default:
        return 'bg-gray-900/40 text-gray-200 hover:bg-gray-900/60';
    }
  };

  return (
    <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg bg-[#1A1F2C] border-white/5 flex flex-col">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={thumbnail} 
          alt={title}
          className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
        />
        <Badge className={`absolute top-3 right-3 ${getBadgeColor(difficulty)}`}>
          {difficulty}
        </Badge>
      </div>
      
      <CardContent className="pt-6 flex-grow">
        <h3 className="text-xl font-semibold mb-2 text-white line-clamp-2">{title}</h3>
        <p className="text-neutral-400 mb-4 line-clamp-3">{description}</p>
        
        <div className="flex items-center space-x-4 text-sm text-neutral-300">
          <div className="flex items-center">
            <HelpCircle className="h-4 w-4 mr-1" />
            <span>{questions} Questions</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{timeLimit}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-white/5 pt-4">
        <Link to={`/assessments/${id}`} className="w-full">
          <Button className="w-full bg-flytbase-secondary hover:bg-flytbase-secondary/90 text-white">
            <FileText className="mr-2 h-4 w-4" />
            Start Assessment
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default AssessmentCard;
