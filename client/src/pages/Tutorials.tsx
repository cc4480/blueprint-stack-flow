import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
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
  ArrowRight,
  Terminal,
  Box,
  Layers,
  Workflow,
  PenTool,
  Save,
  Eye,
  RotateCcw
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
  liveDemo?: () => JSX.Element;
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
  livePreview?: () => JSX.Element;
}

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  code: string;
  explanation: string;
  tips: string[];
  liveExample?: () => JSX.Element;
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

// Live Demo Components for Tutorials
const TodoAppDemo = () => {
  const [todos, setTodos] = useState<Array<{id: number, text: string, completed: boolean}>>([]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    if (inputValue.trim()) {
      setTodos([...todos, { id: Date.now(), text: inputValue, completed: false }]);
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
        <CardTitle>Live Todo Demo</CardTitle>
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
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const CounterDemo = () => {
  const [count, setCount] = useState(0);
  const [isEven, setIsEven] = useState(true);

  useEffect(() => {
    setIsEven(count % 2 === 0);
  }, [count]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Live Counter Demo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <span className="text-4xl font-bold">{count}</span>
          <p className="text-sm text-gray-500">
            {isEven ? 'Even' : 'Odd'} number
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setCount(count - 1)} variant="outline">-</Button>
          <Button onClick={() => setCount(0)} variant="secondary">Reset</Button>
          <Button onClick={() => setCount(count + 1)}>+</Button>
        </div>
      </CardContent>
    </Card>
  );
};

const FormDemo = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    subscribe: false
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Live Form Demo</CardTitle>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div className="text-center p-4 bg-green-100 rounded">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-green-800">Form submitted successfully!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea 
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="subscribe"
                checked={formData.subscribe}
                onCheckedChange={(checked) => setFormData({...formData, subscribe: !!checked})}
              />
              <Label htmlFor="subscribe">Subscribe to newsletter</Label>
            </div>
            <Button type="submit" className="w-full">Submit</Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

const WeatherDemo = () => {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState('London');

  const fetchWeather = async () => {
    setLoading(true);
    // Simulated weather data
    setTimeout(() => {
      setWeather({
        city: city,
        temperature: Math.floor(Math.random() * 30) + 10,
        condition: ['Sunny', 'Cloudy', 'Rainy', 'Snowy'][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 50) + 30,
        windSpeed: Math.floor(Math.random() * 20) + 5
      });
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Live Weather Demo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input 
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city..."
          />
          <Button onClick={fetchWeather} disabled={loading}>
            {loading ? 'Loading...' : 'Get Weather'}
          </Button>
        </div>
        {weather && (
          <div className="p-4 bg-blue-50 rounded">
            <h3 className="font-bold text-lg">{weather.city}</h3>
            <p className="text-2xl font-bold">{weather.temperature}°C</p>
            <p className="text-gray-600">{weather.condition}</p>
            <div className="mt-2 space-y-1">
              <p>Humidity: {weather.humidity}%</p>
              <p>Wind: {weather.windSpeed} km/h</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const CodePlayground = ({ initialCode, language = 'javascript' }: { initialCode: string, language?: string }) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const runCode = () => {
    try {
      // Simple code execution simulation for demo purposes
      if (language === 'javascript') {
        const result = eval(code);
        setOutput(String(result));
      }
    } catch (error) {
      setOutput(`Error: ${error}`);
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <Badge variant="secondary">{language}</Badge>
        <div className="flex gap-2">
          <Button size="sm" onClick={runCode} variant="outline">
            <PlayCircle className="w-4 h-4 mr-1" />
            Run
          </Button>
          <Button size="sm" onClick={() => setShowPreview(!showPreview)} variant="outline">
            <Eye className="w-4 h-4 mr-1" />
            Preview
          </Button>
        </div>
      </div>
      <Textarea 
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="font-mono text-sm"
        rows={8}
      />
      {output && (
        <div className="bg-gray-100 p-2 rounded border">
          <p className="text-sm font-mono">Output: {output}</p>
        </div>
      )}
    </div>
  );
};

const learningPaths: LearningPath[] = [
  {
    id: 'web-fundamentals',
    title: 'Web Development Fundamentals',
    description: 'Complete beginner course covering HTML, CSS, JavaScript, and modern web development practices.',
    difficulty: 'Beginner',
    duration: '8-12 hours',
    modules: 12,
    prerequisites: [],
    learningOutcomes: [
      'Master HTML structure and semantic markup',
      'Create responsive layouts with CSS',
      'Understand JavaScript fundamentals and DOM manipulation',
      'Build interactive web applications',
      'Learn version control with Git',
      'Deploy projects to the web'
    ],
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Git', 'Netlify'],
    color: 'green',
    icon: Globe,
    isUnlocked: true,
    progress: 0,
    modules_list: [
      {
        id: 'html-basics',
        title: 'HTML Fundamentals',
        description: 'Learn the building blocks of web pages with HTML5.',
        duration: '90 mins',
        type: 'coding',
        isCompleted: false,
        content: `# HTML Fundamentals

HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of a web page using elements.

## Key Concepts

### HTML Document Structure
Every HTML document follows a basic structure:
- DOCTYPE declaration
- HTML root element
- Head section (metadata)
- Body section (visible content)

### Semantic HTML
Use semantic elements that describe their meaning:
- \`<header>\`, \`<nav>\`, \`<main>\`, \`<article>\`, \`<section>\`, \`<aside>\`, \`<footer>\`
- These provide better accessibility and SEO

### Common Elements
- Headings: \`<h1>\` to \`<h6>\`
- Paragraphs: \`<p>\`
- Links: \`<a href="">\`
- Images: \`<img src="" alt="">\`
- Lists: \`<ul>\`, \`<ol>\`, \`<li>\`
- Forms: \`<form>\`, \`<input>\`, \`<button>\``,
        codeExample: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Web Page</title>
</head>
<body>
    <header>
        <h1>Welcome to My Website</h1>
        <nav>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section id="home">
            <h2>Home Section</h2>
            <p>This is the main content of my website.</p>
            <img src="image.jpg" alt="Description of image">
        </section>
        
        <section id="about">
            <h2>About Me</h2>
            <p>I'm learning web development!</p>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2024 My Website. All rights reserved.</p>
    </footer>
</body>
</html>`,
        exercise: 'Create a personal portfolio page with header, navigation, about section, projects section, and footer.',
        solution: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>John Doe - Portfolio</title>
</head>
<body>
    <header>
        <h1>John Doe</h1>
        <p>Web Developer & Designer</p>
        <nav>
            <ul>
                <li><a href="#about">About</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section id="about">
            <h2>About Me</h2>
            <p>I'm a passionate web developer with experience in modern technologies.</p>
            <ul>
                <li>Frontend Development</li>
                <li>Responsive Design</li>
                <li>User Experience</li>
            </ul>
        </section>
        
        <section id="projects">
            <h2>My Projects</h2>
            <article>
                <h3>Project 1: E-commerce Site</h3>
                <p>A fully responsive online store built with React and Node.js.</p>
                <a href="#">View Project</a>
            </article>
            <article>
                <h3>Project 2: Weather App</h3>
                <p>Real-time weather application with geolocation features.</p>
                <a href="#">View Project</a>
            </article>
        </section>
        
        <section id="contact">
            <h2>Contact Me</h2>
            <form>
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required>
                
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required>
                
                <label for="message">Message:</label>
                <textarea id="message" name="message" rows="4" required></textarea>
                
                <button type="submit">Send Message</button>
            </form>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2024 John Doe. All rights reserved.</p>
        <p>
            <a href="mailto:john@example.com">Email</a> |
            <a href="https://linkedin.com/in/johndoe">LinkedIn</a> |
            <a href="https://github.com/johndoe">GitHub</a>
        </p>
    </footer>
</body>
</html>`
      },
      {
        id: 'css-styling',
        title: 'CSS Styling & Layout',
        description: 'Master CSS for beautiful, responsive web designs.',
        duration: '120 mins',
        type: 'coding',
        isCompleted: false,
        content: `# CSS Styling & Layout

CSS (Cascading Style Sheets) controls the visual presentation of web pages. Learn to create beautiful, responsive designs.

## Key Concepts

### CSS Selectors
- Element selectors: \`h1 { }\`
- Class selectors: \`.class-name { }\`
- ID selectors: \`#id-name { }\`
- Attribute selectors: \`[type="text"] { }\`

### Layout Methods
1. **Flexbox**: One-dimensional layout
2. **Grid**: Two-dimensional layout
3. **Position**: Absolute, relative, fixed, sticky

### Responsive Design
- Mobile-first approach
- Media queries
- Flexible units (rem, em, %, vw, vh)
- Responsive images

### Modern CSS Features
- CSS Variables (Custom Properties)
- CSS Grid
- Flexbox
- Animations and Transitions`,
        codeExample: `/* Modern CSS Styling */

/* CSS Variables */
:root {
  --primary-color: #3b82f6;
  --secondary-color: #64748b;
  --text-color: #1e293b;
  --bg-color: #ffffff;
  --border-radius: 8px;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', system-ui, sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background: var(--bg-color);
}

/* Layout with Grid */
.container {
  display: grid;
  grid-template-areas: 
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 250px 1fr;
  min-height: 100vh;
  gap: 1rem;
  padding: 1rem;
}

header {
  grid-area: header;
  background: var(--primary-color);
  color: white;
  padding: 1rem;
  border-radius: var(--border-radius);
}

.sidebar {
  grid-area: sidebar;
  background: #f8fafc;
  padding: 1rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

main {
  grid-area: main;
  padding: 1rem;
}

footer {
  grid-area: footer;
  text-align: center;
  padding: 1rem;
  background: var(--secondary-color);
  color: white;
  border-radius: var(--border-radius);
}

/* Flexbox Navigation */
nav ul {
  display: flex;
  list-style: none;
  gap: 1rem;
}

nav a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  transition: background 0.3s ease;
}

nav a:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Card Component */
.card {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 12px -2px rgba(0, 0, 0, 0.15);
}

/* Button Styles */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    grid-template-areas: 
      "header"
      "main"
      "sidebar"
      "footer";
    grid-template-columns: 1fr;
  }
  
  nav ul {
    flex-direction: column;
  }
  
  .card {
    padding: 1rem;
  }
}`,
        exercise: 'Create a responsive portfolio layout with header, navigation, project cards, and footer using CSS Grid and Flexbox.',
        liveDemo: () => (
          <div className="w-full max-w-4xl mx-auto border rounded-lg overflow-hidden">
            <div className="bg-blue-600 text-white p-4">
              <h1 className="text-xl font-bold mb-2">Portfolio Demo</h1>
              <nav className="flex flex-wrap gap-2">
                <a href="#" className="px-3 py-1 bg-white/20 rounded">Home</a>
                <a href="#" className="px-3 py-1 bg-white/20 rounded">About</a>
                <a href="#" className="px-3 py-1 bg-white/20 rounded">Projects</a>
                <a href="#" className="px-3 py-1 bg-white/20 rounded">Contact</a>
              </nav>
            </div>
            <div className="grid md:grid-cols-3 gap-4 p-4">
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-bold mb-2">Project 1</h3>
                <p className="text-sm text-gray-600">E-commerce platform</p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-bold mb-2">Project 2</h3>
                <p className="text-sm text-gray-600">Weather app</p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-bold mb-2">Project 3</h3>
                <p className="text-sm text-gray-600">Blog platform</p>
              </div>
            </div>
            <div className="bg-gray-200 p-4 text-center text-sm">
              © 2024 Portfolio. All rights reserved.
            </div>
          </div>
        )
      }
    ]
  },
  {
    id: 'react-mastery',
    title: 'React Development Mastery',
    description: 'Master modern React development with hooks, state management, and best practices.',
    difficulty: 'Intermediate',
    duration: '10-15 hours',
    modules: 15,
    prerequisites: ['Web Development Fundamentals'],
    learningOutcomes: [
      'Build complex React applications',
      'Master React hooks and state management',
      'Implement routing and navigation',
      'Handle forms and user input',
      'Work with APIs and external data',
      'Optimize performance and accessibility'
    ],
    technologies: ['React 18', 'TypeScript', 'React Router', 'React Query', 'Testing Library'],
    color: 'blue',
    icon: Brain,
    isUnlocked: true,
    progress: 0,
    modules_list: []
  },
  {
    id: 'fullstack-development',
    title: 'Full-Stack Development',
    description: 'Build complete web applications with modern frontend and backend technologies.',
    difficulty: 'Advanced',
    duration: '20-25 hours',
    modules: 20,
    prerequisites: ['React Development Mastery'],
    learningOutcomes: [
      'Design and implement REST APIs',
      'Work with databases and ORMs',
      'Implement authentication and authorization',
      'Deploy applications to the cloud',
      'Monitor and maintain production apps',
      'Follow DevOps best practices'
    ],
    technologies: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker'],
    color: 'purple',
    icon: Server,
    isUnlocked: false,
    progress: 0,
    modules_list: []
  }
];

const interactiveTutorials: Tutorial[] = [
  {
    id: 'build-todo-app',
    title: 'Build a Complete Todo Application',
    description: 'Create a fully functional todo app with React, including add, edit, delete, and filter functionality.',
    difficulty: 'Beginner',
    duration: '90 mins',
    category: 'React Project',
    preview: 'Interactive todo list with local storage, drag and drop, and filtering capabilities.',
    features: ['React Hooks', 'Local Storage', 'Event Handling', 'Component Composition'],
    steps: [
      {
        id: 1,
        title: 'Project Setup and Component Structure',
        description: 'Set up the project structure and create the basic todo component.',
        code: `import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>My Todo List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Add a new todo..."
            />
            <Button>Add Todo</Button>
          </div>
          {/* Todo items will be added here */}
        </CardContent>
      </Card>
    </div>
  );
}`,
        explanation: 'We start by setting up the basic structure with TypeScript interfaces and state management.',
        tips: [
          'Always define TypeScript interfaces for your data structures',
          'Use functional components with hooks for modern React development',
          'Start with a simple structure and add complexity gradually'
        ],
        liveExample: () => <div className="text-center p-4 border rounded">Basic Todo App Structure</div>
      },
      {
        id: 2,
        title: 'Add Todo Functionality',
        description: 'Implement the ability to add new todos with validation.',
        code: `const addTodo = () => {
  if (inputValue.trim()) {
    const newTodo: Todo = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false,
      createdAt: new Date()
    };
    setTodos([...todos, newTodo]);
    setInputValue('');
  }
};

const handleKeyPress = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter') {
    addTodo();
  }
};

// Update the JSX
<div className="flex gap-2 mb-4">
  <Input 
    value={inputValue}
    onChange={(e) => setInputValue(e.target.value)}
    onKeyPress={handleKeyPress}
    placeholder="Add a new todo..."
  />
  <Button onClick={addTodo} disabled={!inputValue.trim()}>
    Add Todo
  </Button>
</div>`,
        explanation: 'We implement the addTodo function with input validation and keyboard support.',
        tips: [
          'Always validate user input before processing',
          'Use trim() to remove whitespace',
          'Add keyboard shortcuts for better UX'
        ],
        liveExample: () => {
          const [value, setValue] = useState('');
          return (
            <div className="flex gap-2 p-4 border rounded">
              <Input 
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Type and press Enter..."
              />
              <Button disabled={!value.trim()}>Add</Button>
            </div>
          );
        }
      }
    ],
    finalCode: `// Complete Todo App Implementation
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false,
        createdAt: new Date()
      };
      setTodos([...todos, newTodo]);
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

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>My Todo List ({todos.length} items)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="Add a new todo..."
            />
            <Button onClick={addTodo} disabled={!inputValue.trim()}>
              Add Todo
            </Button>
          </div>
          
          <div className="flex gap-2 mb-4">
            <Button 
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button 
              variant={filter === 'active' ? 'default' : 'outline'}
              onClick={() => setFilter('active')}
            >
              Active
            </Button>
            <Button 
              variant={filter === 'completed' ? 'default' : 'outline'}
              onClick={() => setFilter('completed')}
            >
              Completed
            </Button>
          </div>
          
          <div className="space-y-2">
            {filteredTodos.map(todo => (
              <div key={todo.id} className="flex items-center gap-2 p-2 border rounded">
                <Checkbox 
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id)}
                />
                <span className={todo.completed ? 'line-through text-gray-500 flex-1' : 'flex-1'}>
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
          
          {filteredTodos.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No todos found. Add one above!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}`,
    livePreview: TodoAppDemo
  },
  {
    id: 'react-form-handling',
    title: 'Advanced Form Handling in React',
    description: 'Learn to build complex forms with validation, error handling, and user feedback.',
    difficulty: 'Intermediate',
    duration: '75 mins',
    category: 'React Forms',
    preview: 'Complete form system with real-time validation, error states, and submission handling.',
    features: ['Form Validation', 'Error Handling', 'Real-time Feedback', 'Accessibility'],
    steps: [
      {
        id: 1,
        title: 'Form Structure and Basic State',
        description: 'Set up a comprehensive form with proper TypeScript typing.',
        code: `interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

export default function AdvancedForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Sign Up Form</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          {/* Form fields will go here */}
        </form>
      </CardContent>
    </Card>
  );
}`,
        explanation: 'We define TypeScript interfaces for form data and errors, then set up the basic component structure.',
        tips: [
          'Always type your form data and error states',
          'Separate concerns: data, errors, and submission state',
          'Use interfaces to ensure type safety'
        ]
      }
    ],
    finalCode: 'Complete form implementation with validation...',
    livePreview: FormDemo
  },
  {
    id: 'weather-api-app',
    title: 'Weather Dashboard with API Integration',
    description: 'Build a weather application that fetches data from external APIs with error handling.',
    difficulty: 'Intermediate',
    duration: '105 mins',
    category: 'API Integration',
    preview: 'Real-time weather dashboard with geolocation, search, and detailed forecasts.',
    features: ['API Integration', 'Geolocation', 'Error Handling', 'Loading States'],
    steps: [],
    finalCode: 'Complete weather app implementation...',
    livePreview: WeatherDemo
  }
];

const codingChallenges: Challenge[] = [
  {
    id: 'array-manipulation',
    title: 'Array Manipulation Challenge',
    description: 'Implement common array operations without using built-in methods.',
    difficulty: 'Beginner',
    points: 100,
    timeLimit: '30 mins',
    tasks: [
      'Implement a function to find the maximum value in an array',
      'Create a function to reverse an array without using reverse()',
      'Write a function to remove duplicates from an array'
    ],
    starterCode: `// Challenge: Array Manipulation
// Implement the following functions:

function findMax(arr) {
  // Your code here
}

function reverseArray(arr) {
  // Your code here
}

function removeDuplicates(arr) {
  // Your code here
}

// Test your functions
console.log(findMax([1, 5, 3, 9, 2])); // Should return 9
console.log(reverseArray([1, 2, 3, 4])); // Should return [4, 3, 2, 1]
console.log(removeDuplicates([1, 2, 2, 3, 3, 4])); // Should return [1, 2, 3, 4]`,
    solution: `function findMax(arr) {
  if (arr.length === 0) return undefined;
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}

function reverseArray(arr) {
  const reversed = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    reversed.push(arr[i]);
  }
  return reversed;
}

function removeDuplicates(arr) {
  const unique = [];
  for (let i = 0; i < arr.length; i++) {
    if (unique.indexOf(arr[i]) === -1) {
      unique.push(arr[i]);
    }
  }
  return unique;
}`,
    testCases: [
      'findMax([1, 5, 3, 9, 2]) === 9',
      'reverseArray([1, 2, 3, 4]).join(",") === "4,3,2,1"',
      'removeDuplicates([1, 2, 2, 3, 3, 4]).join(",") === "1,2,3,4"'
    ]
  },
  {
    id: 'react-component-challenge',
    title: 'Build a Reusable Modal Component',
    description: 'Create a flexible modal component with animations and keyboard support.',
    difficulty: 'Intermediate',
    points: 200,
    timeLimit: '45 mins',
    tasks: [
      'Create a modal component with open/close functionality',
      'Add keyboard support (ESC to close)',
      'Implement click-outside-to-close behavior',
      'Add fade-in/fade-out animations'
    ],
    starterCode: `import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // Implement modal functionality here
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        {children}
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  );
}

// Usage example
export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <div>
      <Button onClick={() => setIsModalOpen(true)}>
        Open Modal
      </Button>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Example Modal"
      >
        <p>This is the modal content!</p>
      </Modal>
    </div>
  );
}`,
    solution: `import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4 animate-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}`,
    testCases: [
      'Modal opens when button is clicked',
      'Modal closes when ESC key is pressed',
      'Modal closes when clicking outside',
      'Body scroll is disabled when modal is open'
    ]
  }
];

export default function Tutorials() {
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [userCode, setUserCode] = useState('');
  const { toast } = useToast();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500';
      case 'Intermediate': return 'bg-yellow-500';
      case 'Advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const startLearningPath = (path: LearningPath) => {
    setSelectedPath(path);
    toast({
      title: "Learning Path Started",
      description: `Welcome to ${path.title}! Let's begin your journey.`,
    });
  };

  const startModule = (module: Module) => {
    setSelectedModule(module);
    setUserCode(module.codeExample || '');
  };

  const startTutorial = (tutorial: Tutorial) => {
    setSelectedTutorial(tutorial);
    setCurrentStep(0);
    setUserCode(tutorial.steps[0]?.code || '');
    toast({
      title: "Tutorial Started",
      description: `Let's build: ${tutorial.title}`,
    });
  };

  const startChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setUserCode(challenge.starterCode);
    toast({
      title: "Challenge Started",
      description: `Time to code: ${challenge.title}`,
    });
  };

  const completeModule = (moduleId: string) => {
    if (selectedPath) {
      const updatedModules = selectedPath.modules_list.map(module =>
        module.id === moduleId ? { ...module, isCompleted: true } : module
      );
      setSelectedPath({ ...selectedPath, modules_list: updatedModules });
      toast({
        title: "Module Completed! 🎉",
        description: "Great job! Moving to the next module.",
      });
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code Copied!",
      description: "Code has been copied to your clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Interactive Learning Hub
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Master web development through hands-on tutorials, structured learning paths, and coding challenges. 
            Every tutorial includes live examples and production-ready code.
          </p>
        </div>

        <Tabs defaultValue="paths" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="paths" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Learning Paths
            </TabsTrigger>
            <TabsTrigger value="tutorials" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Interactive Tutorials
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Coding Challenges
            </TabsTrigger>
            <TabsTrigger value="playground" className="flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              Code Playground
            </TabsTrigger>
          </TabsList>

          {/* Learning Paths */}
          <TabsContent value="paths" className="mt-8">
            {!selectedPath ? (
              <div className="grid gap-6">
                {learningPaths.map((path, index) => (
                  <Card key={path.id} className={`bg-gray-900 border-${path.color}-400/30 hover:border-${path.color}-400/50 transition-all`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 bg-${path.color}-500/20 rounded-lg`}>
                            <path.icon className={`w-6 h-6 text-${path.color}-400`} />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-white">{path.title}</h3>
                            <Badge className={getDifficultyColor(path.difficulty)}>
                              {path.difficulty}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400">{path.duration}</p>
                          <p className="text-sm text-gray-400">{path.modules} modules</p>
                        </div>
                      </div>

                      <p className="text-gray-300 mb-4">{path.description}</p>

                      <div className="mb-4">
                        <h4 className="font-medium text-blue-400 mb-2">Learning Outcomes:</h4>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-1">
                          {path.learningOutcomes.map((outcome, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                              <CheckCircle className="w-3 h-3 text-green-400" />
                              {outcome}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium text-purple-400 mb-2">Technologies:</h4>
                        <div className="flex flex-wrap gap-2">
                          {path.technologies.map((tech, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {path.prerequisites.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-medium text-orange-400 mb-2">Prerequisites:</h4>
                          <div className="flex flex-wrap gap-2">
                            {path.prerequisites.map((prereq, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {prereq}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Progress value={path.progress} className="w-32" />
                          <span className="text-sm text-gray-400">{path.progress}% complete</span>
                        </div>
                        
                        {path.isUnlocked ? (
                          <Button onClick={() => startLearningPath(path)} className="flex items-center gap-2">
                            <PlayCircle className="w-4 h-4" />
                            Start Learning Path
                          </Button>
                        ) : (
                          <Button disabled className="flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            Locked
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              // Selected Learning Path Detail View
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <Button variant="outline" onClick={() => setSelectedPath(null)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Paths
                  </Button>
                  <h2 className="text-2xl font-bold">{selectedPath.title}</h2>
                </div>

                {!selectedModule ? (
                  <div className="grid gap-4">
                    {selectedPath.modules_list.map((module, index) => (
                      <Card key={module.id} className="bg-gray-900 border-blue-400/30">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  module.isCompleted ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-300'
                                }`}>
                                  {module.isCompleted ? <CheckCircle className="w-4 h-4" /> : index + 1}
                                </div>
                                <h3 className="text-lg font-semibold">{module.title}</h3>
                                <Badge variant="secondary">{module.type}</Badge>
                              </div>
                              <p className="text-gray-300 mb-3">{module.description}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {module.duration}
                                </span>
                              </div>
                            </div>
                            <Button onClick={() => startModule(module)}>
                              Start Module
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  // Module Detail View
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <Button variant="outline" onClick={() => setSelectedModule(null)}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Modules
                      </Button>
                      <h3 className="text-xl font-bold">{selectedModule.title}</h3>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                      <div>
                        <Card className="bg-gray-900 border-blue-400/30 mb-6">
                          <CardHeader>
                            <CardTitle>Module Content</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ScrollArea className="h-96">
                              <div className="prose prose-invert max-w-none">
                                {selectedModule.content.split('\n').map((line, i) => (
                                  <p key={i} className="mb-2">{line}</p>
                                ))}
                              </div>
                            </ScrollArea>
                          </CardContent>
                        </Card>

                        {selectedModule.exercise && (
                          <Card className="bg-gray-900 border-yellow-400/30">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <Target className="w-5 h-5 text-yellow-400" />
                                Exercise
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-gray-300">{selectedModule.exercise}</p>
                              <Button 
                                className="mt-4" 
                                onClick={() => completeModule(selectedModule.id)}
                              >
                                Mark as Complete
                              </Button>
                            </CardContent>
                          </Card>
                        )}
                      </div>

                      <div>
                        {selectedModule.codeExample && (
                          <Card className="bg-gray-900 border-green-400/30 mb-6">
                            <CardHeader>
                              <CardTitle className="flex items-center justify-between">
                                Code Example
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => copyCode(selectedModule.codeExample!)}
                                >
                                  <Copy className="w-4 h-4 mr-1" />
                                  Copy
                                </Button>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <CodePlayground 
                                initialCode={selectedModule.codeExample}
                                language="javascript"
                              />
                            </CardContent>
                          </Card>
                        )}

                        {selectedModule.liveDemo && (
                          <Card className="bg-gray-900 border-purple-400/30">
                            <CardHeader>
                              <CardTitle>Live Demo</CardTitle>
                            </CardHeader>
                            <CardContent>
                              {selectedModule.liveDemo()}
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Interactive Tutorials */}
          <TabsContent value="tutorials" className="mt-8">
            {!selectedTutorial ? (
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

                      <div className="flex items-center justify-between">
                        {tutorial.livePreview && (
                          <Button variant="outline" onClick={() => {
                            // Show live preview in a modal or expand
                          }}>
                            <Eye className="w-4 h-4 mr-2" />
                            Live Preview
                          </Button>
                        )}
                        <Button className="ml-auto" onClick={() => startTutorial(tutorial)}>
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Start Interactive Tutorial
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              // Tutorial Detail View
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <Button variant="outline" onClick={() => {setSelectedTutorial(null); setCurrentStep(0);}}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Tutorials
                  </Button>
                  <h2 className="text-2xl font-bold">{selectedTutorial.title}</h2>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    {/* Current Step */}
                    {selectedTutorial.steps[currentStep] && (
                      <Card className="bg-gray-900 border-blue-400/30 mb-6">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                              {selectedTutorial.steps[currentStep].id}
                            </div>
                            <CardTitle>{selectedTutorial.steps[currentStep].title}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-300 mb-4">{selectedTutorial.steps[currentStep].description}</p>
                          <p className="text-sm text-gray-400 mb-4">{selectedTutorial.steps[currentStep].explanation}</p>
                          
                          {selectedTutorial.steps[currentStep].tips.length > 0 && (
                            <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-400/30 rounded">
                              <h4 className="font-medium text-yellow-400 mb-2 flex items-center gap-2">
                                <Lightbulb className="w-4 h-4" />
                                Pro Tips
                              </h4>
                              <ul className="text-sm text-yellow-200 space-y-1">
                                {selectedTutorial.steps[currentStep].tips.map((tip, i) => (
                                  <li key={i}>• {tip}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {/* Live Preview */}
                    {selectedTutorial.livePreview && (
                      <Card className="bg-gray-900 border-purple-400/30">
                        <CardHeader>
                          <CardTitle>Final Result Preview</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {selectedTutorial.livePreview()}
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  <div>
                    {/* Code Editor */}
                    {selectedTutorial.steps[currentStep] && (
                      <Card className="bg-gray-900 border-green-400/30 mb-6">
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            Step Code
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => copyCode(selectedTutorial.steps[currentStep].code)}
                            >
                              <Copy className="w-4 h-4 mr-1" />
                              Copy
                            </Button>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CodePlayground 
                            initialCode={selectedTutorial.steps[currentStep].code}
                            language="javascript"
                          />
                        </CardContent>
                      </Card>
                    )}

                    {/* Live Example for Current Step */}
                    {selectedTutorial.steps[currentStep]?.liveExample && (
                      <Card className="bg-gray-900 border-orange-400/30">
                        <CardHeader>
                          <CardTitle>Step Example</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {selectedTutorial.steps[currentStep].liveExample()}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>

                {/* Tutorial Navigation */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-600 mt-8">
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
              </div>
            )}
          </TabsContent>

          {/* Coding Challenges */}
          <TabsContent value="challenges" className="mt-8">
            {!selectedChallenge ? (
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

                      <div className="flex items-center gap-4 mb-4">
                        <Badge className={getDifficultyColor(challenge.difficulty)}>
                          {challenge.difficulty}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-green-400" />
                          <span className="text-sm text-gray-300">{challenge.timeLimit}</span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium text-green-400 mb-2">Tasks:</h4>
                        <ul className="space-y-1">
                          {challenge.tasks.map((task, taskIndex) => (
                            <li key={taskIndex} className="flex items-start gap-2 text-sm text-gray-300">
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2" />
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button onClick={() => startChallenge(challenge)}>
                        <Zap className="w-4 h-4 mr-2" />
                        Start Challenge
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              // Challenge Detail View
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <Button variant="outline" onClick={() => setSelectedChallenge(null)}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Challenges
                  </Button>
                  <h2 className="text-2xl font-bold">{selectedChallenge.title}</h2>
                  <Badge className={getDifficultyColor(selectedChallenge.difficulty)}>
                    {selectedChallenge.difficulty}
                  </Badge>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <Card className="bg-gray-900 border-green-400/30 mb-6">
                      <CardHeader>
                        <CardTitle>Challenge Instructions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-300 mb-4">{selectedChallenge.description}</p>
                        
                        <div className="mb-4">
                          <h4 className="font-medium text-green-400 mb-2">Tasks to Complete:</h4>
                          <ul className="space-y-2">
                            {selectedChallenge.tasks.map((task, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <Checkbox />
                                <span className="text-sm text-gray-300">{task}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm text-gray-300">{selectedChallenge.timeLimit}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm text-gray-300">{selectedChallenge.points} points</span>
                          </div>
                        </div>

                        <Button 
                          variant="outline" 
                          onClick={() => {
                            // Show solution
                            setUserCode(selectedChallenge.solution);
                          }}
                        >
                          Show Solution
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-900 border-blue-400/30">
                      <CardHeader>
                        <CardTitle>Test Cases</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {selectedChallenge.testCases.map((testCase, i) => (
                            <li key={i} className="text-sm text-gray-300 font-mono bg-gray-800 p-2 rounded">
                              {testCase}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <Card className="bg-gray-900 border-yellow-400/30">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          Code Editor
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <RotateCcw className="w-4 h-4 mr-1" />
                              Reset
                            </Button>
                            <Button size="sm">
                              <PlayCircle className="w-4 h-4 mr-1" />
                              Test Code
                            </Button>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CodePlayground 
                          initialCode={userCode}
                          language="javascript"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Code Playground */}
          <TabsContent value="playground" className="mt-8">
            <Card className="bg-gray-900 border-purple-400/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-purple-400" />
                  Live Code Playground
                </CardTitle>
                <CardDescription>
                  Experiment with code in real-time. Try out concepts from tutorials and challenges.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodePlayground 
                  initialCode={`// Welcome to the Code Playground!
// Try writing some JavaScript here

function greet(name) {
  return \`Hello, \${name}! Welcome to the playground.\`;
}

console.log(greet("Developer"));

// Try creating a simple calculator
function add(a, b) {
  return a + b;
}

console.log("2 + 3 =", add(2, 3));`}
                  language="javascript"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}