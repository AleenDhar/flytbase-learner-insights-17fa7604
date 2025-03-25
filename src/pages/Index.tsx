
import React, { useEffect, useState } from 'react';
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
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const { user } = useAuth();
  const [coursesLoaded, setCoursesLoaded] = useState(false);
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Check if we have courses in the database
        const { data: coursesData, error } = await supabase
          .from('courses')
          .select('id, title')
          .limit(1);
          
        if (error) {
          console.error("Error checking for courses:", error);
          return;
        }
        
        setCoursesLoaded(coursesData && coursesData.length > 0);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    
    fetchCourses();
  }, []);
  
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
