import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Home, Brain, Database, Network, Settings, Users, BarChart3, FileText, Zap, Github, BookOpen, Shield, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const mainNavItems = [{
    path: '/',
    label: 'Home',
    icon: Home
  }, {
    path: '/dashboard',
    label: 'Dashboard',
    icon: BarChart3
  }, {
    path: '/prompt-studio',
    label: 'Prompt Studio',
    icon: Brain
  }, {
    path: '/rag-hub',
    label: 'RAG 2.0 Hub',
    icon: Database
  }, {
    path: '/mcp-center',
    label: 'MCP Center',
    icon: Network
  }, {
    path: '/a2a-agents',
    label: 'A2A Agents',
    icon: Users
  }, {
    path: '/analytics',
    label: 'Analytics',
    icon: BarChart3
  }, {
    path: '/docs',
    label: 'Documentation',
    icon: BookOpen
  }];
  const secondaryNavItems = [{
    path: '/projects',
    label: 'My Projects',
    icon: FileText
  }, {
    path: '/templates',
    label: 'Templates',
    icon: Zap
  }, {
    path: '/integrations',
    label: 'Integrations',
    icon: Github
  }, {
    path: '/settings',
    label: 'Settings',
    icon: Settings
  }];
  return <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-blue-400/30">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <Logo size="sm" />
            
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <NavigationMenu>
              <NavigationMenuList>
                {/* Main Features */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-white hover:text-blue-400">
                    <Brain className="w-4 h-4 mr-2" />
                    Platform
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[400px] lg:w-[500px] lg:grid-cols-2">
                      {mainNavItems.slice(1, 5).map(item => <NavigationMenuLink key={item.path} asChild>
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
                        </NavigationMenuLink>)}
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
                      {secondaryNavItems.slice(0, 3).map(item => <NavigationMenuLink key={item.path} asChild>
                          <Link to={item.path} className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-blue-400/10 hover:text-blue-400 focus:bg-blue-400/10 focus:text-blue-400 ${isActive(item.path) ? 'bg-blue-400/20 text-blue-400' : 'text-white'}`}>
                            <div className="flex items-center space-x-2">
                              <item.icon className="w-4 h-4" />
                              <div className="text-sm font-medium leading-none">{item.label}</div>
                            </div>
                          </Link>
                        </NavigationMenuLink>)}
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
            </NavigationMenu>
          </div>

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
            <Button variant="ghost" size="sm" className="lg:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && <div className="lg:hidden py-4 border-t border-blue-400/30">
            <div className="space-y-2">
              {[...mainNavItems, ...secondaryNavItems].map(item => <Link key={item.path} to={item.path} className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(item.path) ? 'bg-blue-400/20 text-blue-400' : 'text-white hover:bg-blue-400/10 hover:text-blue-400'}`} onClick={() => setIsMobileMenuOpen(false)}>
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>)}
            </div>
          </div>}
      </div>
    </nav>;
};
export default Navigation;