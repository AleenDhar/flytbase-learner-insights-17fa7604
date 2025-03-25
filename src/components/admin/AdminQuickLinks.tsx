
import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, MessageSquare, BookOpen, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";

const AdminQuickLinks = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card className="bg-[#1A1F2C] border-white/5 text-white hover-lift transition-all">
        <Link to="/admin/testimonials" className="block p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="rounded-full bg-flytbase-secondary/20 p-3 inline-flex text-flytbase-secondary">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold ml-3">Testimonials</h3>
            </div>
            <ArrowUpRight className="h-5 w-5 text-neutral-400" />
          </div>
          <p className="text-neutral-400 mt-2">Manage student testimonials</p>
        </Link>
      </Card>
      
      <Card className="bg-[#1A1F2C] border-white/5 text-white hover-lift transition-all">
        <Link to="/admin/create-course" className="block p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="rounded-full bg-green-500/20 p-3 inline-flex text-green-500">
                <Plus className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold ml-3">Create Course</h3>
            </div>
            <ArrowUpRight className="h-5 w-5 text-neutral-400" />
          </div>
          <p className="text-neutral-400 mt-2">Add new course from YouTube playlist</p>
        </Link>
      </Card>
      
      <Card className="bg-[#1A1F2C] border-white/5 text-white hover-lift transition-all">
        <Link to="/admin/courses" className="block p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="rounded-full bg-blue-500/20 p-3 inline-flex text-blue-500">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold ml-3">Courses</h3>
            </div>
            <ArrowUpRight className="h-5 w-5 text-neutral-400" />
          </div>
          <p className="text-neutral-400 mt-2">Manage existing courses</p>
        </Link>
      </Card>
    </div>
  );
};

export default AdminQuickLinks;
