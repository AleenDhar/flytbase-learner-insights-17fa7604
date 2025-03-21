
import React, { useState } from 'react';
import { Filter, Check, Star, ChevronDown, ChevronUp } from 'lucide-react';

// Define types for our data
interface Course {
  id: number;
  rank: number;
  title: string;
  enrollments: number;
  completionRate: number;
  rating: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number; // in hours
  topic: string;
}

// Mock data for courses
const coursesData: Course[] = [
  { id: 1, rank: 1, title: 'Drone Basics: Flight Principles', enrollments: 1250, completionRate: 92, rating: 4.8, difficulty: 'Beginner', duration: 3, topic: 'Flight' },
  { id: 2, rank: 2, title: 'Autonomous Flight Programming', enrollments: 980, completionRate: 78, rating: 4.7, difficulty: 'Advanced', duration: 10, topic: 'Autonomy' },
  { id: 3, rank: 3, title: 'Drone Regulations & Compliance', enrollments: 820, completionRate: 85, rating: 4.5, difficulty: 'Beginner', duration: 2, topic: 'Regulations' },
  { id: 4, rank: 4, title: 'Aerial Photography Techniques', enrollments: 750, completionRate: 80, rating: 4.9, difficulty: 'Intermediate', duration: 6, topic: 'Photography' },
  { id: 5, rank: 5, title: 'Drone Maintenance & Repair', enrollments: 690, completionRate: 88, rating: 4.6, difficulty: 'Intermediate', duration: 5, topic: 'Maintenance' },
  { id: 6, rank: 6, title: 'Advanced Mapping & Surveying', enrollments: 580, completionRate: 72, rating: 4.4, difficulty: 'Advanced', duration: 12, topic: 'Mapping' },
  { id: 7, rank: 7, title: 'Drone Fleet Management', enrollments: 480, completionRate: 76, rating: 4.3, difficulty: 'Advanced', duration: 8, topic: 'Management' },
  { id: 8, rank: 8, title: 'Weather Assessment for Pilots', enrollments: 420, completionRate: 82, rating: 4.5, difficulty: 'Beginner', duration: 2, topic: 'Weather' },
];

// Enum for sort types
enum SortType {
  RANK_ASC = 'rank_asc',
  RANK_DESC = 'rank_desc',
  TITLE_ASC = 'title_asc',
  TITLE_DESC = 'title_desc',
  ENROLLMENTS_ASC = 'enrollments_asc',
  ENROLLMENTS_DESC = 'enrollments_desc',
  COMPLETION_ASC = 'completion_asc',
  COMPLETION_DESC = 'completion_desc',
  RATING_ASC = 'rating_asc',
  RATING_DESC = 'rating_desc',
}

const CourseInsights = () => {
  const [courses, setCourses] = useState<Course[]>(coursesData);
  const [sortType, setSortType] = useState<SortType>(SortType.RANK_ASC);
  const [hoveredCourseId, setHoveredCourseId] = useState<number | null>(null);
  const [filters, setFilters] = useState({
    difficulty: [] as ('Beginner' | 'Intermediate' | 'Advanced')[],
    duration: [] as ('short' | 'medium' | 'long')[],
    topic: [] as string[],
  });
  const [showFilters, setShowFilters] = useState(false);

  // Get unique topics for filter dropdown
  const topics = Array.from(new Set(coursesData.map(course => course.topic)));

  // Toggle filters display
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Handle filter changes
  const handleFilterChange = (filterType: 'difficulty' | 'duration' | 'topic', value: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      
      if (filterType === 'difficulty') {
        const val = value as 'Beginner' | 'Intermediate' | 'Advanced';
        if (newFilters.difficulty.includes(val)) {
          newFilters.difficulty = newFilters.difficulty.filter(d => d !== val);
        } else {
          newFilters.difficulty = [...newFilters.difficulty, val];
        }
      } else if (filterType === 'duration') {
        const val = value as 'short' | 'medium' | 'long';
        if (newFilters.duration.includes(val)) {
          newFilters.duration = newFilters.duration.filter(d => d !== val);
        } else {
          newFilters.duration = [...newFilters.duration, val];
        }
      } else if (filterType === 'topic') {
        if (newFilters.topic.includes(value)) {
          newFilters.topic = newFilters.topic.filter(t => t !== value);
        } else {
          newFilters.topic = [...newFilters.topic, value];
        }
      }
      
      return newFilters;
    });
  };

  // Filter courses based on selected filters
  const filteredCourses = courses.filter(course => {
    // Filter by difficulty
    if (filters.difficulty.length > 0 && !filters.difficulty.includes(course.difficulty)) {
      return false;
    }
    
    // Filter by duration
    if (filters.duration.length > 0) {
      const durationCategory = 
        course.duration < 4 ? 'short' :
        course.duration < 8 ? 'medium' : 'long';
      
      if (!filters.duration.includes(durationCategory)) {
        return false;
      }
    }
    
    // Filter by topic
    if (filters.topic.length > 0 && !filters.topic.includes(course.topic)) {
      return false;
    }
    
    return true;
  });

  // Handle sorting
  const handleSort = (newSortType: SortType) => {
    setSortType(newSortType);
    
    const sortedCourses = [...courses];
    
    switch (newSortType) {
      case SortType.RANK_ASC:
        sortedCourses.sort((a, b) => a.rank - b.rank);
        break;
      case SortType.RANK_DESC:
        sortedCourses.sort((a, b) => b.rank - a.rank);
        break;
      case SortType.TITLE_ASC:
        sortedCourses.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case SortType.TITLE_DESC:
        sortedCourses.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case SortType.ENROLLMENTS_ASC:
        sortedCourses.sort((a, b) => a.enrollments - b.enrollments);
        break;
      case SortType.ENROLLMENTS_DESC:
        sortedCourses.sort((a, b) => b.enrollments - a.enrollments);
        break;
      case SortType.COMPLETION_ASC:
        sortedCourses.sort((a, b) => a.completionRate - b.completionRate);
        break;
      case SortType.COMPLETION_DESC:
        sortedCourses.sort((a, b) => b.completionRate - a.completionRate);
        break;
      case SortType.RATING_ASC:
        sortedCourses.sort((a, b) => a.rating - b.rating);
        break;
      case SortType.RATING_DESC:
        sortedCourses.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    
    setCourses(sortedCourses);
  };

  // Get sort indicator
  const getSortIndicator = (column: string) => {
    if (column === 'rank') {
      if (sortType === SortType.RANK_ASC) return <ChevronUp className="w-4 h-4" />;
      if (sortType === SortType.RANK_DESC) return <ChevronDown className="w-4 h-4" />;
    } else if (column === 'title') {
      if (sortType === SortType.TITLE_ASC) return <ChevronUp className="w-4 h-4" />;
      if (sortType === SortType.TITLE_DESC) return <ChevronDown className="w-4 h-4" />;
    } else if (column === 'enrollments') {
      if (sortType === SortType.ENROLLMENTS_ASC) return <ChevronUp className="w-4 h-4" />;
      if (sortType === SortType.ENROLLMENTS_DESC) return <ChevronDown className="w-4 h-4" />;
    } else if (column === 'completion') {
      if (sortType === SortType.COMPLETION_ASC) return <ChevronUp className="w-4 h-4" />;
      if (sortType === SortType.COMPLETION_DESC) return <ChevronDown className="w-4 h-4" />;
    } else if (column === 'rating') {
      if (sortType === SortType.RATING_ASC) return <ChevronUp className="w-4 h-4" />;
      if (sortType === SortType.RATING_DESC) return <ChevronDown className="w-4 h-4" />;
    }
    
    return null;
  };

  // Get rating stars
  const getRatingStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(rating)) {
        stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
      } else if (i === Math.floor(rating) && rating % 1 > 0) {
        stars.push(
          <div key={i} className="relative">
            <Star className="w-4 h-4 text-yellow-400" />
            <div className="absolute top-0 left-0 overflow-hidden" style={{ width: `${(rating % 1) * 100}%` }}>
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-yellow-400" />);
      }
    }
    return <div className="flex">{stars}</div>;
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-neutral-800">Course Insights</h3>
        <button
          onClick={toggleFilters}
          className="flex items-center px-3 py-1.5 bg-flytbase-light text-flytbase-primary rounded-md text-sm font-medium hover:bg-flytbase-light/80 transition-colors"
        >
          <Filter size={16} className="mr-1.5" />
          Filter
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6 p-4 bg-neutral-50 rounded-lg animate-fade-in">
          <h4 className="text-sm font-medium text-neutral-700 mb-3">Filter Options</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Difficulty filter */}
            <div>
              <h5 className="text-xs font-medium text-neutral-600 mb-2">Difficulty</h5>
              <div className="space-y-2">
                {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                  <div key={level} className="flex items-center">
                    <button
                      onClick={() => handleFilterChange('difficulty', level)}
                      className="flex items-center"
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        filters.difficulty.includes(level as 'Beginner' | 'Intermediate' | 'Advanced')
                          ? 'bg-flytbase-primary border-flytbase-primary'
                          : 'border-neutral-300'
                      }`}>
                        {filters.difficulty.includes(level as 'Beginner' | 'Intermediate' | 'Advanced') && (
                          <Check size={12} className="text-white" />
                        )}
                      </div>
                      <span className="ml-2 text-sm text-neutral-700">{level}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Duration filter */}
            <div>
              <h5 className="text-xs font-medium text-neutral-600 mb-2">Duration</h5>
              <div className="space-y-2">
                {[
                  { id: 'short', label: 'Short (<4h)' },
                  { id: 'medium', label: 'Medium (4-8h)' },
                  { id: 'long', label: 'Long (>8h)' }
                ].map((duration) => (
                  <div key={duration.id} className="flex items-center">
                    <button
                      onClick={() => handleFilterChange('duration', duration.id)}
                      className="flex items-center"
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        filters.duration.includes(duration.id as 'short' | 'medium' | 'long')
                          ? 'bg-flytbase-primary border-flytbase-primary'
                          : 'border-neutral-300'
                      }`}>
                        {filters.duration.includes(duration.id as 'short' | 'medium' | 'long') && (
                          <Check size={12} className="text-white" />
                        )}
                      </div>
                      <span className="ml-2 text-sm text-neutral-700">{duration.label}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Topic filter */}
            <div>
              <h5 className="text-xs font-medium text-neutral-600 mb-2">Topic</h5>
              <div className="space-y-2">
                {topics.map((topic) => (
                  <div key={topic} className="flex items-center">
                    <button
                      onClick={() => handleFilterChange('topic', topic)}
                      className="flex items-center"
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        filters.topic.includes(topic)
                          ? 'bg-flytbase-primary border-flytbase-primary'
                          : 'border-neutral-300'
                      }`}>
                        {filters.topic.includes(topic) && (
                          <Check size={12} className="text-white" />
                        )}
                      </div>
                      <span className="ml-2 text-sm text-neutral-700">{topic}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Courses Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200">
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort(sortType === SortType.RANK_ASC ? SortType.RANK_DESC : SortType.RANK_ASC)}>
                <div className="flex items-center">
                  <span>Rank</span>
                  <span className="ml-1">{getSortIndicator('rank')}</span>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort(sortType === SortType.TITLE_ASC ? SortType.TITLE_DESC : SortType.TITLE_ASC)}>
                <div className="flex items-center">
                  <span>Course Title</span>
                  <span className="ml-1">{getSortIndicator('title')}</span>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort(sortType === SortType.ENROLLMENTS_ASC ? SortType.ENROLLMENTS_DESC : SortType.ENROLLMENTS_ASC)}>
                <div className="flex items-center">
                  <span>Enrollments</span>
                  <span className="ml-1">{getSortIndicator('enrollments')}</span>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort(sortType === SortType.COMPLETION_ASC ? SortType.COMPLETION_DESC : SortType.COMPLETION_ASC)}>
                <div className="flex items-center">
                  <span>Completion %</span>
                  <span className="ml-1">{getSortIndicator('completion')}</span>
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort(sortType === SortType.RATING_ASC ? SortType.RATING_DESC : SortType.RATING_ASC)}>
                <div className="flex items-center">
                  <span>Rating</span>
                  <span className="ml-1">{getSortIndicator('rating')}</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <tr 
                  key={course.id} 
                  className={`hover:bg-neutral-50 transition-colors ${hoveredCourseId === course.id ? 'bg-neutral-50' : ''}`}
                  onMouseEnter={() => setHoveredCourseId(course.id)}
                  onMouseLeave={() => setHoveredCourseId(null)}
                >
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                    {course.rank}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-800">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-flytbase-light flex items-center justify-center text-flytbase-primary mr-3">
                        {course.topic.charAt(0)}
                      </div>
                      <span>{course.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-600">
                    {course.enrollments.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                      <div className="w-20 bg-neutral-200 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full ${
                            course.completionRate >= 90 ? 'bg-green-500' :
                            course.completionRate >= 75 ? 'bg-blue-500' :
                            course.completionRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${course.completionRate}%` }}
                        ></div>
                      </div>
                      <span className="text-neutral-600">{course.completionRate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-neutral-600">
                    <div className="flex items-center">
                      {getRatingStars(course.rating)}
                      <span className="ml-2">{course.rating.toFixed(1)}</span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-neutral-500">
                  No courses match the selected filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Course Preview (if hovered) */}
      {hoveredCourseId !== null && filteredCourses.find(c => c.id === hoveredCourseId) && (
        <div className="fixed bottom-4 right-4 w-72 bg-white rounded-lg shadow-xl p-4 animate-fade-in z-50 border border-neutral-200">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium text-neutral-800">
              {filteredCourses.find(c => c.id === hoveredCourseId)?.title}
            </h4>
            <div className="badge badge-blue">
              {filteredCourses.find(c => c.id === hoveredCourseId)?.difficulty}
            </div>
          </div>
          <div className="space-y-2 text-xs text-neutral-600 mb-3">
            <div className="flex justify-between">
              <span>Enrollments:</span>
              <span className="font-medium">{filteredCourses.find(c => c.id === hoveredCourseId)?.enrollments.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Completion:</span>
              <span className="font-medium">{filteredCourses.find(c => c.id === hoveredCourseId)?.completionRate}%</span>
            </div>
            <div className="flex justify-between">
              <span>Duration:</span>
              <span className="font-medium">{filteredCourses.find(c => c.id === hoveredCourseId)?.duration}h</span>
            </div>
            <div className="flex justify-between">
              <span>Topic:</span>
              <span className="font-medium">{filteredCourses.find(c => c.id === hoveredCourseId)?.topic}</span>
            </div>
          </div>
          <button className="w-full text-center py-1.5 bg-flytbase-primary text-white rounded-md text-sm hover:bg-flytbase-primary/90 transition-colors">
            View Course Details
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseInsights;
