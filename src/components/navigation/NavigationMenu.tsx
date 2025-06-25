
import { NavigationMenu as RadixNavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Brain, FileText, BarChart3, Database, Network, BookOpen } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavigationMenuProps {
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

const NavigationMenuComponent = ({ mainNavItems, secondaryNavItems }: NavigationMenuProps) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <RadixNavigationMenu>
      <NavigationMenuList>
        {/* Main Features */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-white hover:text-blue-400">
            <Brain className="w-4 h-4 mr-2" />
            Platform
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 w-[400px] lg:w-[500px] lg:grid-cols-2">
              {mainNavItems.slice(1, 5).map(item => (
                <NavigationMenuLink key={item.path} asChild>
                  <Link to={item.path} className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-400/10 hover:text-blue-400 focus:bg-blue-400/10 focus:text-blue-400 ${isActive(item.path) ? 'bg-blue-400/20 text-blue-400' : 'text-white'}`}>
                    <div className="flex items-center space-x-2">
                      <item.icon className="w-4 h-4" />
                      <div className="text-sm font-medium leading-none">{item.label}</div>
                    </div>
                    <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                      {item.path === '/dashboard' && 'Monitor your projects and performance'}
                      {item.path === '/prompt-studio' && 'Create and optimize AI prompts'}
                      {item.path === '/rag-hub' && 'Manage RAG 2.0 knowledge bases'}
                      {item.path === '/mcp-center' && 'Configure MCP protocols'}
                    </p>
                  </Link>
                </NavigationMenuLink>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Workspace */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-white hover:text-blue-400">
            <FileText className="w-4 h-4 mr-2" />
            Workspace
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 w-[300px]">
              {secondaryNavItems.slice(0, 3).map(item => (
                <NavigationMenuLink key={item.path} asChild>
                  <Link to={item.path} className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-400/10 hover:text-blue-400 focus:bg-blue-400/10 focus:text-blue-400 ${isActive(item.path) ? 'bg-blue-400/20 text-blue-400' : 'text-white'}`}>
                    <div className="flex items-center space-x-2">
                      <item.icon className="w-4 h-4" />
                      <div className="text-sm font-medium leading-none">{item.label}</div>
                    </div>
                  </Link>
                </NavigationMenuLink>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Direct Links */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to="/analytics" className={`text-sm font-medium px-4 py-2 rounded-md transition-colors hover:text-blue-400 ${isActive('/analytics') ? 'text-blue-400' : 'text-white'}`}>
              Analytics
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link to="/docs" className={`text-sm font-medium px-4 py-2 rounded-md transition-colors hover:text-blue-400 ${isActive('/docs') ? 'text-blue-400' : 'text-white'}`}>
              Docs
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </RadixNavigationMenu>
  );
};

export default NavigationMenuComponent;
