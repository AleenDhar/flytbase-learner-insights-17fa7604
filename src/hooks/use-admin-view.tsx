
import { useState, useEffect } from 'react';

export function useAdminView() {
  const [viewAsUser, setViewAsUser] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("admin-view-as-user");
      return saved === "true";
    } catch (e) {
      console.error("Error reading from localStorage:", e);
      return false;
    }
  });
  
  useEffect(() => {
    try {
      // Ensure localStorage is updated when viewAsUser changes
      localStorage.setItem("admin-view-as-user", viewAsUser ? "true" : "false");
      console.log("Admin view preference updated:", viewAsUser ? "viewing as user" : "viewing as admin");
    } catch (e) {
      console.error("Error writing to localStorage:", e);
    }
  }, [viewAsUser]);
  
  const toggleView = () => {
    const newValue = !viewAsUser;
    setViewAsUser(newValue);
    
    // Reload or redirect based on new view
    if (newValue) {
      // If switching to user view, go to dashboard
      window.location.href = '/dashboard';
    } else {
      // If switching to admin view, go to admin dashboard
      window.location.href = '/admin';
    }
  };
  
  const isAdminViewingAsUser = () => {
    return viewAsUser;
  };
  
  return { viewAsUser, toggleView, isAdminViewingAsUser };
}
