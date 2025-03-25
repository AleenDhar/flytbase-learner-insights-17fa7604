
import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, FileText, Award } from 'lucide-react';

const WhyFlytBaseSection = () => {
  const features = [
    {
      icon: <Briefcase className="h-6 w-6 text-flytbase-secondary" />,
      title: "Flexible Learning",
      description: "Master autonomous drone operations at your own pace with our remote and self-paced training programs."
    },
    {
      icon: <FileText className="h-6 w-6 text-flytbase-secondary" />,
      title: "Comprehensive Curriculum",
      description: "Explore autonomous drone technology through our tailor-made courses. Covering all industry aspects from foundation to advanced levels, we ensure learners at any stage gain comprehensive skills and insights."
    },
    {
      icon: <Award className="h-6 w-6 text-flytbase-secondary" />,
      title: "Industry-Expert Led",
      description: "Learn directly from industry leaders at the forefront of autonomous drone operations. Our courses are led by experts actively shaping enterprise solutions across diverse applications."
    }
  ];

  return (
    <section className="py-16 bg-[#0B121E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <h2 className="text-3xl font-bold text-white">Why FlytBase<br />Academy?</h2>
          <div className="max-w-xl">
            <p className="text-lg text-neutral-300">
              Enhance industry awareness, bridge skill gaps, and maximize the ROI of your autonomous drone program.
            </p>
            <Link to="/courses" className="text-flytbase-secondary font-medium mt-4 inline-block hover:underline">
              See Courses
            </Link>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-[#1A1F2C] p-8 rounded-lg border border-white/5 hover-lift"
            >
              <div className="h-12 w-12 rounded-full bg-[#243042] flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">{feature.title}</h3>
              <p className="text-neutral-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyFlytBaseSection;
