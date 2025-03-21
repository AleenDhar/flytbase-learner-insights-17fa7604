
import React, { useState } from 'react';
import { Menu, X, User, Book, FileText, HelpCircle, Settings, LogOut, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    if (isOpen) setIsOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="w-full bg-[#1A1F2C]/90 backdrop-blur-md shadow-sm fixed top-0 left-0 right-0 z-50 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-semibold text-white">FlytBase Academy</Link>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/courses" 
              className={cn(
                "inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-all duration-200",
                isActive("/courses") 
                  ? "text-white border-flytbase-secondary" 
                  : "text-neutral-300 hover:text-white border-transparent hover:border-white/20"
              )}
            >
              <Book className="mr-1 h-4 w-4" />
              Courses
            </Link>
            <Link 
              to="/assessments" 
              className={cn(
                "inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-all duration-200",
                isActive("/assessments") 
                  ? "text-white border-flytbase-secondary" 
                  : "text-neutral-300 hover:text-white border-transparent hover:border-white/20"
              )}
            >
              <FileText className="mr-1 h-4 w-4" />
              Assessments
            </Link>
            <a 
              href="#" 
              className="inline-flex items-center px-1 pt-1 text-sm font-medium text-neutral-300 hover:text-white border-b-2 border-transparent hover:border-white/20 transition-all duration-200"
            >
              <HelpCircle className="mr-1 h-4 w-4" />
              Documentation
            </a>
            
            {/* Profile Dropdown */}
            <div className="relative ml-3">
              <button
                onClick={toggleProfile}
                className="flex items-center text-sm font-medium text-neutral-300 hover:text-white focus:outline-none"
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-flytbase-secondary flex items-center justify-center text-white">
                  <User className="h-5 w-5" />
                </div>
              </button>
              
              {/* Profile Dropdown Panel */}
              {isProfileOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-[#1A1F2C] ring-1 ring-white/10 focus:outline-none animate-fade-in">
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-neutral-300 hover:bg-white/5 flex items-center"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Account Settings
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-neutral-300 hover:bg-white/5 flex items-center"
                  >
                    <Award className="mr-2 h-4 w-4" />
                    Certificates
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-neutral-300 hover:bg-white/5 flex items-center"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </a>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleProfile}
              className="mr-2 flex items-center justify-center rounded-full bg-flytbase-secondary p-1.5 text-white"
            >
              <span className="sr-only">Open user menu</span>
              <User className="h-5 w-5" />
            </button>
            
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white/90 hover:bg-white/5 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn("md:hidden", isOpen ? "block" : "hidden")}>
        <div className="pt-2 pb-3 space-y-1 animate-fade-in">
          <Link
            to="/courses"
            className={cn(
              "block pl-3 pr-4 py-2 border-l-4 text-base font-medium",
              isActive("/courses")
                ? "border-flytbase-secondary text-white bg-white/5"
                : "border-transparent text-neutral-300 hover:bg-white/5 hover:border-white/20 hover:text-white"
            )}
          >
            <span className="flex items-center">
              <Book className="mr-2 h-5 w-5" />
              Courses
            </span>
          </Link>
          <Link
            to="/assessments"
            className={cn(
              "block pl-3 pr-4 py-2 border-l-4 text-base font-medium",
              isActive("/assessments")
                ? "border-flytbase-secondary text-white bg-white/5"
                : "border-transparent text-neutral-300 hover:bg-white/5 hover:border-white/20 hover:text-white"
            )}
          >
            <span className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Assessments
            </span>
          </Link>
          <a
            href="#"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-neutral-300 hover:bg-white/5 hover:border-white/20 hover:text-white"
          >
            <span className="flex items-center">
              <HelpCircle className="mr-2 h-5 w-5" />
              Documentation
            </span>
          </a>
        </div>
      </div>
      
      {/* Mobile Profile Menu */}
      {isProfileOpen && (
        <div className="md:hidden border-t border-white/10 pt-4 pb-3 animate-fade-in">
          <div className="flex items-center px-4">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-flytbase-secondary flex items-center justify-center text-white">
                <User className="h-6 w-6" />
              </div>
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-white">John Doe</div>
              <div className="text-sm font-medium text-neutral-400">john.doe@example.com</div>
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <a
              href="#"
              className="block px-4 py-2 text-base font-medium text-neutral-300 hover:bg-white/5 flex items-center"
            >
              <Settings className="mr-2 h-5 w-5" />
              Account Settings
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-base font-medium text-neutral-300 hover:bg-white/5 flex items-center"
            >
              <Award className="mr-2 h-5 w-5" />
              Certificates
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-base font-medium text-neutral-300 hover:bg-white/5 flex items-center"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
