
import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  CheckCircle, 
  Star, 
  TrendingUp 
} from 'lucide-react';
import MetricCard from './MetricCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush } from 'recharts';

// Mock data for enrollment trends
const enrollmentData = [
  { month: 'Jan', enrollments: 150 },
  { month: 'Feb', enrollments: 210 },
  { month: 'Mar', enrollments: 180 },
  { month: 'Apr', enrollments: 260 },
  { month: 'May', enrollments: 290 },
  { month: 'Jun', enrollments: 350 },
];

const PerformanceDashboard = () => {
  const [selectedDateRange, setSelectedDateRange] = useState({ startIndex: 0, endIndex: enrollmentData.length - 1 });

  const handleBrushChange = (data: any) => {
    if (data && data.startIndex !== undefined && data.endIndex !== undefined) {
      setSelectedDateRange({ startIndex: data.startIndex, endIndex: data.endIndex });
    }
  };

  // Format numbers with commas for thousands
  const formatNumber = (num: number | string): string => {
    if (typeof num === 'string') return num;
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Format percentage
  const formatPercentage = (value: number | string): string => {
    if (typeof value === 'string') return value;
    return `${value}%`;
  };

  // Format rating with stars
  const formatRating = (value: number | string): string => {
    if (typeof value === 'string') return value;
    return `${value} ★`;
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <MetricCard
          title="Total Students"
          value={2584}
          icon={<Users size={24} />}
          trend={{ value: 12, isPositive: true }}
          index={0}
          formatter={formatNumber}
        />
        <MetricCard
          title="Course Catalog Size"
          value={42}
          icon={<BookOpen size={24} />}
          trend={{ value: 15, isPositive: true }}
          index={1}
        />
        <MetricCard
          title="Completion Rate"
          value={78}
          icon={<CheckCircle size={24} />}
          trend={{ value: 5, isPositive: true }}
          index={2}
          formatter={formatPercentage}
        />
        <MetricCard
          title="Average Rating"
          value={4.8}
          icon={<Star size={24} />}
          trend={{ value: 0.3, isPositive: true }}
          index={3}
          formatter={formatRating}
        />
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-neutral-800">Enrollment Trends</h3>
          <div className="flex items-center">
            <TrendingUp size={18} className="text-flytbase-primary mr-2" />
            <span className="text-sm font-medium text-neutral-600">
              {selectedDateRange.startIndex !== selectedDateRange.endIndex 
                ? `${enrollmentData[selectedDateRange.startIndex].month} - ${enrollmentData[selectedDateRange.endIndex].month}`
                : enrollmentData[selectedDateRange.startIndex].month}
            </span>
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={enrollmentData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#64748B' }} 
                axisLine={{ stroke: '#E2E8F0' }} 
              />
              <YAxis 
                tick={{ fill: '#64748B' }} 
                axisLine={{ stroke: '#E2E8F0' }} 
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  padding: '8px 12px'
                }}
                labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
              />
              <Line 
                type="monotone" 
                dataKey="enrollments" 
                stroke="#1E40AF" 
                strokeWidth={3}
                dot={{ stroke: '#1E40AF', strokeWidth: 2, fill: 'white', r: 4 }}
                activeDot={{ stroke: '#1E40AF', strokeWidth: 2, fill: '#1E40AF', r: 6 }}
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
              <Brush 
                dataKey="month" 
                height={30} 
                stroke="#1E40AF"
                fill="#F9FAFB"
                onChange={handleBrushChange}
                startIndex={selectedDateRange.startIndex}
                endIndex={selectedDateRange.endIndex}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
