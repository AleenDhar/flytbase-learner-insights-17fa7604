
import React from 'react';
import { SignIn as ClerkSignIn } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

const SignIn = () => {
  const { isSignedIn } = useUser();
  
  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="min-h-screen bg-flytbase-primary flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#1A1F2C] p-6 rounded-lg shadow-lg border border-white/10">
        <h1 className="text-2xl font-bold text-white text-center mb-6">Sign In to FlytBase Academy</h1>
        <ClerkSignIn 
          appearance={{
            elements: {
              rootBox: "mx-auto w-full",
              card: "bg-transparent shadow-none",
              formButtonPrimary: "bg-flytbase-secondary hover:bg-flytbase-secondary/90 text-white",
              formFieldInput: "bg-[#2A3249] border-white/10 text-white",
              formFieldLabel: "text-white",
              dividerLine: "bg-white/10",
              dividerText: "text-white/50",
              socialButtonsBlockButton: "border-white/10 text-white hover:bg-[#2A3249]",
              footerActionLink: "text-flytbase-secondary hover:text-flytbase-secondary/90"
            }
          }}
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          redirectUrl="/dashboard"
        />
      </div>
    </div>
  );
};

export default SignIn;
