
import { useState, useEffect } from 'react';
import NavigationHeader from './navigation/NavigationHeader';
import NavigationMenuComponent from './navigation/NavigationMenu';
import MobileMenu from './navigation/MobileMenu';
import { mainNavItems, secondaryNavItems } from './navigation/navigationData';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
      isScrolled 
        ? 'bg-black/95 backdrop-blur-md border-blue-400/30' 
        : 'bg-transparent border-transparent'
    }`}>
      <div className="container mx-auto px-6">
        <NavigationHeader 
          isScrolled={isScrolled}
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuToggle={handleMobileMenuToggle}
        />

        {/* Desktop Navigation */}
        <div className="hidden lg:block">
          <NavigationMenuComponent 
            mainNavItems={mainNavItems}
            secondaryNavItems={secondaryNavItems}
          />
        </div>

        {/* Mobile Menu */}
        <MobileMenu 
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          mainNavItems={mainNavItems}
          secondaryNavItems={secondaryNavItems}
        />
      </div>
    </nav>
  );
};

export default Navigation;
