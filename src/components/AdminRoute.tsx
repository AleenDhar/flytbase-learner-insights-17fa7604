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
];

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      // Check if user's email is in admin list
      if (user.email && ADMIN_EMAILS.includes(user.email)) {
        setIsAdmin(true);
        return;
      }

      // Otherwise, check user metadata for admin role
      if (user.app_metadata && user.app_metadata.role === 'admin') {
        setIsAdmin(true);
        return;
      }

      setIsAdmin(false);
    };

    checkAdminStatus();
  }, [user]);

  if (isLoading || isAdmin === null) {
    return <div className="min-h-screen bg-flytbase-primary flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-flytbase-secondary"></div>
    </div>;
  }

  // Check if user is signed in and has admin role
  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
