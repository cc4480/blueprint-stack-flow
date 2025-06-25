
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Menu, X, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../Logo';

interface NavigationHeaderProps {
  isScrolled: boolean;
  isMobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
}

const NavigationHeader = ({ isScrolled, isMobileMenuOpen, onMobileMenuToggle }: NavigationHeaderProps) => {
  return (
    <div className="flex items-center justify-between h-16">
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-3">
        <Logo size="sm" />
      </Link>

      {/* User Actions */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" className="hidden md:flex text-white hover:text-blue-400 hover:bg-blue-400/10" asChild>
          <Link to="/auth">
            <Shield className="w-4 h-4 mr-2" />
            Sign In
          </Link>
        </Button>

        <Button size="sm" className="hidden md:flex bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600" asChild>
          <Link to="/get-started">
            Get Started
          </Link>
        </Button>

        {/* Mobile Menu Toggle */}
        <Button variant="ghost" size="sm" className="lg:hidden text-white" onClick={onMobileMenuToggle}>
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>
    </div>
  );
};

export default NavigationHeader;
