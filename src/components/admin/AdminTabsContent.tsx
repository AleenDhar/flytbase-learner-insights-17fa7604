
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import MetricsOverview from "./MetricsOverview";
import RecentActivity from "./RecentActivity";
import LearnerAnalytics from "./LearnerAnalytics";
import CourseAnalytics from "./CourseAnalytics";

const AdminTabsContent = () => {
  return (
    <>
      <TabsContent value="overview" className="animate-fade-in space-y-4">
        <MetricsOverview />
        <RecentActivity />
      </TabsContent>
      
      <TabsContent value="users" className="animate-fade-in">
        <LearnerAnalytics />
      </TabsContent>
      
      <TabsContent value="courses" className="animate-fade-in">
        <CourseAnalytics />
      </TabsContent>
    </>
  );
};

export default AdminTabsContent;
