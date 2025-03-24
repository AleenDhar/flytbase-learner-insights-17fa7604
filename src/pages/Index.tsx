import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import BrandLogo from '@/components/BrandLogo';
import TestimonialSlider from '@/components/TestimonialSlider';
import { BookOpen, Award, Layers, Users, ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-neutral-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-flytbase-primary text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[url('../lovable-uploads/21a681d0-8a71-4d3d-907a-38d6aeed53d4.png')] bg-cover bg-center bg-no-repeat"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-flytbase-primary via-flytbase-primary/80 to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-3/5 animate-fade-in" style={{ '--delay': '0' } as React.CSSProperties}>
              <p className="text-xl mb-8 text-blue-100">Become a certified drone expert with our industry-leading courses and hands-on training</p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-white text-flytbase-primary hover:bg-blue-50" asChild>
                  <Link to="/courses">
                    Explore Courses
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10" asChild>
                  <Link to="/sign-up">
                    Sign Up Free
                  </Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block md:w-2/5 animate-fade-in" style={{ '--delay': '1' } as React.CSSProperties}>
              <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <img 
                  src="/lovable-uploads/481a13eb-6855-4500-888c-8c5d4a3734a1.png" 
                  alt="Advanced drone equipment and technology" 
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-flytbase-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Why Choose FlytBase Academy</h2>
            <p className="text-lg text-neutral-300 mt-4 max-w-3xl mx-auto">
              Our comprehensive curriculum and industry partnerships ensure you get the skills needed in today's drone technology landscape
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <BookOpen className="h-10 w-10" />,
                title: "Expert-Led Courses",
                description: "Learn from industry professionals with years of real-world drone experience"
              },
              {
                icon: <Award className="h-10 w-10" />,
                title: "Industry Certification",
                description: "Earn recognized certifications that boost your career prospects"
              },
              {
                icon: <Layers className="h-10 w-10" />,
                title: "Hands-on Projects",
                description: "Apply your knowledge through practical exercises and simulations"
              },
              {
                icon: <Users className="h-10 w-10" />,
                title: "Community Support",
                description: "Join a global community of drone enthusiasts and professionals"
              }
            ].map((feature, index) => (
              <Card key={index} className="border-none bg-[#1A1F2C] shadow-card hover-lift animate-fade-in" style={{ '--delay': index * 0.1 + 2 } as React.CSSProperties}>
                <CardContent className="pt-6">
                  <div className="rounded-full bg-flytbase-secondary/20 p-3 inline-flex text-flytbase-secondary mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                  <p className="text-neutral-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Course Categories */}
      <section className="py-16 bg-[#121723]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Explore Our Curriculum</h2>
            <p className="text-lg text-neutral-300 mt-4 max-w-3xl mx-auto">
              From beginner to expert, we offer a range of courses to help you master drone technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Drone Piloting Fundamentals",
                level: "Beginner",
                modules: 8,
                image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1"
              },
              {
                title: "Advanced Flight Operations",
                level: "Intermediate",
                modules: 12,
                image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
              },
              {
                title: "Drone Programming & Automation",
                level: "Advanced",
                modules: 10,
                image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c"
              }
            ].map((course, index) => (
              <div 
                key={index}
                className="rounded-xl overflow-hidden shadow-card bg-[#1A1F2C] hover-lift animate-fade-in"
                style={{ '--delay': index * 0.1 + 3 } as React.CSSProperties}
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="badge badge-blue bg-blue-900/40 text-blue-200 text-xs py-1 px-2 rounded">{course.level}</span>
                    <span className="text-sm text-neutral-400">{course.modules} Modules</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white">{course.title}</h3>
                  <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 text-white">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button size="lg" className="bg-flytbase-secondary text-white hover:bg-flytbase-secondary/90">
              View All Courses
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Testimonial Section - Updated with dynamic testimonials */}
      <section className="py-16 bg-flytbase-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">What Our Students Say</h2>
          </div>
          
          <TestimonialSlider />
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-12 bg-flytbase-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Drone Journey?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-blue-100">
            Join thousands of students who have advanced their careers with FlytBase Academy
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-white text-flytbase-secondary hover:bg-blue-50" asChild>
              <Link to="/sign-up">
                Get Started Today
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10" asChild>
              <Link to="/courses">
                Browse Courses
              </Link>
            </Button>
          </div>
        </div>
      </section>
      
      <footer className="bg-[#0A0F18] text-neutral-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="mb-4">
                <BrandLogo />
              </div>
              <p className="mb-4">Empowering the next generation of drone experts with cutting-edge education and certification.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="https://flytbase.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">FlytBase.com</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                {["Help Center", "Contact Us", "FAQs", "System Requirements", "Privacy Policy"].map((item, i) => (
                  <li key={i}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Newsletter</h4>
              <p className="mb-4">Subscribe to our newsletter for the latest updates and offers.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-[#1A1F2C] text-white px-4 py-2 rounded-l-md focus:outline-none flex-1"
                />
                <Button className="rounded-l-none bg-flytbase-secondary hover:bg-flytbase-secondary/90">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-neutral-800 pt-8 mt-8 text-center">
            <p>© {new Date().getFullYear()} FlytBase Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
