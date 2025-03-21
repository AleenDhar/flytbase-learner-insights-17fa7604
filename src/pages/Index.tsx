
import React from 'react';
import Navigation from '@/components/Navigation';
import PerformanceDashboard from '@/components/PerformanceDashboard';
import CourseInsights from '@/components/CourseInsights';
import StudentProgress from '@/components/StudentProgress';

const Index = () => {
  return (
    <div className="min-h-screen bg-neutral-100">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Learning Dashboard</h1>
          <p className="text-neutral-600">Track your progress and explore FlytBase drone courses</p>
        </div>
        
        <div className="space-y-8">
          {/* Performance Dashboard */}
          <section className="animate-fade-in" style={{ '--delay': '0' } as React.CSSProperties}>
            <PerformanceDashboard />
          </section>
          
          {/* Course Insights */}
          <section className="animate-fade-in" style={{ '--delay': '1' } as React.CSSProperties}>
            <CourseInsights />
          </section>
          
          {/* Student Progress */}
          <section className="animate-fade-in" style={{ '--delay': '2' } as React.CSSProperties}>
            <h2 className="text-xl font-semibold text-neutral-800 mb-4">Student Progress</h2>
            <StudentProgress />
          </section>
        </div>
      </main>
      
      <footer className="bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-neutral-500 text-sm">
            <p>© 2023 FlytBase Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
