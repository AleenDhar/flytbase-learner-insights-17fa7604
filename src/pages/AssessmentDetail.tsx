
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Clock, 
  ChevronLeft, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import type { AssessmentProps } from '@/components/AssessmentCard';

// Mock data for the assessment
const assessmentData: AssessmentProps = {
  id: "1",
  title: "Drone Flight Operations & Safety",
  description: "Test your knowledge of drone flight operations, safety procedures, and regulatory compliance.",
  questions: 10,
  timeLimit: "30 minutes",
  difficulty: "Intermediate",
  thumbnail: "https://images.unsplash.com/photo-1508614589041-895b88991e3e"
};

// Mock questions for the assessment
const assessmentQuestions = [
  {
    id: 1,
    question: "What is the maximum altitude allowed for recreational drone flights in most countries?",
    options: [
      "100 feet",
      "400 feet",
      "500 feet",
      "1000 feet"
    ],
    correctAnswer: "400 feet"
  },
  {
    id: 2,
    question: "Which of the following is NOT typically a no-fly zone for drones?",
    options: [
      "Airports",
      "Military bases",
      "Public parks",
      "Critical infrastructure"
    ],
    correctAnswer: "Public parks"
  },
  {
    id: 3,
    question: "What should you check before every drone flight?",
    options: [
      "Battery levels only",
      "Weather conditions only",
      "Propeller condition only",
      "All of the above"
    ],
    correctAnswer: "All of the above"
  },
  {
    id: 4,
    question: "What is the primary purpose of geofencing in drone technology?",
    options: [
      "To improve flight stability",
      "To restrict flight in certain areas",
      "To enhance camera quality",
      "To extend battery life"
    ],
    correctAnswer: "To restrict flight in certain areas"
  },
  {
    id: 5,
    question: "Which programming language is commonly used for drone automation?",
    options: [
      "Java",
      "C++",
      "Python",
      "Ruby"
    ],
    correctAnswer: "Python"
  },
  // ... more questions
];

const AssessmentDetail = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentState, setCurrentState] = useState<'preview' | 'assessment' | 'results'>('preview');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes in seconds
  const [results, setResults] = useState<{
    score: number,
    totalQuestions: number,
    correctAnswers: number,
    incorrectAnswers: number,
    unanswered: number
  } | null>(null);
  
  // Load assessment data based on the assessmentId
  useEffect(() => {
    // In a real app, this would fetch data from an API
    console.log(`Loading assessment with ID: ${assessmentId}`);
    // For now, we'll use mock data
  }, [assessmentId]);
  
  // Timer logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (currentState === 'assessment' && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            submitAssessment();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [currentState, timeRemaining]);
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  const startAssessment = () => {
    setCurrentState('assessment');
    toast({
      title: "Assessment Started",
      description: "Good luck! You have 30 minutes to complete this assessment.",
    });
  };
  
  const selectAnswer = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };
  
  const nextQuestion = () => {
    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(curr => curr + 1);
    }
  };
  
  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(curr => curr - 1);
    }
  };
  
  const submitAssessment = () => {
    // Calculate results
    let correctCount = 0;
    
    assessmentQuestions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });
    
    const result = {
      score: Math.round((correctCount / assessmentQuestions.length) * 100),
      totalQuestions: assessmentQuestions.length,
      correctAnswers: correctCount,
      incorrectAnswers: assessmentQuestions.length - correctCount - (assessmentQuestions.length - Object.keys(answers).length),
      unanswered: assessmentQuestions.length - Object.keys(answers).length
    };
    
    setResults(result);
    setCurrentState('results');
    
    toast({
      title: "Assessment Completed",
      description: `You scored ${result.score}% on this assessment.`,
    });
  };
  
  // Generate UI based on current state
  const renderContent = () => {
    switch (currentState) {
      case 'preview':
        return (
          <Card className="bg-[#1A1F2C] border-white/5 text-white shadow-xl">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{assessmentData.title}</CardTitle>
                  <CardDescription className="text-neutral-400 mt-2">
                    {assessmentData.description}
                  </CardDescription>
                </div>
                <Badge className="bg-blue-900/40 text-blue-200">
                  {assessmentData.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2 text-neutral-300">
                    <Clock className="h-5 w-5" />
                    <span>Time Limit: {assessmentData.timeLimit}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-neutral-300">
                    <AlertCircle className="h-5 w-5" />
                    <span>Questions: {assessmentData.questions}</span>
                  </div>
                </div>
                
                <div className="border-t border-white/5 pt-6">
                  <h3 className="text-lg font-semibold mb-4">Assessment Instructions:</h3>
                  <ul className="list-disc pl-5 space-y-2 text-neutral-300">
                    <li>You will have {assessmentData.timeLimit} to complete all questions.</li>
                    <li>You can navigate between questions using the Previous and Next buttons.</li>
                    <li>Questions can be answered in any order.</li>
                    <li>Your assessment will be automatically submitted when the time expires.</li>
                    <li>You can review your answers before submitting.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-white/5 pt-6 flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => navigate('/assessments')}
                className="border-white/10 hover:bg-white/5 text-white"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Assessments
              </Button>
              <Button onClick={startAssessment} className="bg-flytbase-secondary hover:bg-flytbase-secondary/90">
                Start Assessment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        );
        
      case 'assessment':
        const question = assessmentQuestions[currentQuestion];
        const progress = ((currentQuestion + 1) / assessmentQuestions.length) * 100;
        
        return (
          <Card className="bg-[#1A1F2C] border-white/5 text-white shadow-xl">
            <CardHeader>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2 text-neutral-300">
                  <Badge className="bg-blue-900/40 text-blue-200">
                    Question {currentQuestion + 1} of {assessmentQuestions.length}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 text-neutral-300">
                  <Clock className="h-5 w-5" />
                  <span className={timeRemaining < 300 ? "text-red-400" : ""}>
                    Time Remaining: {formatTime(timeRemaining)}
                  </span>
                </div>
              </div>
              <Progress value={progress} className="h-2 bg-neutral-700" />
              <CardTitle className="text-xl mt-4">{question.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={answers[question.id] || ""}
                onValueChange={(value) => selectAnswer(question.id, value)}
                className="space-y-4"
              >
                {question.options.map((option, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <RadioGroupItem 
                      value={option} 
                      id={`option-${idx}`} 
                      className="border-white/20 text-white"
                    />
                    <Label 
                      htmlFor={`option-${idx}`} 
                      className="text-neutral-300 cursor-pointer hover:text-white"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
            <CardFooter className="border-t border-white/5 pt-6 flex justify-between">
              <div>
                <Button 
                  variant="outline" 
                  onClick={prevQuestion}
                  disabled={currentQuestion === 0}
                  className="border-white/10 hover:bg-white/5 text-white mr-2"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button 
                  variant="outline"
                  onClick={nextQuestion}
                  disabled={currentQuestion === assessmentQuestions.length - 1}
                  className="border-white/10 hover:bg-white/5 text-white"
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <Button 
                onClick={submitAssessment}
                className="bg-flytbase-secondary hover:bg-flytbase-secondary/90"
              >
                Submit Assessment
              </Button>
            </CardFooter>
          </Card>
        );
        
      case 'results':
        return (
          <Card className="bg-[#1A1F2C] border-white/5 text-white shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Assessment Results</CardTitle>
              <CardDescription className="text-neutral-400">
                {assessmentData.title}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="text-5xl font-bold mb-2 text-flytbase-secondary">
                    {results?.score}%
                  </div>
                  <p className="text-neutral-400">
                    {results?.score && results.score >= 70 ? 'Passed' : 'Failed'}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#212636] p-4 rounded-lg text-center">
                    <div className="flex justify-center text-green-400 mb-2">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <div className="text-2xl font-semibold">{results?.correctAnswers}</div>
                    <p className="text-neutral-400 text-sm">Correct</p>
                  </div>
                  
                  <div className="bg-[#212636] p-4 rounded-lg text-center">
                    <div className="flex justify-center text-red-400 mb-2">
                      <XCircle className="h-6 w-6" />
                    </div>
                    <div className="text-2xl font-semibold">{results?.incorrectAnswers}</div>
                    <p className="text-neutral-400 text-sm">Incorrect</p>
                  </div>
                  
                  <div className="bg-[#212636] p-4 rounded-lg text-center">
                    <div className="flex justify-center text-yellow-400 mb-2">
                      <AlertCircle className="h-6 w-6" />
                    </div>
                    <div className="text-2xl font-semibold">{results?.unanswered}</div>
                    <p className="text-neutral-400 text-sm">Unanswered</p>
                  </div>
                </div>
                
                <Tabs defaultValue="summary" className="mt-6">
                  <TabsList className="bg-[#212636] border-white/5">
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="review">Review Answers</TabsTrigger>
                  </TabsList>
                  <TabsContent value="summary" className="pt-4">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Performance Summary</h3>
                      <p className="text-neutral-300">
                        You answered {results?.correctAnswers} out of {results?.totalQuestions} questions correctly.
                        {results?.score && results.score >= 70 
                          ? ' Congratulations on passing this assessment!' 
                          : ' We recommend reviewing the course materials and trying again.'}
                      </p>
                      
                      <h3 className="font-semibold mt-4">Recommendations</h3>
                      <ul className="list-disc pl-5 space-y-1 text-neutral-300">
                        <li>Review the drone safety regulations module</li>
                        <li>Practice with the flight simulator exercises</li>
                        <li>Join the community forum to discuss challenging concepts</li>
                      </ul>
                    </div>
                  </TabsContent>
                  <TabsContent value="review" className="pt-4">
                    <div className="space-y-6">
                      {assessmentQuestions.map((q, idx) => {
                        const userAnswer = answers[q.id];
                        const isCorrect = userAnswer === q.correctAnswer;
                        const isAnswered = userAnswer !== undefined;
                        
                        return (
                          <div key={idx} className="border-b border-white/5 pb-4 last:border-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium mb-2">
                                  Question {idx + 1}: {q.question}
                                </h4>
                                <div className="ml-4 text-sm">
                                  <p className="text-neutral-400 mb-1">Your answer: {' '}
                                    {isAnswered ? (
                                      <span className={isCorrect ? "text-green-400" : "text-red-400"}>
                                        {userAnswer}
                                        {isCorrect ? ' ✓' : ' ✗'}
                                      </span>
                                    ) : (
                                      <span className="text-yellow-400">No answer provided</span>
                                    )}
                                  </p>
                                  {!isCorrect && (
                                    <p className="text-green-400">
                                      Correct answer: {q.correctAnswer}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
            <CardFooter className="border-t border-white/5 pt-6 flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => navigate('/assessments')}
                className="border-white/10 hover:bg-white/5 text-white"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Assessments
              </Button>
              <Button 
                onClick={() => setCurrentState('preview')}
                className="bg-flytbase-secondary hover:bg-flytbase-secondary/90"
              >
                Retry Assessment
              </Button>
            </CardFooter>
          </Card>
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-flytbase-primary text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default AssessmentDetail;
