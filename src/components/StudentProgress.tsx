
import React from 'react';
import { GraduationCap, Award, CheckCircle, Clock, AlertCircle } from 'lucide-react';

// Types for course data
interface Course {
  id: number;
  title: string;
  progress: number;
  status: 'completed' | 'in_progress' | 'not_started';
  dueDate: string;
  score?: number;
}

// Mock data for student courses
const studentCourses: Course[] = [
  { 
    id: 1, 
    title: 'Drone Basics: Flight Principles', 
    progress: 100, 
    status: 'completed', 
    dueDate: '2023-06-15',
    score: 92
  },
  { 
    id: 2, 
    title: 'Autonomous Flight Programming', 
    progress: 68, 
    status: 'in_progress', 
    dueDate: '2023-08-20'
  },
  { 
    id: 3, 
    title: 'Drone Regulations & Compliance', 
    progress: 100, 
    status: 'completed', 
    dueDate: '2023-05-10',
    score: 88
  },
  { 
    id: 4, 
    title: 'Aerial Photography Techniques', 
    progress: 45, 
    status: 'in_progress', 
    dueDate: '2023-09-05'
  },
  { 
    id: 5, 
    title: 'Drone Maintenance & Repair', 
    progress: 0, 
    status: 'not_started', 
    dueDate: '2023-10-15'
  },
];

// Mock data for assessments
interface Assessment {
  id: number;
  title: string;
  courseId: number;
  date: string;
  status: 'completed' | 'upcoming' | 'overdue';
  score?: number;
}

const assessments: Assessment[] = [
  { id: 1, title: 'Flight Principles Final Exam', courseId: 1, date: '2023-06-10', status: 'completed', score: 92 },
  { id: 2, title: 'Autonomous Programming Midterm', courseId: 2, date: '2023-07-15', status: 'completed', score: 85 },
  { id: 3, title: 'Regulations Certification Test', courseId: 3, date: '2023-05-05', status: 'completed', score: 88 },
  { id: 4, title: 'Autonomous Programming Final', courseId: 2, date: '2023-08-18', status: 'upcoming' },
  { id: 5, title: 'Photography Portfolio Review', courseId: 4, date: '2023-09-01', status: 'upcoming' },
  { id: 6, title: 'Maintenance Practical Test', courseId: 5, date: '2023-10-10', status: 'upcoming' },
];

const StudentProgress = () => {
  // Calculate overall progress
  const overallProgress = studentCourses.reduce((acc, course) => acc + course.progress, 0) / studentCourses.length;
  
  // Check if student is certification ready (80% or higher on all completed courses)
  const completedCourses = studentCourses.filter(course => course.status === 'completed');
  const isCertificationReady = completedCourses.length > 0 && 
    completedCourses.every(course => course.score && course.score >= 80);
  
  // Sort assessments by date
  const sortedAssessments = [...assessments].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Progress Overview Card */}
      <div className="card relative">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-lg font-semibold text-neutral-800">Course Progress</h3>
          {isCertificationReady && (
            <div className="badge badge-green inline-flex items-center">
              <Award className="w-3 h-3 mr-1" />
              Certification Ready
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-32 h-32 mb-4">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              {/* Background circle */}
              <circle 
                cx="18" 
                cy="18" 
                r="16" 
                fill="none" 
                stroke="#E2E8F0" 
                strokeWidth="2" 
              />
              
              {/* Progress circle */}
              <circle 
                cx="18" 
                cy="18" 
                r="16" 
                fill="none" 
                stroke="#1E40AF" 
                strokeWidth="2" 
                strokeDasharray="100" 
                strokeDashoffset={100 - overallProgress} 
                strokeLinecap="round" 
                transform="rotate(-90 18 18)" 
                style={{ 
                  transition: "stroke-dashoffset 1s ease-in-out",
                }}
              />
              
              {/* Central text */}
              <text 
                x="18" 
                y="18" 
                textAnchor="middle" 
                dominantBaseline="middle" 
                fontSize="7" 
                fontWeight="bold" 
                fill="#1E293B"
              >
                {Math.round(overallProgress)}%
              </text>
            </svg>
            
            {/* Icon in the center */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-6">
              <GraduationCap className="w-6 h-6 text-flytbase-primary" />
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-neutral-500 text-sm">
              {completedCourses.length} of {studentCourses.length} courses completed
            </p>
          </div>
        </div>
        
        {/* Course list */}
        <div className="space-y-4">
          {studentCourses.map((course) => (
            <div key={course.id} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                course.status === 'completed' ? 'bg-green-100 text-green-600' :
                course.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                'bg-neutral-100 text-neutral-500'
              }`}>
                {course.status === 'completed' ? (
                  <CheckCircle className="w-4 h-4" />
                ) : course.status === 'in_progress' ? (
                  <Clock className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm font-medium text-neutral-800">{course.title}</p>
                  <span className="text-xs font-medium text-neutral-500">
                    {course.progress}%
                  </span>
                </div>
                
                <div className="w-full bg-neutral-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${
                      course.status === 'completed' ? 'bg-green-500' :
                      course.status === 'in_progress' ? 'bg-blue-500' :
                      'bg-neutral-400'
                    }`}
                    style={{ width: `${course.progress}%`, transition: 'width 1s ease-in-out' }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Assessment Timeline Card */}
      <div className="card">
        <h3 className="text-lg font-semibold text-neutral-800 mb-6">Assessment Timeline</h3>
        
        <div className="relative pb-4">
          {/* Vertical timeline line */}
          <div className="absolute top-0 bottom-0 left-4 w-px bg-neutral-200"></div>
          
          {/* Timeline content */}
          <div className="space-y-6">
            {sortedAssessments.map((assessment) => {
              const course = studentCourses.find(c => c.id === assessment.courseId);
              
              // Format date
              const date = new Date(assessment.date);
              const formattedDate = new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              }).format(date);
              
              return (
                <div key={assessment.id} className="flex">
                  {/* Timeline dot */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                    assessment.status === 'completed' ? 'bg-green-500 text-white' :
                    assessment.status === 'upcoming' ? 'bg-blue-500 text-white' :
                    'bg-red-500 text-white'
                  }`}>
                    {assessment.status === 'completed' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>
                  
                  {/* Assessment content */}
                  <div className="ml-4 flex-1">
                    <div className="bg-neutral-50 rounded-lg p-4 hover:bg-neutral-100 transition-colors border border-neutral-200">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-sm font-medium text-neutral-800">{assessment.title}</h4>
                        <div className={`badge ${
                          assessment.status === 'completed' ? 'badge-green' :
                          assessment.status === 'upcoming' ? 'badge-blue' :
                          'badge-red'
                        }`}>
                          {assessment.status === 'completed' ? 'Completed' :
                           assessment.status === 'upcoming' ? 'Upcoming' :
                           'Overdue'}
                        </div>
                      </div>
                      
                      <div className="flex justify-between text-xs text-neutral-500 mb-3">
                        <span>{course?.title}</span>
                        <span>{formattedDate}</span>
                      </div>
                      
                      {assessment.status === 'completed' && assessment.score !== undefined && (
                        <div className="flex items-center">
                          <div className="flex-1 bg-neutral-200 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full ${
                                assessment.score >= 80 ? 'bg-green-500' :
                                assessment.score >= 60 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${assessment.score}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-xs font-medium text-neutral-700">
                            {assessment.score}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProgress;
