
import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@clerk/clerk-react";
import PerformanceDashboard from "@/components/PerformanceDashboard";
import CoursePopularity from "@/components/CoursePopularity";
import { ArrowUpRight, TrendingUp, UserCheck, Clipboard, CalendarClock } from "lucide-react";

const AdminDashboard = () => {
  const { user } = useUser();
  const [timeRange, setTimeRange] = useState("month");

  return (
    <div className="min-h-screen bg-flytbase-primary">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-100">Admin Dashboard</h1>
            <p className="text-neutral-400 mt-1">
              Welcome, {user?.firstName || "Admin"}! Manage your academy and view learner analytics.
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-[#1A1F2C] rounded-md p-1 border border-white/5">
            <button 
              onClick={() => setTimeRange("week")}
              className={`px-3 py-1.5 rounded text-sm ${timeRange === "week" ? "bg-flytbase-secondary text-white" : "text-neutral-400"}`}
            >
              Week
            </button>
            <button 
              onClick={() => setTimeRange("month")}
              className={`px-3 py-1.5 rounded text-sm ${timeRange === "month" ? "bg-flytbase-secondary text-white" : "text-neutral-400"}`}
            >
              Month
            </button>
            <button 
              onClick={() => setTimeRange("year")}
              className={`px-3 py-1.5 rounded text-sm ${timeRange === "year" ? "bg-flytbase-secondary text-white" : "text-neutral-400"}`}
            >
              Year
            </button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-[#1A1F2C] border border-white/5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Learner Analytics</TabsTrigger>
            <TabsTrigger value="courses">Course Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="animate-fade-in space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-[#1A1F2C] border-white/5 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Total Users</CardTitle>
                  <CardDescription className="text-neutral-400">All registered users</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">254</p>
                </CardContent>
              </Card>
              
              <Card className="bg-[#1A1F2C] border-white/5 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Active Courses</CardTitle>
                  <CardDescription className="text-neutral-400">Published courses</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">12</p>
                </CardContent>
              </Card>
              
              <Card className="bg-[#1A1F2C] border-white/5 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Enrollments</CardTitle>
                  <CardDescription className="text-neutral-400">Total course enrollments</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">876</p>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-[#1A1F2C] border-white/5 text-white p-4">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="border-b border-white/5 pb-3 last:border-0">
                      <p className="text-neutral-300">User enrolled in Drone Flight Basics</p>
                      <p className="text-sm text-neutral-500">2 hours ago</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="animate-fade-in space-y-6">
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
          </TabsContent>
          
          <TabsContent value="courses" className="animate-fade-in space-y-6">
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
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
