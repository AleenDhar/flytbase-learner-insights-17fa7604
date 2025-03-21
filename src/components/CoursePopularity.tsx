
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Star, Users, CheckCircle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for popular courses
const popularCourses = [
  { 
    id: 1, 
    title: "Drone Piloting Fundamentals",
    enrollments: 458,
    completionRate: 72,
    rating: 4.7
  },
  { 
    id: 2, 
    title: "Advanced Flight Operations",
    enrollments: 387,
    completionRate: 68,
    rating: 4.8
  },
  { 
    id: 3, 
    title: "Aerial Photography Essentials",
    enrollments: 342,
    completionRate: 76,
    rating: 4.9
  },
  { 
    id: 4, 
    title: "Drone Mapping & Surveying",
    enrollments: 315,
    completionRate: 65,
    rating: 4.6
  },
  { 
    id: 5, 
    title: "Drone Regulations & Compliance",
    enrollments: 289,
    completionRate: 81,
    rating: 4.5
  }
];

// Mock data for monthly enrollments
const monthlyEnrollments = [
  { month: 'Jan', enrollments: 180 },
  { month: 'Feb', enrollments: 220 },
  { month: 'Mar', enrollments: 250 },
  { month: 'Apr', enrollments: 310 },
  { month: 'May', enrollments: 290 },
  { month: 'Jun', enrollments: 380 }
];

const CoursePopularity = () => {
  return (
    <div className="space-y-6">
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-flytbase-secondary" />
            Top 5 Most Popular Courses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Users className="h-4 w-4" />
                    Enrollments
                  </div>
                </TableHead>
                <TableHead className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <CheckCircle className="h-4 w-4" />
                    Completion
                  </div>
                </TableHead>
                <TableHead className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Star className="h-4 w-4" />
                    Rating
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {popularCourses.map((course) => (
                <TableRow key={course.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell className="text-right">{course.enrollments}</TableCell>
                  <TableCell className="text-right">{course.completionRate}%</TableCell>
                  <TableCell className="text-right">{course.rating} ★</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-flytbase-secondary" />
            Course Enrollment Trends (Past 6 Months)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyEnrollments}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#2A3249" />
                <XAxis dataKey="month" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1A1F2C',
                    borderRadius: '0.5rem',
                    border: '1px solid #2A3249',
                    color: '#F9FAFB'
                  }}
                  cursor={{ fill: 'rgba(14, 97, 221, 0.1)' }}
                />
                <Bar 
                  dataKey="enrollments" 
                  name="Enrollments" 
                  fill="#0E61DD" 
                  radius={[4, 4, 0, 0]}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoursePopularity;
