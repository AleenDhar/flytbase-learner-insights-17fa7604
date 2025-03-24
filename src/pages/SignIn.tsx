import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import BrandLogo from '@/components/BrandLogo';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { ADMIN_EMAILS } from '@/components/AdminRoute';

const SignIn = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Redirect to dashboard if already signed in
  if (!isLoading && user) {
    // Check if user is admin based on email (temporary fallback)
    const isAdminByEmail = user.email && 
                   ADMIN_EMAILS.map(email => email.toLowerCase()).includes(user.email.toLowerCase());
    
    // Get admin view preference
    let viewAsUser = false;
    try {
      viewAsUser = localStorage.getItem("admin-view-as-user") === "true";
    } catch (e) {
      console.error("Error reading from localStorage:", e);
    }
    
    console.log("User is authenticated:", user.email);
    
    // Check if user has admin role in database
    const checkAdminRole = async () => {
      try {
        const { data: isAdmin, error } = await supabase.rpc('is_admin', { uid: user.id });
        
        if (error) {
          console.error("Error checking admin role:", error);
          // Fall back to email check
          redirectUser(isAdminByEmail, viewAsUser);
          return;
        }
        
        console.log("Is admin (from database):", isAdmin);
        redirectUser(isAdmin, viewAsUser);
      } catch (error) {
        console.error("Error in admin check:", error);
        // Fall back to email check
        redirectUser(isAdminByEmail, viewAsUser);
      }
    };
    
    // Check admin role immediately
    checkAdminRole();
    
    // While checking, show loading spinner
    return <div className="min-h-screen bg-flytbase-primary flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-flytbase-secondary"></div>
    </div>;
  }
  
  // Helper function to redirect user based on admin status
  const redirectUser = (isAdmin: boolean, viewAsUser: boolean) => {
    // If user is admin and not viewing as user, go to admin dashboard
    if (isAdmin && !viewAsUser) {
      console.log("Redirecting to admin dashboard");
      navigate('/admin', { replace: true });
      return;
    }
    
    // Otherwise go to regular dashboard
    console.log("Redirecting to user dashboard");
    navigate('/dashboard', { replace: true });
  };
  
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      console.log("Sign in successful for:", data.user?.email);
      
      // Check if user is admin based on email (temporary fallback)
      const isAdminByEmail = data.user?.email && 
                    ADMIN_EMAILS.map(email => email.toLowerCase()).includes(data.user.email.toLowerCase());
      
      // Get admin view preference
      let viewAsUser = false;
      try {
        viewAsUser = localStorage.getItem("admin-view-as-user") === "true";
      } catch (e) {
        console.error("Error reading from localStorage:", e);
      }
      
      // Set a default value for admin view if not set yet
      if (isAdminByEmail && localStorage.getItem("admin-view-as-user") === null) {
        localStorage.setItem("admin-view-as-user", "false");
      }
      
      // Check admin role in database
      try {
        const { data: isAdmin, error } = await supabase.rpc('is_admin', { uid: data.user.id });
        
        if (error) {
          console.error("Error checking admin role:", error);
          // Fall back to email check
          redirectAfterSignIn(isAdminByEmail, viewAsUser);
          return;
        }
        
        console.log("Is admin (from database):", isAdmin);
        redirectAfterSignIn(isAdmin, viewAsUser);
      } catch (error) {
        console.error("Error in admin check:", error);
        // Fall back to email check
        redirectAfterSignIn(isAdminByEmail, viewAsUser);
      }
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "An error occurred during sign in",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Helper function for redirecting after sign in
  const redirectAfterSignIn = (isAdmin: boolean, viewAsUser: boolean) => {
    if (isAdmin && !viewAsUser) {
      console.log("Navigating to admin dashboard");
      navigate('/admin');
    } else {
      console.log("Navigating to user dashboard");
      navigate('/dashboard');
    }
  };

  const handleSocialSignIn = async (provider: 'google') => {
    try {
      setIsSubmitting(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "An error occurred during sign in",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-flytbase-primary flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-[#1A1F2C] border-white/10">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <BrandLogo className="h-10" />
          </div>
          <CardDescription className="text-white/50">Continue your learning journey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Sign In Form */}
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-white">Email</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="bg-[#2A3249] border-white/10 text-white"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-white">Password</label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-[#2A3249] border-white/10 text-white"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-flytbase-secondary hover:bg-flytbase-secondary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#1A1F2C] px-2 text-white/50">Or continue with</span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <Button 
            variant="outline" 
            className="w-full text-white border-white/10 hover:bg-[#2A3249]"
            onClick={() => handleSocialSignIn('google')}
            disabled={isSubmitting}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className="mr-2">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 items-center">
          <p className="text-sm text-white/50">
            Don't have an account?{' '}
            <a href="/sign-up" className="text-flytbase-secondary hover:text-flytbase-secondary/90">
              Sign up
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignIn;
