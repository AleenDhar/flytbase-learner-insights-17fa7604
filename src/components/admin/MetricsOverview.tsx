
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const MetricsOverview = () => {
  return (
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
  );
};

export default MetricsOverview;
