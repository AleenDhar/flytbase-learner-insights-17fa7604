
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 px-4">
      <div className="card max-w-md w-full p-8 text-center shadow-clean animate-scale-in">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-flytbase-light text-flytbase-primary rounded-full mb-6 mx-auto">
          <span className="text-2xl font-bold">404</span>
        </div>
        <h1 className="text-2xl font-bold text-neutral-800 mb-3">Page Not Found</h1>
        <p className="text-neutral-600 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <a 
          href="/" 
          className="inline-flex items-center justify-center btn-primary w-full"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Return to Dashboard
        </a>
      </div>
    </div>
  );
};

export default NotFound;
