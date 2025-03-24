
import React, { useState } from 'react';
import { useCourseContent } from '@/hooks/use-course-content';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, BookOpen, HelpCircle, Check, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import useCourseProgress from '@/hooks/use-course-progress';

interface CourseContentSectionProps {
  videoId: string;
  courseId: string;
  onQuizComplete: () => void;
}

const CourseContentSection: React.FC<CourseContentSectionProps> = ({ videoId, courseId, onQuizComplete }) => {
  const { summary, questions, loading, error } = useCourseContent(videoId);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: number]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const { updateProgress, loading: updatingProgress } = useCourseProgress(courseId);

  // Calculate quiz progress percentage
  const progressPercentage = questions ? (currentQuestionIndex / questions.length) * 100 : 0;
  
  // Calculate score based on selected options and correct answers
  const calculateScore = () => {
    if (!questions) return 0;
    
    let correctAnswers = 0;
    questions.forEach((question, index) => {
      if (selectedOptions[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    return Math.round((correctAnswers / questions.length) * 100);
  };
  
  const handleOptionSelect = (questionIndex: number, optionId: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [questionIndex]: optionId
    }));
  };
  
  const handleNextQuestion = () => {
    if (!questions) return;
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResults(true);
      const score = calculateScore();
      
      // Update course progress
      updateProgress({ 
        progress: Math.min(100, score), // Cap at 100%
        status: score >= 70 ? 'completed' : 'in_progress' 
      });
      
      setQuizCompleted(true);
      onQuizComplete();
      
      toast({
        title: score >= 70 ? "Quiz Completed!" : "Try Again",
        description: score >= 70 
          ? `Congratulations! You scored ${score}%` 
          : `You scored ${score}%. Review the content and try again to improve your score.`,
        variant: score >= 70 ? "default" : "destructive"
      });
    }
  };
  
  const isOptionSelected = (questionIndex: number) => {
    return selectedOptions[questionIndex] !== undefined;
  };
  
  const getOptionClassName = (questionIndex: number, optionId: string) => {
    if (!showResults) {
      return selectedOptions[questionIndex] === optionId 
        ? "bg-flytbase-secondary/20 border-flytbase-secondary" 
        : "hover:bg-white/5";
    }
    
    const question = questions?.[questionIndex];
    if (!question) return "";
    
    if (optionId === question.correctAnswer) {
      return "bg-green-500/20 border-green-500 text-green-200";
    } else if (selectedOptions[questionIndex] === optionId) {
      return "bg-red-500/20 border-red-500 text-red-200";
    }
    
    return "opacity-50";
  };

  if (loading) {
    return (
      <div className="space-y-4 p-6 bg-[#131A27] border border-white/5 rounded-lg">
        <div className="animate-pulse space-y-4">
          <Skeleton className="h-6 w-full bg-white/5" />
          <Skeleton className="h-6 w-5/6 bg-white/5" />
          <Skeleton className="h-6 w-4/6 bg-white/5" />
          <Skeleton className="h-6 w-3/6 bg-white/5" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="bg-red-900/20 border-red-500/50">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {summary && (
        <div className="p-6 bg-[#131A27] border border-white/5 rounded-lg">
          <div className="flex items-center mb-4">
            <BookOpen className="h-5 w-5 mr-2 text-flytbase-secondary" />
            <h3 className="text-lg font-semibold">Content Summary</h3>
          </div>
          <p className="text-white/80 whitespace-pre-line">{summary}</p>
        </div>
      )}
      
      {questions && questions.length > 0 && (
        <div className="p-6 bg-[#131A27] border border-white/5 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <HelpCircle className="h-5 w-5 mr-2 text-flytbase-secondary" />
              <h3 className="text-lg font-semibold">Knowledge Check</h3>
            </div>
            {!showResults && (
              <span className="text-sm text-white/60">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
            )}
          </div>
          
          {!showResults ? (
            <>
              <Progress value={progressPercentage} className="h-1 mb-6" />
              
              <div className="mb-6">
                <p className="text-white font-medium mb-4">
                  {questions[currentQuestionIndex].question}
                </p>
                
                <div className="space-y-3">
                  {questions[currentQuestionIndex].options.map((option) => (
                    <button
                      key={option.id}
                      className={`w-full text-left p-3 border border-white/10 rounded-md transition-colors ${
                        getOptionClassName(currentQuestionIndex, option.id)
                      }`}
                      onClick={() => handleOptionSelect(currentQuestionIndex, option.id)}
                    >
                      <span className="font-medium mr-2">{option.id}.</span> {option.text}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleNextQuestion}
                  disabled={!isOptionSelected(currentQuestionIndex)}
                  className="bg-flytbase-secondary hover:bg-flytbase-secondary/90"
                >
                  {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <div className={`text-4xl font-bold mb-2 ${calculateScore() >= 70 ? 'text-green-500' : 'text-red-500'}`}>
                {calculateScore()}%
              </div>
              <p className="text-lg mb-6">
                {calculateScore() >= 70 
                  ? "Congratulations! You've completed this module." 
                  : "Keep learning! Review the content and try again."}
              </p>
              <div className="mb-6">
                {calculateScore() >= 70 ? (
                  <div className="inline-flex items-center bg-green-900/20 text-green-200 px-4 py-2 rounded-full">
                    <Check className="h-5 w-5 mr-2" />
                    Module Completed
                  </div>
                ) : (
                  <div className="inline-flex items-center bg-red-900/20 text-red-200 px-4 py-2 rounded-full">
                    <X className="h-5 w-5 mr-2" />
                    Module Incomplete
                  </div>
                )}
              </div>
              
              <Button
                onClick={() => {
                  setShowResults(false);
                  setCurrentQuestionIndex(0);
                  setSelectedOptions({});
                }}
                variant="outline"
                className="border-white/10 text-white hover:bg-white/5"
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseContentSection;
