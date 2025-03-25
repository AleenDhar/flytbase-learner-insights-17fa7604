
import React from "react";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/context/AuthContext";
import AdminHeader from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import CreateCourseForm from "@/components/admin/CreateCourseForm";

const AdminCreateCourse = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = React.useState("month");

  return (
    <div className="min-h-screen bg-flytbase-primary">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <Link to="/admin">
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold text-neutral-100">Create New Course</h1>
          <p className="text-neutral-400 mt-1">
            Add a new course by providing a YouTube playlist URL
          </p>
        </div>
        
        <div className="max-w-2xl">
          <CreateCourseForm />
        </div>
      </main>
    </div>
  );
};

export default AdminCreateCourse;
