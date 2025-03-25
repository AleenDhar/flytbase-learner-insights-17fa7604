
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clipboard, UserCheck, CalendarClock } from "lucide-react";
import PerformanceDashboard from "@/components/PerformanceDashboard";

const LearnerAnalytics = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-[#1A1F2C] border-white/5 text-white p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-xl flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-flytbase-secondary" />
            Learner Performance Overview
          </CardTitle>
          <CardDescription className="text-neutral-400">
            Analytics about user engagement and learning activities
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <PerformanceDashboard />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-[#1A1F2C] border-white/5 text-white">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clipboard className="h-5 w-5 text-flytbase-secondary" />
              Assessment Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-neutral-300">Drone Flight Basics</span>
                <span className="font-medium">78%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-flytbase-secondary h-2 rounded-full" style={{ width: "78%" }}></div>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-neutral-300">Advanced Navigation</span>
                <span className="font-medium">65%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-flytbase-secondary h-2 rounded-full" style={{ width: "65%" }}></div>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-neutral-300">Regulations & Compliance</span>
                <span className="font-medium">92%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-flytbase-secondary h-2 rounded-full" style={{ width: "92%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#1A1F2C] border-white/5 text-white">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-flytbase-secondary" />
              Average Learning Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="border-b border-white/5 pb-3">
                <div className="flex justify-between">
                  <span className="text-neutral-300">Weekly Average</span>
                  <span className="text-white font-medium">3.2 hours</span>
                </div>
                <div className="text-sm text-neutral-500 mt-1">Per active user</div>
              </div>
              
              <div className="border-b border-white/5 pb-3">
                <div className="flex justify-between">
                  <span className="text-neutral-300">Monthly Average</span>
                  <span className="text-white font-medium">14.5 hours</span>
                </div>
                <div className="text-sm text-neutral-500 mt-1">Per active user</div>
              </div>
              
              <div>
                <div className="flex justify-between">
                  <span className="text-neutral-300">Most Active Time</span>
                  <span className="text-white font-medium">6PM - 9PM</span>
                </div>
                <div className="text-sm text-neutral-500 mt-1">Weekdays</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LearnerAnalytics;
