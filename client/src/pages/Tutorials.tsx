
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
  Mic,
  X,
  ArrowLeft,
  ArrowRight
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

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  points: number;
  timeLimit: string;
  tasks: string[];
  starterCode: string;
  solution: string;
  testCases: string[];
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

This fixed stack eliminates choice paralysis and ensures every app is built with modern, battle-tested technologies.

## Key Benefits

- **Zero Configuration**: Everything works out of the box
- **AI-First Development**: Natural language to production code
- **Instant Deployment**: From idea to live app in minutes
- **Professional Quality**: Enterprise-grade applications`,
        codeExample: `// Example: Basic Lovable App Structure
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function WelcomeCard() {
  const [count, setCount] = useState(0);

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
}`
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

Every Lovable app is built with functional components using modern React patterns.

## Hooks You'll Use Most

1. **useState**: For component state management
2. **useEffect**: For side effects and lifecycle events
3. **useContext**: For global state management
4. **Custom Hooks**: For reusable logic

## Modern Patterns

- Functional components only
- TypeScript for type safety
- Shadcn/UI for consistent styling
- Tailwind CSS for utility-first styling`,
        codeExample: `import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function CounterApp() {
  const [count, setCount] = useState(0);
  const [isEven, setIsEven] = useState(true);

  useEffect(() => {
    setIsEven(count % 2 === 0);
  }, [count]);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(0);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>React Counter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <span className="text-4xl font-bold">{count}</span>
          <p className="text-sm text-gray-500">
            {isEven ? 'Even' : 'Odd'} number
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={decrement} variant="outline">-</Button>
          <Button onClick={reset} variant="secondary">Reset</Button>
          <Button onClick={increment}>+</Button>
        </div>
      </CardContent>
    </Card>
  );
}`,
        exercise: 'Create a todo list component with add, delete, and toggle functionality.',
        solution: `import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([...todos, { 
        id: Date.now(), 
        text: inputValue, 
        completed: false 
      }]);
      setInputValue('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Todo List</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add a todo..."
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          />
          <Button onClick={addTodo}>Add</Button>
        </div>
        <div className="space-y-2">
          {todos.map(todo => (
            <div key={todo.id} className="flex items-center gap-2">
              <Checkbox 
                checked={todo.completed}
                onCheckedChange={() => toggleTodo(todo.id)}
              />
              <span className={todo.completed ? 'line-through text-gray-500' : ''}>
                {todo.text}
              </span>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => deleteTodo(todo.id)}
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>My Todo List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input 
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new todo..."
            />
            <Button>Add Todo</Button>
          </div>
          <div className="space-y-2">
            {/* Todo items will go here */}
          </div>
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
      },
      {
        id: 2,
        title: 'Add State Management',
        description: 'Implement React state management for the todo functionality.',
        code: `import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: crypto.randomUUID(),
        text: newTodo,
        completed: false
      };
      setTodos([...todos, todo]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>My Todo List ({todos.length} items)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input 
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new todo..."
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            />
            <Button onClick={addTodo}>Add Todo</Button>
          </div>
          <div className="space-y-2">
            {todos.map(todo => (
              <div key={todo.id} className="flex items-center gap-2 p-2 border rounded">
                <Checkbox 
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id)}
                />
                <span className={todo.completed ? 'line-through text-gray-500' : ''}>
                  {todo.text}
                </span>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => deleteTodo(todo.id)}
                  className="ml-auto"
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}`,
        explanation: 'We add full CRUD operations using React state. The component can now add, toggle, and delete todos.',
        tips: [
          'Use crypto.randomUUID() for unique IDs',
          'Always validate input before adding to state',
          'Use the spread operator for immutable updates'
        ]
      }
    ],
    finalCode: `// Complete Todo App implementation
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: crypto.randomUUID(),
        text: newTodo,
        completed: false,
        createdAt: new Date()
      };
      setTodos([...todos, todo]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const completedCount = todos.filter(todo => todo.completed).length;
  const activeCount = todos.length - completedCount;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>My Todo List</span>
            <Badge variant="outline">
              {activeCount} active, {completedCount} completed
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input 
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new todo..."
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            />
            <Button onClick={addTodo}>Add Todo</Button>
          </div>
          
          <div className="flex gap-2 mb-4">
            <Button 
              size="sm" 
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button 
              size="sm" 
              variant={filter === 'active' ? 'default' : 'outline'}
              onClick={() => setFilter('active')}
            >
              Active
            </Button>
            <Button 
              size="sm" 
              variant={filter === 'completed' ? 'default' : 'outline'}
              onClick={() => setFilter('completed')}
            >
              Completed
            </Button>
            {completedCount > 0 && (
              <Button 
                size="sm" 
                variant="destructive"
                onClick={clearCompleted}
                className="ml-auto"
              >
                Clear Completed
              </Button>
            )}
          </div>
          
          <div className="space-y-2">
            {filteredTodos.map(todo => (
              <div key={todo.id} className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox 
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id)}
                />
                <div className="flex-1">
                  <span className={todo.completed ? 'line-through text-gray-500' : ''}>
                    {todo.text}
                  </span>
                  <div className="text-xs text-gray-400">
                    {todo.createdAt.toLocaleDateString()}
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </Button>
              </div>
            ))}
            {filteredTodos.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {filter === 'all' ? 'No todos yet. Add one above!' : 
                 filter === 'active' ? 'No active todos!' : 'No completed todos!'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}`
  }
];

const codingChallenges: Challenge[] = [
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
    ],
    starterCode: `import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function CounterChallenge() {
  // Your code here
  
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Counter Challenge</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Your UI here */}
      </CardContent>
    </Card>
  );
}`,
    solution: `import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function CounterChallenge() {
  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem('counter');
    return saved ? parseInt(saved) : 0;
  });
  const [history, setHistory] = useState<number[]>([]);

  useEffect(() => {
    localStorage.setItem('counter', count.toString());
    setHistory(prev => [...prev, count].slice(-10)); // Keep last 10
  }, [count]);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(0);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Counter Challenge</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-4xl font-bold">{count}</div>
        </div>
        <div className="flex gap-2 justify-center">
          <Button onClick={decrement}>-</Button>
          <Button onClick={reset} variant="outline">Reset</Button>
          <Button onClick={increment}>+</Button>
        </div>
        <div>
          <h4 className="font-medium mb-2">History:</h4>
          <div className="text-sm text-gray-600">
            {history.join(' → ')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}`,
    testCases: [
      'Counter should increment when + button is clicked',
      'Counter should decrement when - button is clicked',
      'Counter should reset to 0 when reset button is clicked',
      'History should track the last 10 values',
      'Counter value should persist in localStorage'
    ]
  }
];

const Tutorials = () => {
  const [activeTab, setActiveTab] = useState('paths');
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});
  const [challengeCode, setChallengeCode] = useState('');
  const [showSolution, setShowSolution] = useState(false);
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

  const startTutorial = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial);
    setCurrentStep(0);
    toast({
      title: "Tutorial Started",
      description: `Started "${tutorial.title}" tutorial.`,
    });
  };

  const startChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setChallengeCode(challenge.starterCode);
    setShowSolution(false);
    toast({
      title: "Challenge Started",
      description: `Started "${challenge.title}" challenge.`,
    });
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
            Complete Lovable Tutorials
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
            <div className="grid gap-6">
              {learningPaths.map((path, index) => (
                <Card key={path.id} className="bg-gray-900 border-purple-400/30">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-600/20 rounded-lg">
                          <path.icon className="w-8 h-8 text-purple-400" />
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
                        <h4 className="font-medium text-purple-400 mb-2 text-sm">Technologies:</h4>
                        <div className="flex flex-wrap gap-2">
                          {path.technologies.map((tech, techIndex) => (
                            <Badge key={techIndex} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-purple-400 mb-2 text-sm">Learning Outcomes:</h4>
                        <ul className="space-y-1">
                          {path.learningOutcomes.slice(0, 3).map((outcome, outcomeIndex) => (
                            <li key={outcomeIndex} className="text-xs text-gray-300 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5 flex-shrink-0" />
                              {outcome}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>{Math.floor(Math.random() * 500) + 100} learners enrolled</span>
                      </div>
                      <Button 
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={() => startLearningPath(path.id)}
                        disabled={!path.isUnlocked}
                      >
                        {path.progress > 0 ? 'Continue Learning' : 'Start Learning Path'}
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tutorials" className="mt-8">
            <div className="grid gap-6">
              {interactiveTutorials.map((tutorial, index) => (
                <Card key={tutorial.id} className="bg-gray-900 border-blue-400/30">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-white">{tutorial.title}</h3>
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

                    <Button className="w-full" onClick={() => startTutorial(tutorial)}>
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Start Interactive Tutorial
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="challenges" className="mt-8">
            <div className="grid gap-6">
              {codingChallenges.map((challenge, index) => (
                <Card key={challenge.id} className="bg-gray-900 border-green-400/30">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-white">{challenge.title}</h3>
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

                    <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => startChallenge(challenge)}>
                      <Target className="w-4 h-4 mr-2" />
                      Start Challenge
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="projects" className="mt-8">
            <Card className="bg-gray-900 border-purple-400/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Rocket className="w-6 h-6 text-purple-400" />
                  Real-World Projects
                </CardTitle>
                <CardDescription>
                  Build complete, production-ready applications using the Lovable stack.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Rocket className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Coming Soon!</h3>
                  <p className="text-gray-400">
                    Real-world projects are being developed. Check back soon for hands-on project tutorials.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="mt-8">
            <div className="grid gap-6">
              <Card className="bg-gray-900 border-yellow-400/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-yellow-400" />
                    Quick Reference & Cheat Sheets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      {
                        title: 'Lovable Stack Cheat Sheet',
                        description: 'Complete reference for all Lovable technologies, APIs, and best practices.',
                        items: ['Component Library', 'Supabase APIs', 'TypeScript Types', 'Tailwind Classes'],
                      },
                      {
                        title: 'React 18 Hooks Reference',
                        description: 'Comprehensive guide to all React 18 hooks with examples and use cases.',
                        items: ['useState', 'useEffect', 'useContext', 'Custom Hooks'],
                      },
                      {
                        title: 'Tailwind CSS Classes',
                        description: 'Quick reference for Tailwind CSS utility classes and responsive design.',
                        items: ['Layout Classes', 'Typography', 'Colors', 'Responsive Design'],
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
                    <selectedPath.icon className="w-8 h-8 text-purple-400" />
                    <div>
                      <CardTitle className="text-2xl">{selectedPath.title}</CardTitle>
                      <CardDescription className="text-lg">{selectedPath.description}</CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" onClick={() => setSelectedPath(null)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[60vh]">
                  <div className="space-y-6">
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
                      {selectedPath.modules_list.length > 0 ? (
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
                                        <Button size="sm" variant="outline" onClick={() => completeModule(module.id)}>
                                          <CheckCircle className="w-4 h-4 mr-2" />
                                          Mark Complete
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                          <p>Modules for this learning path are being developed.</p>
                          <p className="text-sm">Check back soon for detailed course content!</p>
                        </div>
                      )}
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
                  <Button variant="ghost" onClick={() => {setSelectedTutorial(null); setCurrentStep(0);}}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[70vh]">
                  <div className="space-y-6">
                    {/* Current Step */}
                    {selectedTutorial.steps[currentStep] && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                            {selectedTutorial.steps[currentStep].id}
                          </div>
                          <h3 className="text-xl font-semibold">{selectedTutorial.steps[currentStep].title}</h3>
                          <Badge className="bg-blue-600 text-white">Current Step</Badge>
                        </div>

                        <p className="text-gray-300 pl-11">{selectedTutorial.steps[currentStep].description}</p>

                        {selectedTutorial.steps[currentStep].code && (
                          <div className="pl-11">
                            <div className="bg-black/50 p-4 rounded-lg border border-gray-600">
                              <pre className="text-sm text-green-400 font-mono overflow-x-auto">{selectedTutorial.steps[currentStep].code}</pre>
                            </div>
                            <div className="flex gap-2 mt-2">
                              <Button size="sm" variant="outline" onClick={() => copyToClipboard(selectedTutorial.steps[currentStep].code, 'Step code')}>
                                <Copy className="w-4 h-4 mr-2" />
                                Copy Code
                              </Button>
                            </div>
                          </div>
                        )}

                        <div className="pl-11">
                          <h4 className="font-medium text-blue-400 mb-2">Explanation:</h4>
                          <p className="text-gray-300 text-sm">{selectedTutorial.steps[currentStep].explanation}</p>
                        </div>

                        {selectedTutorial.steps[currentStep].tips.length > 0 && (
                          <div className="pl-11">
                            <h4 className="font-medium text-yellow-400 mb-2">Tips:</h4>
                            <ul className="space-y-1">
                              {selectedTutorial.steps[currentStep].tips.map((tip, tipIndex) => (
                                <li key={tipIndex} className="text-sm text-gray-300 flex items-start gap-2">
                                  <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tutorial Navigation */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-600">
                      <Button 
                        variant="outline" 
                        disabled={currentStep === 0}
                        onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Previous Step
                      </Button>
                      <span className="text-sm text-gray-400">
                        Step {currentStep + 1} of {selectedTutorial.steps.length}
                      </span>
                      <Button 
                        disabled={currentStep === selectedTutorial.steps.length - 1}
                        onClick={() => setCurrentStep(Math.min(selectedTutorial.steps.length - 1, currentStep + 1))}
                      >
                        Next Step
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>

                    {/* Final Code */}
                    {currentStep === selectedTutorial.steps.length - 1 && selectedTutorial.finalCode && (
                      <div className="space-y-4">
                        <h4 className="font-semibold text-green-400">Complete Final Code:</h4>
                        <div className="bg-black/50 p-4 rounded-lg border border-gray-600">
                          <pre className="text-sm text-green-400 font-mono overflow-x-auto">{selectedTutorial.finalCode}</pre>
                        </div>
                        <Button onClick={() => copyToClipboard(selectedTutorial.finalCode, 'Final code')}>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Final Code
                        </Button>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Challenge Modal */}
        {selectedChallenge && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="bg-gray-900 border-green-400/30 max-w-6xl w-full max-h-[90vh] overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{selectedChallenge.title}</CardTitle>
                    <CardDescription className="text-lg">{selectedChallenge.description}</CardDescription>
                  </div>
                  <Button variant="ghost" onClick={() => setSelectedChallenge(null)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6 h-[70vh]">
                  {/* Challenge Info */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Badge className={getDifficultyColor(selectedChallenge.difficulty)}>
                        {selectedChallenge.difficulty}
                      </Badge>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{selectedChallenge.timeLimit}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-yellow-400">{selectedChallenge.points}pts</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-green-400 mb-2">Tasks:</h4>
                      <ul className="space-y-1">
                        {selectedChallenge.tasks.map((task, taskIndex) => (
                          <li key={taskIndex} className="text-sm text-gray-300 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0" />
                            {task}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-green-400 mb-2">Test Cases:</h4>
                      <ul className="space-y-1">
                        {selectedChallenge.testCases.map((test, testIndex) => (
                          <li key={testIndex} className="text-sm text-gray-300 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0" />
                            {test}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={() => setShowSolution(!showSolution)}
                        variant="outline"
                      >
                        {showSolution ? 'Hide Solution' : 'Show Solution'}
                      </Button>
                      <Button onClick={() => copyToClipboard(challengeCode, 'Challenge code')}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Code
                      </Button>
                    </div>
                  </div>

                  {/* Code Editor */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-green-400">Your Code:</h4>
                    <div className="bg-black/50 p-4 rounded-lg border border-gray-600 h-[50vh] overflow-auto">
                      <pre className="text-sm text-green-400 font-mono">{challengeCode}</pre>
                    </div>
                    
                    {showSolution && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-yellow-400">Solution:</h4>
                        <div className="bg-black/50 p-4 rounded-lg border border-gray-600 max-h-[20vh] overflow-auto">
                          <pre className="text-sm text-yellow-400 font-mono">{selectedChallenge.solution}</pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tutorials;
