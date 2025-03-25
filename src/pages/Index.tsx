
import React from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import CourseCategories from '@/components/CourseCategories';
import TestimonialSection from '@/components/TestimonialSection';
import CTASection from '@/components/CTASection';
import PageFooter from '@/components/PageFooter';
import ContinueLearningSection from '@/components/ContinueLearningSection';
import WhyFlytBaseSection from '@/components/WhyFlytBaseSection';
import CertificationSection from '@/components/CertificationSection';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-neutral-100 relative">
      <Navigation />
      
      <main className="relative">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Continue Learning Section (for signed-in users) */}
        {user && <ContinueLearningSection />}
        
        {/* Why FlytBase Academy Section */}
        <WhyFlytBaseSection />
        
        {/* Course Categories */}
        <CourseCategories />
        
        {/* Certification Section */}
        <CertificationSection />
        
        {/* Testimonial Section */}
        <TestimonialSection />
        
        {/* CTA Section */}
        <CTASection />
      </main>
      
      {/* Footer */}
      <PageFooter />
    </div>
  );
};

export default Index;
