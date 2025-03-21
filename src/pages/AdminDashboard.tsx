
import React from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@clerk/clerk-react";

const AdminDashboard = () => {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-flytbase-primary">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-neutral-100">Admin Dashboard</h1>
            <p className="text-neutral-400 mt-1">
              Welcome, {user?.firstName || "Admin"}! Manage your academy from here.
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-[#1A1F2C] border border-white/5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
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
          
          <TabsContent value="users" className="animate-fade-in">
            <Card className="bg-[#1A1F2C] border-white/5 text-white p-4">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription className="text-neutral-400">
                  Manage all academy users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-300">
                  This section will allow you to see and manage all registered users.
                  You can edit user roles, view their progress, and more.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="courses" className="animate-fade-in">
            <Card className="bg-[#1A1F2C] border-white/5 text-white p-4">
              <CardHeader>
                <CardTitle>Course Management</CardTitle>
                <CardDescription className="text-neutral-400">
                  Manage all courses in the academy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-300">
                  This section will allow you to create, edit, and manage courses.
                  You can update content, view analytics, and more.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
