
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  BookOpen, 
  Code, 
  PlayCircle, 
  CheckCircle, 
  Lock, 
  Clock,
  Users,
  Target,
  Lightbulb,
  FileText,
  Video,
  Download,
  Copy,
  ExternalLink,
  ChevronRight,
  Star,
  Trophy,
  Zap,
  Rocket,
  Brain,
  Heart,
  Globe,
  Database,
  Server,
  Layout,
  Palette,
  Shield,
  Monitor,
  Smartphone,
  Cloud,
  GitBranch,
  Search,
  Settings,
  BarChart3,
  MessageSquare,
  Camera,
  Mic
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  modules: number;
  prerequisites: string[];
  learningOutcomes: string[];
  technologies: string[];
  color: string;
  icon: any;
  isUnlocked: boolean;
  progress: number;
  modules_list: Module[];
}

interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  type: 'theory' | 'coding' | 'project' | 'quiz';
  isCompleted: boolean;
  content: string;
  codeExample?: string;
  exercise?: string;
  solution?: string;
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  category: string;
  preview: string;
  features: string[];
  steps: TutorialStep[];
  finalCode: string;
}

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  code: string;
  explanation: string;
  tips: string[];
}

const learningPaths: LearningPath[] = [
  {
    id: 'lovable-fundamentals',
    title: 'Lovable Platform Fundamentals',
    description: 'Master the complete Lovable development environment and understand how to build production-ready applications with the fixed technology stack.',
    difficulty: 'Beginner',
    duration: '4-6 hours',
    modules: 8,
    prerequisites: [],
    learningOutcomes: [
      'Understand Lovable\'s fixed technology stack (React 18, Tailwind CSS, Vite, Shadcn/UI, Supabase)',
      'Learn how to prompt effectively for Lovable applications',
      'Master the vibe coding approach and conversational development',
      'Understand how integrations work (Stripe, Resend, Clerk, Replicate)',
      'Build complete applications using Lovable\'s no-code approach'
    ],
    technologies: ['Lovable Platform', 'React 18', 'TypeScript', 'Tailwind CSS', 'Vite', 'Shadcn/UI'],
    color: 'purple',
    icon: Heart,
    isUnlocked: true,
    progress: 0,
    modules_list: [
      {
        id: 'intro-lovable',
        title: 'Introduction to Lovable',
        description: 'Learn what makes Lovable unique and how it revolutionizes app development',
        duration: '30 mins',
        type: 'theory',
        isCompleted: false,
        content: `# Welcome to Lovable

Lovable is a revolutionary no-code platform that uses AI to build production-ready applications. Unlike traditional development, Lovable uses a fixed, optimized technology stack that ensures consistency, reliability, and scalability.

## What makes Lovable special?

1. **Fixed Technology Stack**: No decisions needed - everything is pre-configured
2. **AI-Powered Development**: Build apps through conversation
3. **Production Ready**: Deploy immediately with confidence
4. **Modern Technologies**: Latest React, TypeScript, and cloud services

## The Lovable Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS + Vite + Shadcn/UI
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Realtime + Edge Functions)
- **Integrations**: Stripe + Resend + Clerk + Replicate + GitHub
- **Deployment**: Vercel/Netlify with custom domains

This fixed stack eliminates choice paralysis and ensures every app is built with modern, battle-tested technologies.`
      },
      {
        id: 'react-fundamentals',
        title: 'React 18 in Lovable',
        description: 'Understand how React 18 powers Lovable applications',
        duration: '45 mins',
        type: 'coding',
        isCompleted: false,
        content: `# React 18 in Lovable Applications

React 18 is the foundation of every Lovable app. Let's understand the key concepts you'll encounter.

## Component Structure

Every Lovable app is built with functional components using modern React patterns.`,
        codeExample: `import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function WelcomeCard() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    console.log('Component mounted');
  }, []);
  
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome to Lovable</CardTitle>
      </CardHeader>
      <CardContent>
        <p>You've clicked {count} times</p>
        <Button 
          onClick={() => setCount(count + 1)}
          className="mt-4"
        >
          Click me
        </Button>
      </CardContent>
    </Card>
  );
}`,
        exercise: 'Create a component that displays your name and has a button to toggle between showing/hiding your favorite hobby.',
        solution: `import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PersonalCard() {
  const [showHobby, setShowHobby] = useState(false);
  
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Hello, I'm John Doe</CardTitle>
      </CardHeader>
      <CardContent>
        {showHobby && <p>My favorite hobby is photography!</p>}
        <Button 
          onClick={() => setShowHobby(!showHobby)}
          className="mt-4"
        >
          {showHobby ? 'Hide Hobby' : 'Show Hobby'}
        </Button>
      </CardContent>
    </Card>
  );
}`
      }
    ]
  },
  {
    id: 'supabase-mastery',
    title: 'Supabase Backend Development',
    description: 'Learn how to leverage Supabase for authentication, database operations, real-time features, and storage in Lovable applications.',
    difficulty: 'Intermediate',
    duration: '6-8 hours',
    modules: 10,
    prerequisites: ['Lovable Platform Fundamentals'],
    learningOutcomes: [
      'Set up and configure Supabase projects',
      'Implement authentication and user management',
      'Design and work with PostgreSQL databases',
      'Build real-time features with Supabase Realtime',
      'Manage file storage and uploads',
      'Create and deploy Edge Functions'
    ],
    technologies: ['Supabase', 'PostgreSQL', 'Edge Functions', 'Realtime', 'Storage', 'Auth'],
    color: 'green',
    icon: Database,
    isUnlocked: true,
    progress: 0,
    modules_list: []
  },
  {
    id: 'ui-design-system',
    title: 'Tailwind CSS + Shadcn/UI Design System',
    description: 'Master the complete design system used in Lovable applications, from basic styling to complex component compositions.',
    difficulty: 'Beginner',
    duration: '3-4 hours',
    modules: 6,
    prerequisites: [],
    learningOutcomes: [
      'Understand Tailwind CSS utility-first approach',
      'Use Shadcn/UI components effectively',
      'Create responsive and accessible designs',
      'Implement dark/light theme support',
      'Build custom component variants',
      'Optimize for mobile and desktop experiences'
    ],
    technologies: ['Tailwind CSS', 'Shadcn/UI', 'CSS', 'Responsive Design'],
    color: 'blue',
    icon: Palette,
    isUnlocked: true,
    progress: 0,
    modules_list: []
  },
  {
    id: 'integrations-advanced',
    title: 'Advanced Integrations & APIs',
    description: 'Learn how to integrate external services like Stripe, Resend, Clerk, and Replicate into your Lovable applications.',
    difficulty: 'Advanced',
    duration: '8-10 hours',
    modules: 12,
    prerequisites: ['Lovable Platform Fundamentals', 'Supabase Backend Development'],
    learningOutcomes: [
      'Integrate Stripe for payments and subscriptions',
      'Set up email systems with Resend',
      'Implement advanced authentication with Clerk',
      'Use Replicate for AI model integrations',
      'Build GitHub integrations for deployment',
      'Create webhook systems and API integrations'
    ],
    technologies: ['Stripe', 'Resend', 'Clerk', 'Replicate', 'GitHub', 'Webhooks'],
    color: 'yellow',
    icon: Zap,
    isUnlocked: false,
    progress: 0,
    modules_list: []
  },
  {
    id: 'production-deployment',
    title: 'Production Deployment & DevOps',
    description: 'Learn how to deploy and maintain production Lovable applications with proper monitoring, performance optimization, and scaling strategies.',
    difficulty: 'Advanced',
    duration: '5-6 hours',
    modules: 8,
    prerequisites: ['Supabase Backend Development', 'Advanced Integrations & APIs'],
    learningOutcomes: [
      'Deploy applications to Vercel and Netlify',
      'Set up custom domains and SSL certificates',
      'Implement monitoring and analytics',
      'Optimize performance and loading times',
      'Set up automated deployments with GitHub',
      'Manage environment variables and secrets'
    ],
    technologies: ['Vercel', 'Netlify', 'GitHub Actions', 'Custom Domains', 'Performance'],
    color: 'red',
    icon: Rocket,
    isUnlocked: false,
    progress: 0,
    modules_list: []
  }
];

const interactiveTutorials: Tutorial[] = [
  {
    id: 'build-todo-lovable',
    title: 'Build a Todo App with Lovable Stack',
    description: 'Create a complete todo application using React 18, Supabase, and Tailwind CSS following Lovable best practices.',
    difficulty: 'Beginner',
    duration: '90 mins',
    category: 'Full-Stack Project',
    preview: 'Interactive todo list with real-time updates, user authentication, and beautiful UI using the complete Lovable stack.',
    features: ['Supabase Authentication', 'Real-time Database', 'Tailwind Styling', 'Shadcn/UI Components'],
    steps: [
      {
        id: 1,
        title: 'Set up the Project Structure',
        description: 'Create the basic structure for your todo app with proper TypeScript interfaces.',
        code: `// types/todo.ts
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  created_at: string;
  user_id: string;
}

// components/TodoApp.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TodoApp() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>My Todo List</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Let's build something amazing!</p>
        </CardContent>
      </Card>
    </div>
  );
}`,
        explanation: 'We start by defining our data structure and creating a basic component layout using Shadcn/UI cards.',
        tips: [
          'Always define TypeScript interfaces for your data structures',
          'Use Shadcn/UI components for consistent styling',
          'Follow Lovable\'s component naming conventions'
        ]
      }
    ],
    finalCode: `// Complete Todo App implementation here...`
  },
  {
    id: 'build-chat-app',
    title: 'Real-time Chat with Supabase Realtime',
    description: 'Build a real-time chat application using Supabase Realtime features and modern React patterns.',
    difficulty: 'Intermediate',
    duration: '120 mins',
    category: 'Real-time Features',
    preview: 'Live chat application with user presence, typing indicators, and message history using Supabase Realtime.',
    features: ['Supabase Realtime', 'User Presence', 'Typing Indicators', 'Message History'],
    steps: [],
    finalCode: ''
  },
  {
    id: 'ecommerce-stripe',
    title: 'E-commerce Store with Stripe Integration',
    description: 'Create a complete e-commerce solution with product catalog, shopping cart, and Stripe payments.',
    difficulty: 'Advanced',
    duration: '180 mins',
    category: 'E-commerce',
    preview: 'Full e-commerce store with product management, cart functionality, and secure payments via Stripe.',
    features: ['Stripe Payments', 'Product Catalog', 'Shopping Cart', 'Order Management'],
    steps: [],
    finalCode: ''
  }
];

const codingChallenges = [
  {
    id: 'react-hooks-challenge',
    title: 'React Hooks Mastery',
    description: 'Test your understanding of useState, useEffect, and custom hooks in Lovable applications.',
    difficulty: 'Beginner',
    points: 100,
    timeLimit: '30 mins',
    tasks: [
      'Create a counter component with increment/decrement',
      'Add a reset button that resets to initial value',
      'Display the count history in a list',
      'Add persistence using localStorage'
    ]
  },
  {
    id: 'supabase-crud-challenge',
    title: 'Supabase CRUD Operations',
    description: 'Build a complete CRUD application using Supabase client and real-time subscriptions.',
    difficulty: 'Intermediate',
    points: 250,
    timeLimit: '60 mins',
    tasks: [
      'Set up Supabase client connection',
      'Create, read, update, and delete records',
      'Implement real-time subscriptions',
      'Add error handling and loading states'
    ]
  },
  {
    id: 'ui-components-challenge',
    title: 'Custom UI Components',
    description: 'Create reusable UI components using Tailwind CSS and Shadcn/UI patterns.',
    difficulty: 'Intermediate',
    points: 200,
    timeLimit: '45 mins',
    tasks: [
      'Build a custom modal component',
      'Add animation and transitions',
      'Implement keyboard navigation',
      'Make it fully accessible'
    ]
  }
];

const Tutorials = () => {
  const [activeTab, setActiveTab] = useState('paths');
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${label} has been copied to your clipboard.`,
    });
  };

  const downloadContent = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Download Complete",
      description: `${filename} has been downloaded.`,
    });
  };

  const startLearningPath = (pathId: string) => {
    const path = learningPaths.find(p => p.id === pathId);
    if (path && path.isUnlocked) {
      setSelectedPath(path);
      toast({
        title: "Learning Path Started",
        description: `You've started the ${path.title} learning path.`,
      });
    } else if (path && !path.isUnlocked) {
      toast({
        title: "Path Locked",
        description: "Complete prerequisites to unlock this learning path.",
        variant: "destructive"
      });
    }
  };

  const completeModule = (moduleId: string) => {
    if (selectedPath) {
      const updatedModules = selectedPath.modules_list.map(m => 
        m.id === moduleId ? { ...m, isCompleted: true } : m
      );
      const completedCount = updatedModules.filter(m => m.isCompleted).length;
      const progress = (completedCount / updatedModules.length) * 100;
      
      setUserProgress(prev => ({
        ...prev,
        [selectedPath.id]: progress
      }));

      toast({
        title: "Module Completed!",
        description: `Great job! You've completed "${selectedModule?.title}".`,
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold gradient-logo-text mb-6">
            Comprehensive Lovable Tutorials
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto mb-8">
            Master the complete Lovable development stack through interactive tutorials, hands-on projects, 
            and structured learning paths. Build production-ready applications with confidence.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-purple-400" />
              <span>Lovable-Focused Content</span>
            </div>
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-blue-400" />
              <span>Interactive Coding</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span>Project-Based Learning</span>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-gray-900 border border-blue-400/30">
            <TabsTrigger value="paths" className="data-[state=active]:bg-blue-600">
              <BookOpen className="w-4 h-4 mr-2" />
              Learning Paths
            </TabsTrigger>
            <TabsTrigger value="tutorials" className="data-[state=active]:bg-blue-600">
              <PlayCircle className="w-4 h-4 mr-2" />
              Interactive Tutorials
            </TabsTrigger>
            <TabsTrigger value="challenges" className="data-[state=active]:bg-blue-600">
              <Target className="w-4 h-4 mr-2" />
              Coding Challenges
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-blue-600">
              <Rocket className="w-4 h-4 mr-2" />
              Real Projects
            </TabsTrigger>
            <TabsTrigger value="resources" className="data-[state=active]:bg-blue-600">
              <FileText className="w-4 h-4 mr-2" />
              Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="paths" className="mt-8">
            <div className="grid gap-8">
              {/* Learning Path Overview */}
              <Card className="bg-gray-900 border-purple-400/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-purple-400" />
                    Structured Learning Paths for Lovable Mastery
                  </CardTitle>
                  <CardDescription>
                    Follow these carefully designed learning paths to master every aspect of the Lovable development stack. 
                    Each path builds upon the previous one, ensuring a solid foundation for building production applications.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    {learningPaths.map((path, index) => (
                      <div 
                        key={path.id}
                        className={`p-6 bg-black/30 border border-${path.color}-400/30 rounded-lg ${path.isUnlocked ? 'hover:border-' + path.color + '-400/60 cursor-pointer' : 'opacity-60'} transition-all`}
                        onClick={() => path.isUnlocked && startLearningPath(path.id)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 bg-${path.color}-600/20 rounded-lg`}>
                              <path.icon className={`w-8 h-8 text-${path.color}-400`} />
                            </div>
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-semibold text-white">{path.title}</h3>
                                {!path.isUnlocked && <Lock className="w-5 h-5 text-gray-400" />}
                                <Badge className={getDifficultyColor(path.difficulty)}>
                                  {path.difficulty}
                                </Badge>
                              </div>
                              <p className="text-gray-300">{path.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                              <Clock className="w-4 h-4" />
                              <span>{path.duration}</span>
                            </div>
                            <div className="text-sm text-gray-400">
                              {path.modules} modules
                            </div>
                          </div>
                        </div>

                        {path.progress > 0 && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-400">Progress</span>
                              <span className="text-sm text-gray-400">{Math.round(userProgress[path.id] || path.progress)}%</span>
                            </div>
                            <Progress value={userProgress[path.id] || path.progress} className="h-2" />
                          </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h4 className={`font-medium text-${path.color}-400 mb-2 text-sm`}>Technologies You'll Learn:</h4>
                            <div className="flex flex-wrap gap-2">
                              {path.technologies.map((tech, techIndex) => (
                                <Badge key={techIndex} variant="outline" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className={`font-medium text-${path.color}-400 mb-2 text-sm`}>Learning Outcomes:</h4>
                            <ul className="space-y-1">
                              {path.learningOutcomes.slice(0, 3).map((outcome, outcomeIndex) => (
                                <li key={outcomeIndex} className="text-xs text-gray-300 flex items-start gap-2">
                                  <div className={`w-1.5 h-1.5 bg-${path.color}-400 rounded-full mt-1.5 flex-shrink-0`} />
                                  {outcome}
                                </li>
                              ))}
                              {path.learningOutcomes.length > 3 && (
                                <li className="text-xs text-gray-400">
                                  +{path.learningOutcomes.length - 3} more outcomes...
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>

                        {path.prerequisites.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-400 mb-2 text-sm">Prerequisites:</h4>
                            <div className="flex flex-wrap gap-2">
                              {path.prerequisites.map((prereq, prereqIndex) => (
                                <Badge key={prereqIndex} variant="outline" className="text-xs bg-gray-800">
                                  {prereq}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Users className="w-4 h-4" />
                            <span>{Math.floor(Math.random() * 500) + 100} learners enrolled</span>
                          </div>
                          <Button 
                            className={`bg-${path.color}-600 hover:bg-${path.color}-700 ${!path.isUnlocked && 'opacity-50 cursor-not-allowed'}`}
                            disabled={!path.isUnlocked}
                          >
                            {path.progress > 0 ? 'Continue Learning' : 'Start Learning Path'}
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tutorials" className="mt-8">
            <div className="grid gap-8">
              {/* Interactive Tutorials */}
              <Card className="bg-gray-900 border-blue-400/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <PlayCircle className="w-6 h-6 text-blue-400" />
                    Interactive Coding Tutorials
                  </CardTitle>
                  <CardDescription>
                    Build real applications step-by-step with guided tutorials. Each tutorial includes complete code examples, 
                    explanations, and hands-on exercises to reinforce your learning.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
                    {interactiveTutorials.map((tutorial, index) => (
                      <div 
                        key={tutorial.id}
                        className="p-6 bg-black/30 border border-gray-600 rounded-lg hover:border-blue-400/50 transition-all cursor-pointer"
                        onClick={() => setSelectedTutorial(tutorial)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold text-white">{tutorial.title}</h3>
                          <Badge className={getDifficultyColor(tutorial.difficulty)}>
                            {tutorial.difficulty}
                          </Badge>
                        </div>
                        <p className="text-gray-300 mb-4">{tutorial.description}</p>
                        
                        <div className="mb-4 p-3 bg-blue-900/20 border border-blue-400/30 rounded">
                          <p className="text-sm text-blue-200">
                            <strong>What you'll build:</strong> {tutorial.preview}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-gray-300">{tutorial.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-gray-300">{tutorial.category}</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="font-medium text-blue-400 mb-2">Key Features:</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {tutorial.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                                <span className="text-xs text-gray-300">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button className="w-full">
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Start Interactive Tutorial
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="challenges" className="mt-8">
            <div className="grid gap-8">
              {/* Coding Challenges */}
              <Card className="bg-gray-900 border-green-400/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Target className="w-6 h-6 text-green-400" />
                    Coding Challenges & Practice
                  </CardTitle>
                  <CardDescription>
                    Test your skills with hands-on coding challenges. Practice what you've learned and earn points 
                    as you master different aspects of the Lovable development stack.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
                    {codingChallenges.map((challenge, index) => (
                      <div key={challenge.id} className="p-6 bg-black/30 border border-green-400/30 rounded-lg hover:border-green-400/60 transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold text-white">{challenge.title}</h3>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm text-yellow-400">{challenge.points}pts</span>
                          </div>
                        </div>
                        <p className="text-gray-300 mb-4">{challenge.description}</p>
                        
                        <div className="flex items-center justify-between mb-4">
                          <Badge className={getDifficultyColor(challenge.difficulty)}>
                            {challenge.difficulty}
                          </Badge>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>{challenge.timeLimit}</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="font-medium text-green-400 mb-2 text-sm">Challenge Tasks:</h4>
                          <ul className="space-y-1">
                            {challenge.tasks.map((task, taskIndex) => (
                              <li key={taskIndex} className="text-xs text-gray-300 flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0" />
                                {task}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          <Target className="w-4 h-4 mr-2" />
                          Start Challenge
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="mt-8">
            <div className="grid gap-8">
              {/* Real Projects */}
              <Card className="bg-gray-900 border-purple-400/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Rocket className="w-6 h-6 text-purple-400" />
                    Real-World Projects
                  </CardTitle>
                  <CardDescription>
                    Build complete, production-ready applications using the Lovable stack. These projects mirror 
                    real-world requirements and will give you portfolio-worthy applications.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      {
                        title: 'SaaS Dashboard with Subscription Management',
                        description: 'Build a complete SaaS application with user authentication, subscription billing via Stripe, and a comprehensive admin dashboard.',
                        complexity: 'Advanced',
                        duration: '8-12 hours',
                        stack: ['React 18', 'Supabase', 'Stripe', 'Tailwind CSS'],
                        features: ['User Authentication', 'Stripe Subscriptions', 'Admin Dashboard', 'Usage Analytics', 'Email Notifications'],
                        preview: 'https://example.com/preview1.png'
                      },
                      {
                        title: 'Real-time Collaboration Platform',
                        description: 'Create a Slack-like collaboration platform with real-time messaging, file sharing, and team management features.',
                        complexity: 'Advanced',
                        duration: '10-15 hours',
                        stack: ['React 18', 'Supabase Realtime', 'Storage', 'Auth'],
                        features: ['Real-time Messaging', 'File Uploads', 'User Presence', 'Team Management', 'Message Search'],
                        preview: 'https://example.com/preview2.png'
                      },
                      {
                        title: 'E-learning Platform with Video Streaming',
                        description: 'Build a comprehensive e-learning platform with video courses, progress tracking, and certificate generation.',
                        complexity: 'Advanced',
                        duration: '12-18 hours',
                        stack: ['React 18', 'Supabase', 'Video Processing', 'PDF Generation'],
                        features: ['Video Streaming', 'Progress Tracking', 'Quizzes', 'Certificates', 'Course Management'],
                        preview: 'https://example.com/preview3.png'
                      },
                      {
                        title: 'Social Media Analytics Dashboard',
                        description: 'Create a social media analytics platform that aggregates data from multiple sources and provides insights.',
                        complexity: 'Intermediate',
                        duration: '6-10 hours',
                        stack: ['React 18', 'Supabase', 'Chart.js', 'API Integrations'],
                        features: ['Data Visualization', 'Multi-platform Integration', 'Custom Reports', 'Scheduled Reports', 'Team Sharing'],
                        preview: 'https://example.com/preview4.png'
                      }
                    ].map((project, index) => (
                      <div key={index} className="p-6 bg-black/30 border border-purple-400/30 rounded-lg hover:border-purple-400/60 transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                          <Badge className={getDifficultyColor(project.complexity)}>
                            {project.complexity}
                          </Badge>
                        </div>
                        <p className="text-gray-300 mb-4">{project.description}</p>
                        
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-purple-400" />
                            <span className="text-sm text-gray-300">{project.duration}</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="font-medium text-purple-400 mb-2 text-sm">Technology Stack:</h4>
                          <div className="flex flex-wrap gap-2">
                            {project.stack.map((tech, techIndex) => (
                              <Badge key={techIndex} variant="outline" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="font-medium text-purple-400 mb-2 text-sm">Key Features:</h4>
                          <div className="grid grid-cols-1 gap-1">
                            {project.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                                <span className="text-xs text-gray-300">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button className="w-full bg-purple-600 hover:bg-purple-700">
                          <Rocket className="w-4 h-4 mr-2" />
                          Start Building Project
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="mt-8">
            <div className="grid gap-8">
              {/* Quick Reference */}
              <Card className="bg-gray-900 border-yellow-400/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-yellow-400" />
                    Quick Reference & Cheat Sheets
                  </CardTitle>
                  <CardDescription>
                    Essential reference materials, cheat sheets, and quick guides for the Lovable development stack.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      {
                        title: 'Lovable Stack Cheat Sheet',
                        description: 'Complete reference for all Lovable technologies, APIs, and best practices.',
                        items: ['Component Library', 'Supabase APIs', 'TypeScript Types', 'Tailwind Classes'],
                        downloadUrl: '/lovable-cheat-sheet.pdf'
                      },
                      {
                        title: 'React 18 Hooks Reference',
                        description: 'Comprehensive guide to all React 18 hooks with examples and use cases.',
                        items: ['useState', 'useEffect', 'useContext', 'Custom Hooks'],
                        downloadUrl: '/react-hooks-reference.pdf'
                      },
                      {
                        title: 'Supabase API Documentation',
                        description: 'Complete API reference for Supabase services with code examples.',
                        items: ['Auth Methods', 'Database Queries', 'Realtime APIs', 'Storage APIs'],
                        downloadUrl: '/supabase-api-docs.pdf'
                      },
                      {
                        title: 'Tailwind CSS Classes',
                        description: 'Quick reference for Tailwind CSS utility classes and responsive design.',
                        items: ['Layout Classes', 'Typography', 'Colors', 'Responsive Design'],
                        downloadUrl: '/tailwind-reference.pdf'
                      },
                      {
                        title: 'Shadcn/UI Components',
                        description: 'Complete component library reference with props and usage examples.',
                        items: ['Form Components', 'Layout Components', 'Feedback Components', 'Navigation'],
                        downloadUrl: '/shadcn-components.pdf'
                      },
                      {
                        title: 'Deployment Guide',
                        description: 'Step-by-step deployment guide for Vercel, Netlify, and custom domains.',
                        items: ['Vercel Deployment', 'Environment Variables', 'Custom Domains', 'Performance'],
                        downloadUrl: '/deployment-guide.pdf'
                      }
                    ].map((resource, index) => (
                      <div key={index} className="p-5 bg-black/30 border border-yellow-400/30 rounded-lg">
                        <h3 className="text-lg font-semibold text-white mb-2">{resource.title}</h3>
                        <p className="text-gray-300 text-sm mb-4">{resource.description}</p>
                        
                        <div className="mb-4">
                          <h4 className="font-medium text-yellow-400 mb-2 text-sm">Includes:</h4>
                          <div className="space-y-1">
                            {resource.items.map((item, itemIndex) => (
                              <div key={itemIndex} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                                <span className="text-xs text-gray-300">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button className="w-full bg-yellow-600 hover:bg-yellow-700" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Video Resources */}
              <Card className="bg-gray-900 border-blue-400/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Video className="w-6 h-6 text-blue-400" />
                    Video Learning Resources
                  </CardTitle>
                  <CardDescription>
                    Watch comprehensive video tutorials and masterclasses for visual learners.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      {
                        title: 'Lovable Platform Masterclass',
                        description: 'Complete video series covering every aspect of the Lovable development stack.',
                        duration: '4 hours',
                        episodes: 12,
                        topics: ['Platform Overview', 'React Fundamentals', 'Supabase Integration', 'Deployment']
                      },
                      {
                        title: 'Building Real Apps with Lovable',
                        description: 'Watch as we build complete applications from start to finish using Lovable.',
                        duration: '6 hours',
                        episodes: 8,
                        topics: ['Project Planning', 'UI Design', 'Backend Setup', 'Production Deployment']
                      },
                      {
                        title: 'Advanced Patterns & Best Practices',
                        description: 'Learn advanced development patterns and industry best practices for Lovable apps.',
                        duration: '3 hours',
                        episodes: 10,
                        topics: ['Code Organization', 'Performance', 'Security', 'Testing']
                      },
                      {
                        title: 'Integration Deep Dives',
                        description: 'Detailed tutorials on integrating Stripe, Resend, Clerk, and other services.',
                        duration: '5 hours',
                        episodes: 15,
                        topics: ['Stripe Payments', 'Email Systems', 'Authentication', 'AI Integration']
                      }
                    ].map((series, index) => (
                      <div key={index} className="p-5 bg-black/30 border border-blue-400/30 rounded-lg">
                        <h3 className="text-lg font-semibold text-white mb-2">{series.title}</h3>
                        <p className="text-gray-300 text-sm mb-4">{series.description}</p>
                        
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-gray-300">{series.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Video className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-gray-300">{series.episodes} episodes</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="font-medium text-blue-400 mb-2 text-sm">Topics Covered:</h4>
                          <div className="flex flex-wrap gap-2">
                            {series.topics.map((topic, topicIndex) => (
                              <Badge key={topicIndex} variant="outline" className="text-xs">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <Button className="w-full" size="sm">
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Watch Series
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Learning Path Detail Modal */}
        {selectedPath && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="bg-gray-900 border-blue-400/30 max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <selectedPath.icon className={`w-8 h-8 text-${selectedPath.color}-400`} />
                    <div>
                      <CardTitle className="text-2xl">{selectedPath.title}</CardTitle>
                      <CardDescription className="text-lg">{selectedPath.description}</CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" onClick={() => setSelectedPath(null)}>
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[60vh]">
                  <div className="space-y-6">
                    {/* Progress */}
                    {selectedPath.progress > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">Your Progress</span>
                          <span>{Math.round(userProgress[selectedPath.id] || selectedPath.progress)}%</span>
                        </div>
                        <Progress value={userProgress[selectedPath.id] || selectedPath.progress} className="h-3" />
                      </div>
                    )}

                    {/* Learning Outcomes */}
                    <div>
                      <h4 className="font-semibold text-blue-400 mb-3">What You'll Learn</h4>
                      <ul className="space-y-2">
                        {selectedPath.learningOutcomes.map((outcome, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-300">
                            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Modules */}
                    <div>
                      <h4 className="font-semibold text-blue-400 mb-3">Course Modules</h4>
                      <Accordion type="single" collapsible className="w-full">
                        {selectedPath.modules_list.map((module, index) => (
                          <AccordionItem key={module.id} value={module.id}>
                            <AccordionTrigger className="hover:no-underline">
                              <div className="flex items-center gap-3">
                                {module.isCompleted ? (
                                  <CheckCircle className="w-5 h-5 text-green-400" />
                                ) : (
                                  <div className="w-5 h-5 border-2 border-gray-400 rounded-full" />
                                )}
                                <div className="text-left">
                                  <div className="font-medium">{module.title}</div>
                                  <div className="text-sm text-gray-400">{module.duration} • {module.type}</div>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="pl-8 space-y-4">
                                <p className="text-gray-300">{module.description}</p>
                                
                                {module.content && (
                                  <div className="space-y-3">
                                    <div className="bg-black/50 p-4 rounded-lg border border-gray-600">
                                      <pre className="text-sm text-gray-300 whitespace-pre-wrap">{module.content.substring(0, 300)}...</pre>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button size="sm" onClick={() => setSelectedModule(module)}>
                                        <PlayCircle className="w-4 h-4 mr-2" />
                                        Start Module
                                      </Button>
                                      {module.codeExample && (
                                        <Button size="sm" variant="outline" onClick={() => copyToClipboard(module.codeExample!, 'Code example')}>
                                          <Copy className="w-4 h-4 mr-2" />
                                          Copy Code
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tutorial Detail Modal */}
        {selectedTutorial && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="bg-gray-900 border-blue-400/30 max-w-6xl w-full max-h-[90vh] overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{selectedTutorial.title}</CardTitle>
                    <CardDescription className="text-lg">{selectedTutorial.description}</CardDescription>
                  </div>
                  <Button variant="ghost" onClick={() => setSelectedTutorial(null)}>
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[70vh]">
                  <div className="space-y-6">
                    {/* Tutorial Steps */}
                    {selectedTutorial.steps.map((step, index) => (
                      <div key={step.id} className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                            {step.id}
                          </div>
                          <h3 className="text-xl font-semibold">{step.title}</h3>
                        </div>
                        
                        <p className="text-gray-300 pl-11">{step.description}</p>
                        
                        {step.code && (
                          <div className="pl-11">
                            <div className="bg-black/50 p-4 rounded-lg border border-gray-600">
                              <pre className="text-sm text-green-400 font-mono overflow-x-auto">{step.code}</pre>
                            </div>
                            <div className="flex gap-2 mt-2">
                              <Button size="sm" variant="outline" onClick={() => copyToClipboard(step.code, 'Step code')}>
                                <Copy className="w-4 h-4 mr-2" />
                                Copy Code
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        <div className="pl-11">
                          <h4 className="font-medium text-blue-400 mb-2">Explanation:</h4>
                          <p className="text-gray-300 text-sm">{step.explanation}</p>
                        </div>
                        
                        {step.tips.length > 0 && (
                          <div className="pl-11">
                            <h4 className="font-medium text-yellow-400 mb-2">Tips:</h4>
                            <ul className="space-y-1">
                              {step.tips.map((tip, tipIndex) => (
                                <li key={tipIndex} className="text-sm text-gray-300 flex items-start gap-2">
                                  <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {index < selectedTutorial.steps.length - 1 && (
                          <Separator className="my-6" />
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tutorials;
