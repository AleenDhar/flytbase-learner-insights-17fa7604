import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
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
  ArrowRight,
  Award
} from 'lucide-react';
import CertificateForm, { CertificateFormValues } from '@/components/CertificateForm';
import Certificate from '@/components/Certificate';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

const AssessmentDetail = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
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
  const [showCertificateForm, setShowCertificateForm] = useState(false);
  const [certificateData, setCertificateData] = useState<CertificateFormValues | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  
  // Fetch assessment data
  const { data: assessment, isLoading: isAssessmentLoading } = useQuery({
    queryKey: ['assessment', assessmentId],
    queryFn: async () => {
      if (!assessmentId) throw new Error('Assessment ID is required');
      
      const { data, error } = await supabase
        .from('assessments')
        .select('*')
        .eq('id', assessmentId)
        .single();
      
      if (error) throw error;
      
      // Calculate the number of questions for this assessment
      const { count, error: countError } = await supabase
        .from('questions')
        .select('*', { count: 'exact', head: true })
        .eq('assessment_id', data.id);
        
      if (countError) throw countError;
      
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        questions: count || 10,
        timeLimit: `${data.time_limit} minutes`,
        difficulty: data.difficulty || 'Intermediate',
        thumbnail: data.thumbnail || 'https://images.unsplash.com/photo-1508614589041-895b88991e3e',
        courseId: data.course_id
      };
    },
    enabled: !!assessmentId,
  });
  
  // Fetch questions for this assessment
  const { data: questionsData, isLoading: isQuestionsLoading } = useQuery({
    queryKey: ['assessment-questions', assessmentId],
    queryFn: async () => {
      if (!assessmentId) throw new Error('Assessment ID is required');
      
      const { data, error } = await supabase
        .from('questions')
        .select(`
          id, 
          question_text, 
          question_type, 
          difficulty,
          question_options (
            id, 
            option_text, 
            is_correct
          )
        `)
        .eq('assessment_id', assessmentId);
      
      if (error) throw error;
      
      return data.map(question => ({
        id: question.id,
        question: question.question_text,
        options: question.question_options.map(option => option.option_text),
        correctAnswer: question.question_options.find(option => option.is_correct)?.option_text || ''
      }));
    },
    enabled: !!assessmentId,
  });
  
  // Initialize timer based on assessment time limit
  useEffect(() => {
    if (assessment) {
      const minutes = parseInt(assessment.timeLimit.split(' ')[0]);
      setTimeRemaining(minutes * 60);
    }
  }, [assessment]);
  
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
      description: `Good luck! You have ${assessment?.timeLimit} to complete this assessment.`,
    });
  };
  
  const selectAnswer = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };
  
  const nextQuestion = () => {
    if (questionsData && currentQuestion < questionsData.length - 1) {
      setCurrentQuestion(curr => curr + 1);
    }
  };
  
  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(curr => curr - 1);
    }
  };
  
  const submitAssessment = () => {
    if (!questionsData) return;
    
    // Calculate results
    let correctCount = 0;
    
    questionsData.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correctCount++;
      }
    });
    
    const result = {
      score: Math.round((correctCount / questionsData.length) * 100),
      totalQuestions: questionsData.length,
      correctAnswers: correctCount,
      incorrectAnswers: questionsData.length - correctCount - (questionsData.length - Object.keys(answers).length),
      unanswered: questionsData.length - Object.keys(answers).length
    };
    
    setResults(result);
    setCurrentState('results');
    
    // Save assessment result to database if user is logged in
    if (user && assessmentId) {
      saveAssessmentResult(result.score);
    }
    
    toast({
      title: "Assessment Completed",
      description: `You scored ${result.score}% on this assessment.`,
    });
  };
  
  const saveAssessmentResult = async (score: number) => {
    if (!user || !assessmentId) return;
    
    try {
      const { error } = await supabase
        .from('assessment_attempts')
        .insert({
          user_id: user.id,
          assessment_id: assessmentId,
          score: score,
          finished_at: new Date().toISOString(),
          status: score >= 70 ? 'passed' : 'failed',
          attempt_number: 1
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error saving assessment result:', error);
    }
  };

  const handleCertificateSubmit = async (data: CertificateFormValues) => {
    setCertificateData(data);
    setShowCertificateForm(false);
    setShowCertificate(true);
    
    // Since there's no certificates table in the database yet, we'll just log the data
    console.log('Certificate data:', {
      user_id: user?.id,
      assessment_id: assessmentId,
      full_name: data.fullName,
      email: data.email,
      designation: data.designation,
      score: results?.score,
      issued_at: new Date().toISOString()
    });
  };
  
  // Generate UI based on current state
  const renderContent = () => {
    if (isAssessmentLoading || !assessment) {
      return (
        <Card className="bg-[#1A1F2C] border-white/5 text-white shadow-xl">
          <CardHeader>
            <div className="animate-pulse">
              <div className="h-8 bg-neutral-800 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-neutral-800 rounded w-1/2"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-neutral-800 rounded"></div>
              <div className="h-4 bg-neutral-800 rounded"></div>
              <div className="h-4 bg-neutral-800 rounded w-3/4"></div>
            </div>
          </CardContent>
        </Card>
      );
    }
    
    switch (currentState) {
      case 'preview':
        return (
          <Card className="bg-[#1A1F2C] border-white/5 text-white shadow-xl">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{assessment.title}</CardTitle>
                  <CardDescription className="text-neutral-400 mt-2">
                    {assessment.description}
                  </CardDescription>
                </div>
                <Badge className="bg-blue-900/40 text-blue-200">
                  {assessment.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2 text-neutral-300">
                    <Clock className="h-5 w-5" />
                    <span>Time Limit: {assessment.timeLimit}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-neutral-300">
                    <AlertCircle className="h-5 w-5" />
                    <span>Questions: {assessment.questions}</span>
                  </div>
                </div>
                
                <div className="border-t border-white/5 pt-6">
                  <h3 className="text-lg font-semibold mb-4">Assessment Instructions:</h3>
                  <ul className="list-disc pl-5 space-y-2 text-neutral-300">
                    <li>You will have {assessment.timeLimit} to complete all questions.</li>
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
        if (isQuestionsLoading || !questionsData || questionsData.length === 0) {
          return (
            <Card className="bg-[#1A1F2C] border-white/5 text-white shadow-xl">
              <CardContent className="py-8 text-center">
                <p>Loading questions...</p>
              </CardContent>
            </Card>
          );
        }
        
        const question = questionsData[currentQuestion];
        const progress = ((currentQuestion + 1) / questionsData.length) * 100;
        
        return (
          <Card className="bg-[#1A1F2C] border-white/5 text-white shadow-xl">
            <CardHeader>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2 text-neutral-300">
                  <Badge className="bg-blue-900/40 text-blue-200">
                    Question {currentQuestion + 1} of {questionsData.length}
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
                value={answers[currentQuestion] || ""}
                onValueChange={(value) => selectAnswer(currentQuestion, value)}
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
                  disabled={currentQuestion === questionsData.length - 1}
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
        if (!results || !questionsData) return null;
        
        return (
          <Card className="bg-[#1A1F2C] border-white/5 text-white shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Assessment Results</CardTitle>
              <CardDescription className="text-neutral-400">
                {assessment.title}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="text-5xl font-bold mb-2 text-flytbase-secondary">
                    {results.score}%
                  </div>
                  <p className="text-neutral-400">
                    {results.score >= 70 ? 'Passed' : 'Failed'}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#212636] p-4 rounded-lg text-center">
                    <div className="flex justify-center text-green-400 mb-2">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <div className="text-2xl font-semibold">{results.correctAnswers}</div>
                    <p className="text-neutral-400 text-sm">Correct</p>
                  </div>
                  
                  <div className="bg-[#212636] p-4 rounded-lg text-center">
                    <div className="flex justify-center text-red-400 mb-2">
                      <XCircle className="h-6 w-6" />
                    </div>
                    <div className="text-2xl font-semibold">{results.incorrectAnswers}</div>
                    <p className="text-neutral-400 text-sm">Incorrect</p>
                  </div>
                  
                  <div className="bg-[#212636] p-4 rounded-lg text-center">
                    <div className="flex justify-center text-yellow-400 mb-2">
                      <AlertCircle className="h-6 w-6" />
                    </div>
                    <div className="text-2xl font-semibold">{results.unanswered}</div>
                    <p className="text-neutral-400 text-sm">Unanswered</p>
                  </div>
                </div>

                {results.score >= 70 && (
                  <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-4 text-center mt-6">
                    <div className="flex justify-center text-green-400 mb-3">
                      <Award className="h-10 w-10" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Congratulations! You've Qualified for a Certificate
                    </h3>
                    <p className="text-neutral-300 mb-4">
                      You've passed this assessment with a score of {results.score}%. You can now claim your official certificate.
                    </p>
                    <Button 
                      onClick={() => setShowCertificateForm(true)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Award className="mr-2 h-4 w-4" />
                      Claim Certificate
                    </Button>
                  </div>
                )}
                
                <Tabs defaultValue="summary" className="mt-6">
                  <TabsList className="bg-[#212636] border-white/5">
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="review">Review Answers</TabsTrigger>
                  </TabsList>
                  <TabsContent value="summary" className="pt-4">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Performance Summary</h3>
                      <p className="text-neutral-300">
                        You answered {results.correctAnswers} out of {results.totalQuestions} questions correctly.
                        {results.score >= 70 
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
                      {questionsData.map((q, idx) => {
                        const userAnswer = answers[idx];
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
        
        {showCertificateForm && (
          <CertificateForm 
            isOpen={showCertificateForm}
            onClose={() => setShowCertificateForm(false)}
            onSubmit={handleCertificateSubmit}
            assessmentTitle={assessment?.title || ''}
            score={results?.score || 0}
          />
        )}
        
        {showCertificate && certificateData && (
          <Certificate 
            fullName={certificateData.fullName}
            designation={certificateData.designation}
            email={certificateData.email}
            assessmentTitle={assessment?.title || ''}
            score={results?.score || 0}
            onClose={() => setShowCertificate(false)}
          />
        )}
      </div>
    </div>
  );
};

export default AssessmentDetail;
