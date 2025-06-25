
import { Link, useLocation } from 'react-router-dom';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  mainNavItems: Array<{
    path: string;
    label: string;
    icon: any;
  }>;
  secondaryNavItems: Array<{
    path: string;
    label: string;
    icon: any;
  }>;
}

const MobileMenu = ({ isOpen, onClose, mainNavItems, secondaryNavItems }: MobileMenuProps) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  if (!isOpen) return null;

  return (
    <div className="lg:hidden py-4 border-t border-blue-400/30">
      <div className="space-y-2">
        {[...mainNavItems, ...secondaryNavItems].map(item => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive(item.path) 
                ? 'bg-blue-400/20 text-blue-400' 
                : 'text-white hover:bg-blue-400/10 hover:text-blue-400'
            }`} 
            onClick={onClose}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileMenu;
