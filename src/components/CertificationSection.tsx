
import React from 'react';
import { Award, TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CertificationSection = () => {
  const benefits = [
    {
      icon: <Award className="h-6 w-6 text-flytbase-secondary" />,
      title: "Gain Comprehensive Industry Knowledge",
      description: "Master the autonomous drone industry—from essential components and solution development to flight safety and compliance. Understand the full impact of autonomy in your sector."
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-flytbase-secondary" />,
      title: "Boost Confidence and Credibility",
      description: "Stand out in the drone community with FlytBase certifications, demonstrating your leadership in autonomous operations or drone solution delivery."
    },
    {
      icon: <Clock className="h-6 w-6 text-flytbase-secondary" />,
      title: "Fuel Growth in the Autonomous Drone Industry",
      description: "Consider FlytBase certifications as an investment in your future, setting you up for leadership in drone autonomy and promoting your personal, professional, and business advancement."
    }
  ];

  return (
    <section className="py-16 bg-[#0B121E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <h2 className="text-3xl font-bold text-white">Make it official.<br />Get certified.</h2>
          <div className="max-w-xl">
            <p className="text-lg text-neutral-300">
              Whether you're new to autonomous drone operations, a seasoned remote operator, or a system integrator developing solutions for enterprises, there's a certification for you.
            </p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="bg-[#1A1F2C] p-8 rounded-lg border border-white/5 hover-lift"
            >
              <div className="h-12 w-12 rounded-full bg-[#243042] flex items-center justify-center mb-6">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">{benefit.title}</h3>
              <p className="text-neutral-400">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button size="lg" className="bg-flytbase-secondary text-white hover:bg-flytbase-secondary/90" asChild>
            <Link to="/assessments">
              View Certification Programs
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CertificationSection;
