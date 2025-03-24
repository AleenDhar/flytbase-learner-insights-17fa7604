import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useAdminView } from "@/hooks/use-admin-view";
import { supabase } from "@/integrations/supabase/client";

interface AdminRouteProps {
  children: React.ReactNode;
}

// For backwards compatibility, keep the admin emails list 
// but we'll primarily use database roles
export const ADMIN_EMAILS = [
  "bdteam@flytbase.com", // Only bdteam@flytbase.com is an admin
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

      try {
        // First check the database for admin role
        const { data, error } = await supabase.rpc('is_admin', { uid: user.id });
        
        if (error) {
          console.error("Error checking admin status:", error);
          // Fall back to email list check if database check fails
          const email = user.email?.toLowerCase();
          const isAdminByEmail = email && ADMIN_EMAILS.includes(email);
          setIsAdmin(isAdminByEmail);
          setCheckingAdmin(false);
          return;
        }
        
        if (data) {
          console.log("User has admin role in database");
          setIsAdmin(true);
          setCheckingAdmin(false);
          return;
        }

        // If not in database, check legacy methods
        // Check if user's email is in admin list (legacy support)
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
      } catch (error) {
        console.error("Error in admin check:", error);
        setIsAdmin(false);
        setCheckingAdmin(false);
      }
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
