
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useAdminView } from "@/hooks/use-admin-view";

interface AdminRouteProps {
  children: React.ReactNode;
}

// Admin emails - in a real app, these would be stored in a database
const ADMIN_EMAILS = [
  "admin@flytbase.com",
  "admin2@flytbase.com",
  "bdteam@flytbase.com", // Added bdteam@flytbase.com as admin
];

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const { viewAsUser } = useAdminView();

  useEffect(() => {
    const checkAdminStatus = async () => {
      setCheckingAdmin(true);
      console.log("Checking admin status for user:", user?.email);
      
      if (!user) {
        console.log("No user found, not an admin");
        setIsAdmin(false);
        setCheckingAdmin(false);
        return;
      }

      // Check if user's email is in admin list
      const email = user.email?.toLowerCase();
      if (email && ADMIN_EMAILS.includes(email)) {
        console.log("User email is in admin list");
        setIsAdmin(true);
        setCheckingAdmin(false);
        return;
      }

      // Otherwise, check user metadata for admin role
      if (user.app_metadata && user.app_metadata.role === 'admin') {
        console.log("User has admin role in metadata");
        setIsAdmin(true);
        setCheckingAdmin(false);
        return;
      }

      console.log("User is not an admin");
      setIsAdmin(false);
      setCheckingAdmin(false);
    };

    if (user !== undefined) {
      checkAdminStatus();
    }
  }, [user]);

  if (isLoading || checkingAdmin) {
    return <div className="min-h-screen bg-flytbase-primary flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-flytbase-secondary"></div>
    </div>;
  }

  // Check if user is signed in
  if (!user) {
    console.log("Redirecting to sign-in - user not authenticated");
    return <Navigate to="/sign-in" replace />;
  }

  // Check if user has admin role 
  if (!isAdmin) {
    console.log("Redirecting to dashboard - user not an admin");
    return <Navigate to="/dashboard" replace />;
  }

  // If admin is viewing as user, redirect to dashboard
  if (viewAsUser) {
    console.log("Admin is viewing as user, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  console.log("User is admin, rendering admin content");
  return <>{children}</>;
};

export { AdminRoute as default, ADMIN_EMAILS };
