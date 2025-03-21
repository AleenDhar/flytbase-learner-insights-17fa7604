
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ListTree, Map, ChevronRight, Layers, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock data for learning paths
const learningPaths = [
  {
    id: 1,
    title: "Drone Professional Certification",
    description: "Complete pathway to become a certified drone professional",
    progress: 65,
    courses: 8,
    completed: 5,
    enrolled: true
  },
  {
    id: 2,
    title: "Drone Photography Specialist",
    description: "Master aerial photography and videography techniques",
    progress: 30,
    courses: 6,
    completed: 2,
    enrolled: true
  },
  {
    id: 3,
    title: "Agricultural Drone Operations",
    description: "Learn to apply drone technology in precision agriculture",
    progress: 0,
    courses: 7,
    completed: 0,
    enrolled: false
  },
  {
    id: 4,
    title: "Drone Engineering & Development",
    description: "Understand drone mechanics and custom drone building",
    progress: 0,
    courses: 10,
    completed: 0,
    enrolled: false
  }
];

const LearningPaths = () => {
  return (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <ListTree className="h-5 w-5 text-flytbase-secondary" />
            Learning Paths
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {learningPaths.map((path) => (
            <div key={path.id} className="group">
              <Card className={`border-border/20 hover:border-flytbase-secondary/40 transition-all ${
                path.enrolled ? 'bg-[#141a28]' : 'bg-muted/10'
              }`}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`rounded-lg p-3 ${
                      path.enrolled 
                        ? 'bg-flytbase-secondary/20 text-flytbase-secondary' 
                        : 'bg-neutral-800/50 text-neutral-400'
                    }`}>
                      {path.enrolled ? <Map className="h-8 w-8" /> : <Layers className="h-8 w-8" />}
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg">{path.title}</h3>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 rounded-full"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">{path.description}</p>
                      </div>

                      {path.enrolled && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{path.progress}%</span>
                          </div>
                          <Progress value={path.progress} className="h-2 bg-neutral-800">
                            <div 
                              className="h-full bg-flytbase-secondary transition-all"
                              style={{ transform: `translateX(-${100 - path.progress}%)` }}
                            />
                          </Progress>
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Layers className="h-4 w-4" />
                              <span>{path.courses} Courses</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <GraduationCap className="h-4 w-4" />
                              <span>{path.completed} Completed</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {!path.enrolled && (
                        <Button 
                          variant="outline" 
                          className="mt-3 border-flytbase-secondary/50 text-flytbase-secondary hover:bg-flytbase-secondary/10"
                        >
                          Enroll Now
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningPaths;
