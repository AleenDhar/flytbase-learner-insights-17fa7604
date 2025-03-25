
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import AdminRoute from "@/components/AdminRoute";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import Index from "@/pages/Index";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/Dashboard";
import Courses from "@/pages/Courses";
import CourseDetail from "@/pages/CourseDetail";
import Assessments from "@/pages/Assessments";
import AssessmentDetail from "@/pages/AssessmentDetail";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminTestimonials from "@/pages/AdminTestimonials";
import AdminCreateCourse from "@/pages/AdminCreateCourse";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <Courses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/courses/:courseId"
          element={
            <ProtectedRoute>
              <CourseDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assessments"
          element={
            <ProtectedRoute>
              <Assessments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/assessments/:assessmentId"
          element={
            <ProtectedRoute>
              <AssessmentDetail />
            </ProtectedRoute>
          }
        />
        
        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/testimonials"
          element={
            <AdminRoute>
              <AdminTestimonials />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/create-course"
          element={
            <AdminRoute>
              <AdminCreateCourse />
            </AdminRoute>
          }
        />
        
        {/* Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
