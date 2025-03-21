
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  Clock, 
  FileText, 
  ArrowRight,
  Check,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { AssessmentProps, assessmentsData } from './Assessments';

// Define the structure of a question
interface Question {
  id: number;
  text: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
}

// Mock questions for each assessment
const assessmentQuestions: Record<string, Question[]> = {
  "reg-rules": [
    {
      id: 1,
      text: "What is the maximum altitude allowed for recreational drone operations in the United States?",
      options: [
        { id: "a", text: "200 feet" },
        { id: "b", text: "400 feet" },
        { id: "c", text: "500 feet" },
        { id: "d", text: "1000 feet" }
      ],
      correctAnswer: "b"
    },
    {
      id: 2,
      text: "Which of the following is required for commercial drone operations under Part 107?",
      options: [
        { id: "a", text: "FAA Remote Pilot Certificate" },
        { id: "b", text: "Sport Pilot License" },
        { id: "c", text: "Private Pilot License" },
        { id: "d", text: "No certification required" }
      ],
      correctAnswer: "a"
    },
    {
      id: 3,
      text: "How far must drones stay from airports without prior authorization?",
      options: [
        { id: "a", text: "1 mile" },
        { id: "b", text: "3 miles" },
        { id: "c", text: "5 miles" },
        { id: "d", text: "10 miles" }
      ],
      correctAnswer: "c"
    }
  ],
  "flight-ops": [
    {
      id: 1,
      text: "Which control on a typical drone transmitter adjusts altitude?",
      options: [
        { id: "a", text: "Left stick (vertical)" },
        { id: "b", text: "Right stick (vertical)" },
        { id: "c", text: "Left stick (horizontal)" },
        { id: "d", text: "Right stick (horizontal)" }
      ],
      correctAnswer: "a"
    },
    {
      id: 2,
      text: "What is the correct order for a standard drone pre-flight checklist?",
      options: [
        { id: "a", text: "Battery, Propellers, Environment, Controller" },
        { id: "b", text: "Controller, Battery, Propellers, Environment" },
        { id: "c", text: "Environment, Battery, Controller, Propellers" },
        { id: "d", text: "Propellers, Battery, Environment, Controller" }
      ],
      correctAnswer: "a"
    },
    {
      id: 3,
      text: "Which flying pattern is best for capturing aerial photographs with consistent overlap?",
      options: [
        { id: "a", text: "Circular pattern" },
        { id: "b", text: "Grid pattern" },
        { id: "c", text: "Random pattern" },
        { id: "d", text: "Figure-8 pattern" }
      ],
      correctAnswer: "b"
    }
  ],
  // Default questions for any assessment that doesn't have specific questions
  "default": [
    {
      id: 1,
      text: "What is the primary purpose of drone geofencing?",
      options: [
        { id: "a", text: "To prevent flyaways" },
        { id: "b", text: "To restrict flight in sensitive areas" },
        { id: "c", text: "To improve GPS accuracy" },
        { id: "d", text: "To extend flight time" }
      ],
      correctAnswer: "b"
    },
    {
      id: 2,
      text: "Which weather condition is most dangerous for drone operations?",
      options: [
        { id: "a", text: "Light rain" },
        { id: "b", text: "High humidity" },
        { id: "c", text: "Strong winds" },
        { id: "d", text: "Slight fog" }
      ],
      correctAnswer: "c"
    },
    {
      id: 3,
      text: "What is the recommended minimum battery percentage to trigger a return-to-home procedure?",
      options: [
        { id: "a", text: "30%" },
        { id: "b", text: "25%" },
        { id: "c", text: "20%" },
        { id: "d", text: "15%" }
      ],
      correctAnswer: "a"
    }
  ]
};

const AssessmentDetail = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [assessment, setAssessment] = useState<AssessmentProps | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  
  // Timer formatter
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Load assessment data
  useEffect(() => {
    if (!assessmentId) return;
    
    const foundAssessment = assessmentsData.find(a => a.id === assessmentId);
    if (foundAssessment) {
      setAssessment(foundAssessment);
      
      // Set questions based on assessment ID or use default questions
      const assessmentQuestions = 
        assessmentQuestions[assessmentId] || 
        assessmentQuestions["default"];
      
      // For demo purposes, we're limiting to 3 questions
      setQuestions(assessmentQuestions.slice(0, 3));
    }
  }, [assessmentId]);
  
  // Setup timer when assessment starts
  useEffect(() => {
    if (!assessmentStarted || !assessment) return;
    
    // Parse time limit (e.g., "30 minutes" -> 1800 seconds)
    const timeMatch = assessment.timeLimit.match(/(\d+)/);
    let seconds = timeMatch ? parseInt(timeMatch[1]) * 60 : 1800;
    
    // For demo purposes, set a shorter time
    seconds = 180; // 3 minutes
    
    setTimeLeft(seconds);
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!isSubmitted) {
            submitAssessment();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [assessmentStarted, assessment]);
  
  const startAssessment = () => {
    setAssessmentStarted(true);
    toast({
      title: "Assessment Started",
      description: "Good luck! Answer all questions before the time runs out.",
    });
  };
  
  const handleAnswerSelect = (questionId: number, answerId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };
  
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const calculateScore = () => {
    let correctAnswers = 0;
    
    questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    return {
      score: correctAnswers,
      total: questions.length,
      percentage: Math.round((correctAnswers / questions.length) * 100)
    };
  };
  
  const submitAssessment = () => {
    const result = calculateScore();
    setScore(result.percentage);
    setIsSubmitted(true);
    
    toast({
      title: "Assessment Completed",
      description: `You scored ${result.percentage}% (${result.score}/${result.total} correct)`,
      variant: result.percentage >= 70 ? "default" : "destructive",
    });
  };
  
  if (!assessment) {
    return (
      <div className="min-h-screen bg-flytbase-primary">
        <Navigation />
        <div className="pt-24 pb-12 text-center text-white">
          <h1 className="text-2xl font-bold">Assessment not found</h1>
          <Button 
            className="mt-4"
            onClick={() => navigate('/assessments')}
          >
            Back to Assessments
          </Button>
        </div>
      </div>
    );
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-flytbase-primary">
      <Navigation />
      
      {!assessmentStarted ? (
        // Assessment Introduction Screen
        <section className="pt-20 md:pt-24 bg-flytbase-primary text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Link to="/assessments" className="inline-flex items-center text-neutral-300 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Assessments
            </Link>
            
            <div className="bg-[#1A1F2C] border border-white/5 rounded-lg overflow-hidden shadow-xl">
              <div className="relative h-48 bg-gradient-to-r from-[#0E61DD] to-[#0B121E]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileText className="h-24 w-24 text-white/20" />
                </div>
                <div className="absolute bottom-4 left-6">
                  <Badge className="mb-2">
                    {assessment.difficulty}
                  </Badge>
                  <h1 className="text-2xl md:text-3xl font-bold">{assessment.title}</h1>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <div className="mb-4 md:mb-0">
                    <div className="flex items-center text-neutral-300 space-x-4">
                      <div className="flex items-center">
                        <HelpCircle className="mr-2 h-5 w-5" />
                        <span>{assessment.questions} Questions</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-5 w-5" />
                        <span>{assessment.timeLimit}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    size="lg" 
                    className="bg-flytbase-secondary hover:bg-flytbase-secondary/90"
                    onClick={startAssessment}
                  >
                    Start Assessment
                  </Button>
                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">About this Assessment</h2>
                    <p className="text-neutral-300">{assessment.description}</p>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Instructions</h2>
                    <ul className="list-disc pl-5 text-neutral-300 space-y-2">
                      <li>Read each question carefully before selecting your answer.</li>
                      <li>You can navigate between questions using the Previous and Next buttons.</li>
                      <li>The timer will start once you begin the assessment.</li>
                      <li>You must score at least 70% to pass this assessment.</li>
                      <li>You can submit your assessment at any time, but unanswered questions will be marked as incorrect.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : isSubmitted ? (
        // Assessment Results Screen
        <section className="pt-20 md:pt-24 bg-flytbase-primary text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-[#1A1F2C] border border-white/5 rounded-lg overflow-hidden shadow-xl p-6">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-[#0E61DD] to-[#0B121E] mb-4">
                  {score >= 70 ? (
                    <Check className="h-10 w-10 text-green-500" />
                  ) : (
                    <AlertCircle className="h-10 w-10 text-orange-500" />
                  )}
                </div>
                
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  {score >= 70 ? "Assessment Passed!" : "Assessment Not Passed"}
                </h1>
                <p className="text-neutral-300">
                  {score >= 70 
                    ? "Congratulations! You've successfully completed this assessment." 
                    : "Don't worry, you can retake this assessment after reviewing the material."}
                </p>
              </div>
              
              <div className="bg-[#222631] rounded-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold">Your Score</h2>
                  <span className="text-2xl font-bold">{score}%</span>
                </div>
                <Progress 
                  value={score} 
                  className="h-3 bg-gray-700"
                />
                <div className="mt-2 text-sm text-neutral-400 text-right">
                  Passing score: 70%
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Question Results</h2>
                  <div className="space-y-4">
                    {questions.map((question, index) => {
                      const isCorrect = selectedAnswers[question.id] === question.correctAnswer;
                      const selectedOption = question.options.find(
                        opt => opt.id === selectedAnswers[question.id]
                      );
                      const correctOption = question.options.find(
                        opt => opt.id === question.correctAnswer
                      );
                      
                      return (
                        <div 
                          key={question.id}
                          className={`p-4 rounded-lg border ${
                            isCorrect ? 'border-green-800 bg-green-900/20' : 'border-red-800 bg-red-900/20'
                          }`}
                        >
                          <div className="flex items-start">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#222631] flex items-center justify-center text-sm mr-3">
                              {index + 1}
                            </span>
                            <div>
                              <p className="font-medium mb-2">{question.text}</p>
                              <p className="text-sm">
                                <span className="text-neutral-400">Your answer: </span>
                                <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>
                                  {selectedOption ? selectedOption.text : 'Not answered'}
                                </span>
                              </p>
                              {!isCorrect && (
                                <p className="text-sm mt-1">
                                  <span className="text-neutral-400">Correct answer: </span>
                                  <span className="text-green-400">{correctOption?.text}</span>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-white/10 text-white hover:bg-white/5"
                    onClick={() => navigate('/assessments')}
                  >
                    Back to Assessments
                  </Button>
                  
                  <Button 
                    className="flex-1 bg-flytbase-secondary hover:bg-flytbase-secondary/90"
                    onClick={() => {
                      setIsSubmitted(false);
                      setAssessmentStarted(false);
                      setSelectedAnswers({});
                      setCurrentQuestionIndex(0);
                    }}
                  >
                    Retake Assessment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        // Assessment Taking Screen
        <section className="pt-20 md:pt-24 bg-flytbase-primary text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-[#1A1F2C] border border-white/5 rounded-lg overflow-hidden shadow-xl">
              {/* Header with progress and timer */}
              <div className="p-4 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center">
                  <span className="font-semibold mr-2">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                  <Progress 
                    value={progress} 
                    className="w-32 h-2"
                  />
                </div>
                
                <div className="flex items-center bg-[#222631] px-3 py-1 rounded-full">
                  <Clock className="h-4 w-4 mr-2 text-flytbase-accent-orange" />
                  <span className={`font-mono ${timeLeft < 30 ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
              
              {/* Question */}
              {currentQuestion && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-6">{currentQuestion.text}</h2>
                  
                  <RadioGroup
                    value={selectedAnswers[currentQuestion.id] || ""}
                    onValueChange={(value) => handleAnswerSelect(currentQuestion.id, value)}
                    className="space-y-4"
                  >
                    {currentQuestion.options.map((option) => (
                      <div 
                        key={option.id}
                        className="flex items-center space-x-3 p-3 rounded-lg border border-white/10 hover:border-white/30 cursor-pointer"
                        onClick={() => handleAnswerSelect(currentQuestion.id, option.id)}
                      >
                        <RadioGroupItem value={option.id} id={`option-${option.id}`} />
                        <Label htmlFor={`option-${option.id}`} className="flex-grow cursor-pointer">
                          {option.text}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  
                  {/* Navigation buttons */}
                  <div className="flex justify-between mt-8">
                    <Button
                      variant="outline"
                      onClick={goToPreviousQuestion}
                      disabled={currentQuestionIndex === 0}
                      className="border-white/10 text-white hover:bg-white/5"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>
                    
                    {currentQuestionIndex < questions.length - 1 ? (
                      <Button
                        onClick={goToNextQuestion}
                        className="bg-flytbase-secondary hover:bg-flytbase-secondary/90"
                      >
                        Next
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        onClick={submitAssessment}
                        className="bg-flytbase-accent-orange hover:bg-flytbase-accent-orange/90"
                      >
                        Submit
                        <Check className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default AssessmentDetail;
