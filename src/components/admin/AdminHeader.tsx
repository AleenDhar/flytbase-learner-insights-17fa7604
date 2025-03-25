
import React from "react";
import { UserCog } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useAdminView } from "@/hooks/use-admin-view";

interface AdminHeaderProps {
  user: any;
  timeRange: string;
  setTimeRange: (range: string) => void;
}

const AdminHeader = ({ user, timeRange, setTimeRange }: AdminHeaderProps) => {
  const { toggleView } = useAdminView();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold text-neutral-100">Admin Dashboard</h1>
        <p className="text-neutral-400 mt-1">
          Welcome, {user?.email?.split('@')[0] || "Admin"}! Manage your academy and view learner analytics.
        </p>
      </div>
      <div className="flex items-center gap-4">
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

        {/* Admin/User View Toggle */}
        <div className="flex items-center gap-2 bg-[#1A1F2C] rounded-md p-2 border border-white/5">
          <UserCog className="h-4 w-4 text-neutral-400" />
          <span className="text-sm text-neutral-400 mr-1">Admin View</span>
          <Switch 
            onCheckedChange={toggleView} 
            id="user-view-toggle"
          />
          <span className="text-sm text-neutral-400">User View</span>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
