
import { useState, useEffect } from 'react';

export function useAdminView() {
  const [viewAsUser, setViewAsUser] = useState(() => {
    const saved = localStorage.getItem("admin-view-as-user");
    return saved === "true";
  });
  
  useEffect(() => {
    // Ensure localStorage is updated when viewAsUser changes
    localStorage.setItem("admin-view-as-user", viewAsUser ? "true" : "false");
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
