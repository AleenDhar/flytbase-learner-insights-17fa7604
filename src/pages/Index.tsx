
import React from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import CourseCategories from '@/components/CourseCategories';
import TestimonialSection from '@/components/TestimonialSection';
import CTASection from '@/components/CTASection';
import PageFooter from '@/components/PageFooter';
import ContinueLearningSection from '@/components/ContinueLearningSection';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-neutral-100">
      <Navigation />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Continue Learning Section (for signed-in users) */}
      {user && <ContinueLearningSection />}
      
      {/* Course Categories */}
      <CourseCategories />
      
      {/* Testimonial Section */}
      <TestimonialSection />
      
      {/* CTA Section */}
      <CTASection />
      
      {/* Footer */}
      <PageFooter />
    </div>
  );
};

export default Index;
