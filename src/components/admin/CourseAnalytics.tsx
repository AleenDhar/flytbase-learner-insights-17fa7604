
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import CoursePopularity from "@/components/CoursePopularity";

const CourseAnalytics = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-[#1A1F2C] border-white/5 text-white p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-xl flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-flytbase-secondary" />
            Course Performance Analytics
          </CardTitle>
          <CardDescription className="text-neutral-400">
            Insights into the most popular courses and engagement metrics
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <CoursePopularity />
        </CardContent>
      </Card>
      
      <Card className="bg-[#1A1F2C] border-white/5 text-white">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-lg flex items-center gap-2">
              <ArrowUpRight className="h-5 w-5 text-flytbase-secondary" />
              Conversion Rates
            </span>
            <span className="text-sm text-neutral-400">Last 30 days</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-neutral-300">Course View to Enrollment</span>
                <span className="font-medium">24.8%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-flytbase-secondary h-2 rounded-full" style={{ width: "24.8%" }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-neutral-300">Course Start to Completion</span>
                <span className="font-medium">67.5%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-flytbase-secondary h-2 rounded-full" style={{ width: "67.5%" }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-neutral-300">Free to Premium Conversion</span>
                <span className="font-medium">12.3%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-flytbase-secondary h-2 rounded-full" style={{ width: "12.3%" }}></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseAnalytics;
