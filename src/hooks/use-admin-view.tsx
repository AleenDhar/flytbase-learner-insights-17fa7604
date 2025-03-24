
import { useState, useEffect } from 'react';

export function useAdminView() {
  const [viewAsUser, setViewAsUser] = useState(() => {
    const saved = localStorage.getItem("admin-view-as-user");
    return saved === "true";
  });
  
  const toggleView = () => {
    const newValue = !viewAsUser;
    setViewAsUser(newValue);
    localStorage.setItem("admin-view-as-user", newValue ? "true" : "false");
    
    // Reload or redirect based on new view
    if (newValue) {
      // If switching to user view, go to dashboard
      window.location.href = '/dashboard';
    } else {
      // If switching to admin view, go to admin dashboard
      window.location.href = '/admin';
    }
  };
  
  return { viewAsUser, toggleView, isAdminViewingAsUser: () => window.sessionStorage.getItem("adminViewingAsUser") === "true" };
}
