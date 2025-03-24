
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ADMIN_EMAILS } from '@/components/AdminRoute';

export const useAdminCheck = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      setLoading(true);
      
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        // Check database first for admin role
        const { data, error } = await supabase.rpc('is_admin', { uid: user.id });
        
        if (error) {
          console.error("Error checking admin status:", error);
          // Fall back to email check
          const isAdminByEmail = user.email && 
                               ADMIN_EMAILS.map(email => email.toLowerCase()).includes(user.email.toLowerCase());
          setIsAdmin(isAdminByEmail);
          setLoading(false);
          return;
        }
        
        if (data) {
          setIsAdmin(true);
          setLoading(false);
          return;
        }
        
        // If not in database, check legacy methods
        const isAdminByEmail = user.email && 
                             ADMIN_EMAILS.map(email => email.toLowerCase()).includes(user.email.toLowerCase());
        const isAdminByMetadata = user.app_metadata && user.app_metadata.role === 'admin';
        
        setIsAdmin(isAdminByEmail || isAdminByMetadata);
      } catch (error) {
        console.error("Error in admin check:", error);
        
        // Fall back to email check
        const isAdminByEmail = user.email && 
                             ADMIN_EMAILS.map(email => email.toLowerCase()).includes(user.email.toLowerCase());
        setIsAdmin(isAdminByEmail);
      } finally {
        setLoading(false);
      }
    };
    
    checkAdminStatus();
  }, [user]);

  return { isAdmin, loading };
};
