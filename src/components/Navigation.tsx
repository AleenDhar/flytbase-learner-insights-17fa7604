
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown } from 'lucide-react';
import { SignedIn, SignedOut, UserButton, useUser, useAuth } from '@clerk/clerk-react';

const Navigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isSignedIn, user } = useUser();
  const { has } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Get admin status
  const isAdmin = 
    isSignedIn && 
    (["admin@flytbase.com", "admin2@flytbase.com"].includes(user?.primaryEmailAddress?.emailAddress as string) || 
    has({ role: "admin" }));

  // Define navigation items
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: 'Assessments', path: '/assessments' },
  ];

  // Add dashboard link for signed-in users
  if (isSignedIn) {
    navItems.push({ name: 'Dashboard', path: '/dashboard' });
    
    // Add admin dashboard link for admin users
    if (isAdmin) {
      navItems.push({ name: 'Admin', path: '/admin' });
    }
  }

  return (
    <nav className="bg-flytbase-primary border-b border-white/10 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-white">FlytBase Academy</span>
              </Link>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === item.path
                        ? 'text-white bg-[#1A1F2C]'
                        : 'text-neutral-300 hover:text-white hover:bg-[#1A1F2C]/50'
                    } transition-colors duration-200`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <SignedIn>
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-9 h-9",
                    userButtonBox: "focus:shadow-none"
                  }
                }}
                afterSignOutUrl="/"
              />
            </SignedIn>
            <SignedOut>
              <Link to="/sign-in">
                <Button variant="ghost" className="text-neutral-300 hover:text-white">
                  Sign In
                </Button>
              </Link>
              <Link to="/sign-up">
                <Button className="bg-flytbase-secondary hover:bg-flytbase-secondary/90">
                  Sign Up
                </Button>
              </Link>
            </SignedOut>
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-300 hover:text-white hover:bg-[#1A1F2C]/50 transition-colors duration-200"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#1A1F2C]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.path
                    ? 'text-white bg-[#2A3249]'
                    : 'text-neutral-300 hover:text-white hover:bg-[#2A3249]/50'
                } transition-colors duration-200`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-white/10">
            <div className="space-y-2 px-2">
              <SignedIn>
                <div className="flex items-center px-3 py-2">
                  <div className="mr-3">
                    <UserButton 
                      appearance={{
                        elements: {
                          userButtonAvatarBox: "w-9 h-9",
                          userButtonBox: "focus:shadow-none"
                        }
                      }}
                      afterSignOutUrl="/"
                    />
                  </div>
                  <div>
                    <div className="text-base font-medium text-white">
                      {user?.fullName || "User"}
                    </div>
                    <div className="text-sm text-neutral-400">
                      {user?.primaryEmailAddress?.emailAddress}
                    </div>
                  </div>
                </div>
              </SignedIn>
              <SignedOut>
                <Link to="/sign-in" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-neutral-300 hover:text-white">
                    Sign In
                  </Button>
                </Link>
                <Link to="/sign-up" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full justify-start bg-flytbase-secondary hover:bg-flytbase-secondary/90">
                    Sign Up
                  </Button>
                </Link>
              </SignedOut>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
