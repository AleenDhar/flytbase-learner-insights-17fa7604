
import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminQuickLinks from "@/components/admin/AdminQuickLinks";
import AdminTabsContent from "@/components/admin/AdminTabsContent";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("month");

  return (
    <div className="min-h-screen bg-flytbase-primary">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <AdminHeader user={user} timeRange={timeRange} setTimeRange={setTimeRange} />
        
        {/* Admin Quick Links */}
        <AdminQuickLinks />
        
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="bg-[#1A1F2C] border border-white/5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Learner Analytics</TabsTrigger>
            <TabsTrigger value="courses">Course Analytics</TabsTrigger>
          </TabsList>
          
          <AdminTabsContent />
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
