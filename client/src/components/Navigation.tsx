import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';
import { Home, Brain, Database, Network, Settings, Users, BarChart3, FileText, Zap, Github, BookOpen, Shield, Menu, X, Code } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-out ${
      isScrolled 
        ? 'bg-black/95 backdrop-blur-xl border-b border-blue-400/30 shadow-lg shadow-blue-500/10' 
        : 'bg-gradient-to-b from-black/60 via-black/40 to-transparent backdrop-blur-sm border-b border-transparent'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-300">
            <Logo size="md" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <NavigationMenu>
              <NavigationMenuList>
                {/* Main Features */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-white/90 hover:text-blue-400 font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:bg-blue-400/10">
                    <Brain className="w-4 h-4 mr-2" />
                    Platform
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[400px] lg:w-[500px] lg:grid-cols-2 bg-black/95 backdrop-blur-xl border border-blue-400/30 rounded-xl shadow-2xl shadow-blue-500/20">
                      {mainNavItems.slice(1, 5).map(item => (
                        <NavigationMenuLink key={item.path} asChild>
                          <Link to={item.path} className={`block select-none space-y-1 rounded-lg p-4 leading-none no-underline outline-none transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 hover:text-blue-400 focus:bg-blue-400/10 focus:text-blue-400 border border-transparent hover:border-blue-400/30 ${isActive(item.path) ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-blue-400 border-blue-400/50' : 'text-white/90'}`}>
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
                  <NavigationMenuTrigger className="text-white/90 hover:text-blue-400 font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:bg-blue-400/10">
                    <FileText className="w-4 h-4 mr-2" />
                    Workspace
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[300px] bg-black/95 backdrop-blur-xl border border-blue-400/30 rounded-xl shadow-2xl shadow-blue-500/20">
                      {secondaryNavItems.slice(0, 3).map(item => (
                        <NavigationMenuLink key={item.path} asChild>
                          <Link to={item.path} className={`block select-none space-y-1 rounded-lg p-4 leading-none no-underline outline-none transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 hover:text-blue-400 focus:bg-blue-400/10 focus:text-blue-400 border border-transparent hover:border-blue-400/30 ${isActive(item.path) ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-blue-400 border-blue-400/50' : 'text-white/90'}`}>
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
                    <Link to="/analytics" className={`text-sm font-medium px-5 py-2.5 rounded-lg transition-all duration-300 hover:bg-blue-400/10 hover:text-blue-400 border border-transparent hover:border-blue-400/30 ${isActive('/analytics') ? 'text-blue-400 bg-blue-400/20 border-blue-400/50' : 'text-white/90'}`}>
                      Analytics
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-white/90 hover:text-blue-400 font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:bg-blue-400/10">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Learn
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[300px] bg-black/95 backdrop-blur-xl border border-blue-400/30 rounded-xl shadow-2xl shadow-blue-500/20">
                      <NavigationMenuLink asChild>
                        <Link to="/docs" className={`block select-none space-y-1 rounded-lg p-4 leading-none no-underline outline-none transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 hover:text-blue-400 focus:bg-blue-400/10 focus:text-blue-400 border border-transparent hover:border-blue-400/30 ${isActive('/docs') ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-blue-400 border-blue-400/50' : 'text-white/90'}`}>
                          <div className="flex items-center space-x-2">
                            <BookOpen className="w-4 h-4" />
                            <div className="text-sm font-medium leading-none">Documentation</div>
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                            Framework guides and API references
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link to="/tutorials" className={`block select-none space-y-1 rounded-lg p-4 leading-none no-underline outline-none transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 hover:text-blue-400 focus:bg-blue-400/10 focus:text-blue-400 border border-transparent hover:border-blue-400/30 ${isActive('/tutorials') ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-blue-400 border-blue-400/50' : 'text-white/90'}`}>
                          <div className="flex items-center space-x-2">
                            <Code className="w-4 h-4" />
                            <div className="text-sm font-medium leading-none">Interactive Tutorials</div>
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                            Hands-on coding tutorials and challenges
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="hidden md:flex text-white/90 hover:text-blue-400 hover:bg-blue-400/10 border border-transparent hover:border-blue-400/30 rounded-lg px-4 py-2 transition-all duration-300" asChild>
              <Link to="/auth">
                <Shield className="w-4 h-4 mr-2" />
                Sign In
              </Link>
            </Button>

            <Button size="sm" className="hidden md:flex bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 hover:from-blue-600 hover:via-purple-600 hover:to-blue-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 border border-blue-400/30 transition-all duration-300 hover:scale-105" asChild>
              <Link to="/get-started">
                Get Started
              </Link>
            </Button>

            {/* Mobile Menu Toggle */}
            <Button variant="ghost" size="sm" className="lg:hidden text-white/90 hover:text-blue-400 hover:bg-blue-400/10 border border-transparent hover:border-blue-400/30 rounded-lg transition-all duration-300" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-6 border-t border-blue-400/30 bg-black/60 backdrop-blur-md">
            <div className="space-y-3">
              {[...mainNavItems, ...secondaryNavItems].map(item => (
                <Link key={item.path} to={item.path} className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 border border-transparent hover:border-blue-400/30 ${isActive(item.path) ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 text-blue-400 border-blue-400/50' : 'text-white/90 hover:bg-blue-400/10 hover:text-blue-400'}`} onClick={() => setIsMobileMenuOpen(false)}>
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile Action Buttons */}
              <div className="pt-4 space-y-3 border-t border-blue-400/20">
                <Link to="/auth" className="flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium text-white/90 hover:text-blue-400 hover:bg-blue-400/10 border border-transparent hover:border-blue-400/30 transition-all duration-300" onClick={() => setIsMobileMenuOpen(false)}>
                  <Shield className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
                <Link to="/get-started" className="flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg shadow-blue-500/25 transition-all duration-300" onClick={() => setIsMobileMenuOpen(false)}>
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
