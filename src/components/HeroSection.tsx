import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative bg-flytbase-primary text-white py-20 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="/lovable-uploads/c9cca1b7-22a0-4793-9b9b-aec57fef1c70.png"
          alt="Drone background"
          className="w-full h-full object-cover opacity-30"
          style={{ maxWidth: "100%", height: "100%" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-flytbase-primary via-flytbase-primary/80 to-transparent"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="md:flex md:items-center md:justify-between">
          <div
            className="md:w-3/5 animate-fade-in"
            style={{ "--delay": "0" } as React.CSSProperties}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Your Journey to{" "}
              <span className="text-[#ffab49]">Drone Autonomy</span> Starts Here
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Become a certified drone expert with our industry-leading courses
              and hands-on training
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-white text-flytbase-primary hover:bg-blue-50"
                asChild
              >
                <Link to="/courses">
                  Explore Courses
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent border-white text-white hover:bg-white/10"
                asChild
              >
                <Link to="/sign-up">Sign Up Free</Link>
              </Button>
            </div>
          </div>
          <div
            className="hidden md:block md:w-2/5 animate-fade-in"
            style={{ "--delay": "1" } as React.CSSProperties}
          >
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
  );
};

export default HeroSection;
