
import { Home, Brain, Database, Network, Settings, Users, BarChart3, FileText, Zap, Github, BookOpen } from 'lucide-react';

export const mainNavItems = [
  {
    path: '/',
    label: 'Home',
    icon: Home
  },
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: BarChart3
  },
  {
    path: '/prompt-studio',
    label: 'Prompt Studio',
    icon: Brain
  },
  {
    path: '/rag-hub',
    label: 'RAG 2.0 Hub',
    icon: Database
  },
  {
    path: '/mcp-center',
    label: 'MCP Center',
    icon: Network
  },
  {
    path: '/a2a-agents',
    label: 'A2A Agents',
    icon: Users
  },
  {
    path: '/analytics',
    label: 'Analytics',
    icon: BarChart3
  },
  {
    path: '/docs',
    label: 'Documentation',
    icon: BookOpen
  }
];

export const secondaryNavItems = [
  {
    path: '/projects',
    label: 'My Projects',
    icon: FileText
  },
  {
    path: '/templates',
    label: 'Templates',
    icon: Zap
  },
  {
    path: '/integrations',
    label: 'Integrations',
    icon: Github
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: Settings
  }
];
