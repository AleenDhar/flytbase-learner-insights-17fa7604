
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, Book, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CourseContentDetailsProps {
  moduleId: string;
  moduleCompleted: boolean;
  onQuizComplete: () => void;
  onPreviousModule: () => void;
  onNextModule: () => void;
  isLastModule: boolean;
}

const CourseContentDetails: React.FC<CourseContentDetailsProps> = ({
  moduleId,
  moduleCompleted,
  onQuizComplete,
  onPreviousModule,
  onNextModule,
  isLastModule
}) => {
  const { toast } = useToast();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  
  // Sample quiz questions for this module
  const quizQuestions = [
    {
      id: 'q1',
      question: 'What is the primary purpose of this module?',
      options: [
        { id: 'a', text: 'To introduce advanced flight maneuvers' },
        { id: 'b', text: 'To explain basic drone controls' },
        { id: 'c', text: 'To demonstrate camera settings' },
      ],
      correctAnswer: 'b'
    },
    {
      id: 'q2',
      question: 'Which of the following is most important for safe drone operation?',
      options: [
        { id: 'a', text: 'Flying as high as possible' },
        { id: 'b', text: 'Maintaining visual line of sight' },
        { id: 'c', text: 'Recording in 4K resolution' },
      ],
      correctAnswer: 'b'
    }
  ];
  
  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };
  
  const handleQuizSubmit = () => {
    // Check if all questions have been answered
    if (Object.keys(selectedAnswers).length < quizQuestions.length) {
      toast({
        title: "Please answer all questions",
        description: "You need to answer all questions before submitting.",
        variant: "destructive"
      });
      return;
    }
    
    // Calculate score
    let correctCount = 0;
    quizQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });
    
    const scorePercentage = Math.round((correctCount / quizQuestions.length) * 100);
    
    setQuizSubmitted(true);
    
    if (scorePercentage >= 70) {
      toast({
        title: "Quiz Completed",
        description: `You scored ${scorePercentage}%. You can now move to the next module.`,
      });
      onQuizComplete();
    } else {
      toast({
        title: "Quiz Failed",
        description: `You scored ${scorePercentage}%. You need at least 70% to pass.`,
        variant: "destructive"
      });
    }
  };
  
  const getAnswerStatus = (questionId: string, answerId: string) => {
    if (!quizSubmitted) return null;
    
    const question = quizQuestions.find(q => q.id === questionId);
    if (!question) return null;
    
    const isSelected = selectedAnswers[questionId] === answerId;
    const isCorrect = question.correctAnswer === answerId;
    
    if (isSelected && isCorrect) return "correct";
    if (isSelected && !isCorrect) return "incorrect";
    if (!isSelected && isCorrect) return "correct-unselected";
    
    return null;
  };
  
  return (
    <Card className="bg-[#131A27] border-white/5 text-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Module Content</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="quiz">
          <TabsList className="bg-[#1A2133] border-white/5 mb-4">
            <TabsTrigger value="content" className="text-white data-[state=active]:bg-flytbase-secondary">
              <FileText className="mr-2 h-4 w-4" /> Materials
            </TabsTrigger>
            <TabsTrigger value="quiz" className="text-white data-[state=active]:bg-flytbase-secondary">
              <Book className="mr-2 h-4 w-4" /> Quiz
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="text-neutral-300">
            <div className="space-y-4">
              <p>
                This module covers the fundamentals of drone flight controls. You'll learn about throttle, yaw, pitch, and roll, and how they affect your drone's movement.
              </p>
              <div className="p-4 bg-[#1A2133] rounded-lg">
                <h4 className="font-medium text-white mb-2">Key Takeaways:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Understanding the drone controller layout</li>
                  <li>Proper takeoff and landing procedures</li>
                  <li>Basic flight maneuvers and patterns</li>
                  <li>Emergency procedures and failsafes</li>
                </ul>
              </div>
              <p>
                For additional resources and practice exercises, download the module PDF and reference materials below.
              </p>
              <div className="flex flex-wrap gap-3 mt-4">
                <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                  <FileText className="mr-2 h-4 w-4" /> Module PDF
                </Button>
                <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                  <FileText className="mr-2 h-4 w-4" /> Practice Exercises
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="quiz">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Module Quiz</h3>
                {moduleCompleted && (
                  <div className="flex items-center text-green-500">
                    <CheckCircle className="h-5 w-5 mr-1" />
                    <span>Completed</span>
                  </div>
                )}
              </div>
              
              {quizQuestions.map((q, idx) => (
                <div key={q.id} className="space-y-3">
                  <h4 className="font-medium">
                    {idx + 1}. {q.question}
                  </h4>
                  <RadioGroup
                    value={selectedAnswers[q.id] || ''}
                    onValueChange={(value) => handleAnswerSelect(q.id, value)}
                    className="space-y-2"
                    disabled={quizSubmitted && moduleCompleted}
                  >
                    {q.options.map(option => {
                      const status = getAnswerStatus(q.id, option.id);
                      return (
                        <div key={option.id} className="flex items-center space-x-2">
                          <RadioGroupItem 
                            value={option.id} 
                            id={`${q.id}-${option.id}`}
                            className={
                              status === "correct" ? "border-green-500 text-green-500" :
                              status === "incorrect" ? "border-red-500 text-red-500" :
                              "border-white/20 text-white"
                            }
                          />
                          <Label 
                            htmlFor={`${q.id}-${option.id}`}
                            className={
                              status === "correct" ? "text-green-500" :
                              status === "incorrect" ? "text-red-500" :
                              status === "correct-unselected" ? "text-green-500/70" :
                              "text-neutral-300"
                            }
                          >
                            {option.text}
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>
              ))}
              
              {!moduleCompleted && !quizSubmitted && (
                <Button 
                  onClick={handleQuizSubmit}
                  className="w-full mt-4 bg-flytbase-secondary hover:bg-flytbase-secondary/90"
                >
                  Submit Quiz
                </Button>
              )}
              
              {quizSubmitted && !moduleCompleted && (
                <Button 
                  onClick={handleQuizSubmit}
                  className="w-full mt-4 bg-amber-600 hover:bg-amber-700"
                >
                  Try Again
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t border-white/5 pt-4 flex justify-between">
        <Button 
          variant="outline"
          onClick={onPreviousModule}
          disabled={false}
          className="text-white border-white/20 hover:bg-white/10"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        
        <Button 
          variant={moduleCompleted ? "default" : "outline"}
          onClick={onNextModule}
          disabled={!moduleCompleted && !isLastModule}
          className={
            moduleCompleted 
              ? "bg-flytbase-secondary hover:bg-flytbase-secondary/90" 
              : "text-white border-white/20 hover:bg-white/10"
          }
        >
          {isLastModule ? "Finish Course" : "Next Module"} <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseContentDetails;
