
import React from "react";
import { Navigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";

interface AdminRouteProps {
  children: React.ReactNode;
}

// Admin emails - in a real app, these would be stored in a database
const ADMIN_EMAILS = [
  "admin@flytbase.com",
  "admin2@flytbase.com",
];

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { isSignedIn, isLoaded, user } = useUser();
  const { has } = useAuth();

  if (!isLoaded) {
    return <div className="min-h-screen bg-flytbase-primary flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-flytbase-secondary"></div>
    </div>;
  }

  // Check if user is signed in and has admin role
  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  // Check if user's email is in admin list or if they have admin role in metadata
  const isAdmin = ADMIN_EMAILS.includes(user?.primaryEmailAddress?.emailAddress as string) || 
                 has({ role: "admin" });

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
