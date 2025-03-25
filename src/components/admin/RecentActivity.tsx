
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RecentActivity = () => {
  return (
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
  );
};

export default RecentActivity;
