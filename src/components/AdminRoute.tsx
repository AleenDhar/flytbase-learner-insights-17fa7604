
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

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
  const [viewAsUser, setViewAsUser] = useState(() => {
    // Get saved preference from localStorage
    const saved = localStorage.getItem("admin-view-as-user");
    return saved === "true";
  });

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
      if (user.email && ADMIN_EMAILS.includes(user.email)) {
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

  // Save view preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("admin-view-as-user", viewAsUser ? "true" : "false");
  }, [viewAsUser]);

  // Export the toggle function using a context
  if (isAdmin && !viewAsUser === false) {
    window.sessionStorage.setItem("adminViewingAsUser", "true");
  } else {
    window.sessionStorage.removeItem("adminViewingAsUser");
  }

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

  // Check if user has admin role and if they want to view as admin
  if (!isAdmin || viewAsUser) {
    console.log("Redirecting to dashboard - user not an admin or viewing as regular user");
    return <Navigate to="/dashboard" replace />;
  }

  console.log("User is admin, rendering admin content");
  return <>{children}</>;
};

export { AdminRoute as default, ADMIN_EMAILS };
