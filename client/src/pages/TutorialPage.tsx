import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TutorialModal from '@/components/TutorialModal';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Award, 
  Play, 
  CheckCircle,
  ArrowRight,
  Code,
  ExternalLink,
  Star
} from 'lucide-react';

interface TutorialCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  slug: string;
  order: number;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  module_count: number;
  category_id: string;
  slug: string;
  is_active: boolean;
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  duration: string;
  technology: string;
  category_id: string;
  slug: string;
  estimated_minutes: number;
  key_features: string[];
  learning_objectives: string[];
}

const TutorialPage = () => {
  const [categories, setCategories] = useState<TutorialCategory[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [selectedLearningPath, setSelectedLearningPath] = useState<string | null>(null);
  const [selectedTutorial, setSelectedTutorial] = useState<string | null>(null);
  const [isTutorialModalOpen, setIsTutorialModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesRes, pathsRes, tutorialsRes] = await Promise.all([
          fetch('/api/tutorial-categories'),
          fetch('/api/learning-paths'),
          fetch('/api/tutorials')
        ]);

        const categoriesData = await categoriesRes.json();
        const pathsData = await pathsRes.json();
        const tutorialsData = await tutorialsRes.json();

        setCategories(categoriesData);
        setLearningPaths(pathsData);
        setTutorials(tutorialsData);
      } catch (error) {
        console.error('Error fetching tutorial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPaths = selectedCategory === 'all' 
    ? learningPaths 
    : learningPaths.filter(path => path.category_id === selectedCategory);

  const filteredTutorials = selectedCategory === 'all'
    ? tutorials
    : tutorials.filter(tutorial => tutorial.category_id === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'interactive': return <Play className="w-4 h-4" />;
      case 'deep_dive': return <BookOpen className="w-4 h-4" />;
      case 'project_based': return <Code className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const handleStartLearningPath = async (pathId: string) => {
    try {
      setSelectedLearningPath(pathId);
      // Here you could navigate to a dedicated learning path page
      // or show a modal with the path content
      console.log('Starting learning path:', pathId);
      
      // Example: Create user progress entry
      const response = await fetch('/api/user-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1, // This would come from auth context
          learningPathId: pathId,
          progress: 0,
          status: 'started'
        })
      });
      
      if (response.ok) {
        alert('Learning path started! Check your progress in the dashboard.');
      }
    } catch (error) {
      console.error('Error starting learning path:', error);
    }
  };

  const handleStartTutorial = async (tutorialId: string) => {
    try {
      setSelectedTutorial(tutorialId);
      setIsTutorialModalOpen(true);
      
      // Example: Create user progress entry
      const response = await fetch('/api/user-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1, // This would come from auth context
          tutorialId: tutorialId,
          progress: 0,
          status: 'started'
        })
      });
    } catch (error) {
      console.error('Error starting tutorial:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white pt-24 pb-6 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading tutorial system...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-6 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold gradient-logo-text mb-6">
            Complete Framework Documentation
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            Your one-stop educational resource for modern web development. Learn every framework, 
            understand architectural patterns, and master the complete NoCodeLos Blueprint Stack.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('all')}
            className="border-blue-400/50 text-blue-300 hover:bg-blue-900/20"
          >
            All Categories
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id)}
              className="border-blue-400/50 text-blue-300 hover:bg-blue-900/20"
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>

        <Tabs defaultValue="learning-paths" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900 border border-gray-700">
            <TabsTrigger value="overview" className="text-gray-300">Overview</TabsTrigger>
            <TabsTrigger value="learning-paths" className="text-gray-300">Learning Paths</TabsTrigger>
            <TabsTrigger value="tutorials" className="text-gray-300">Tutorials</TabsTrigger>
            <TabsTrigger value="architecture" className="text-gray-300">Architecture</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Card key={category.id} className="bg-gray-900 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <span className="text-2xl">{category.icon}</span>
                      <span className="text-blue-300">{category.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 mb-4">{category.description}</p>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        {learningPaths.filter(p => p.categoryId === category.id).length} Paths
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {tutorials.filter(t => t.categoryId === category.id).length} Tutorials
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="learning-paths" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPaths.map((path) => (
                <Card key={path.id} className="bg-gray-900 border-gray-700 hover:border-blue-400/50 transition-colors">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={getDifficultyColor(path.difficulty)}>
                        {path.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        {path.duration}
                      </div>
                    </div>
                    <CardTitle className="text-xl text-blue-300">{path.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-400">{path.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {path.module_count} modules
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        Beginner
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-gray-400">0%</span>
                      </div>
                      <Progress value={0} className="w-full h-2" />
                    </div>

                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleStartLearningPath(path.id)}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Learning Path
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tutorials" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTutorials.map((tutorial) => (
                <Card key={tutorial.id} className="bg-gray-900 border-gray-700 hover:border-blue-400/50 transition-colors">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex gap-2">
                        <Badge className={getDifficultyColor(tutorial.difficulty)}>
                          {tutorial.difficulty}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {getTypeIcon(tutorial.type)}
                          <span className="ml-1">{tutorial.type.replace('_', ' ')}</span>
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        {tutorial.duration}
                      </div>
                    </div>
                    <CardTitle className="text-xl text-blue-300">{tutorial.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-400">{tutorial.description}</p>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {tutorial.technology}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {tutorial.estimated_minutes} mins
                      </Badge>
                    </div>

                    {tutorial.key_features && tutorial.key_features.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-300">Key Features:</h4>
                        <div className="flex flex-wrap gap-1">
                          {tutorial.key_features.slice(0, 3).map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {tutorial.key_features.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{tutorial.key_features.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => handleStartTutorial(tutorial.id)}
                    >
                      {getTypeIcon(tutorial.type)}
                      <span className="ml-2">Start {tutorial.type === 'interactive' ? 'Interactive' : ''} Tutorial</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="architecture" className="space-y-6">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-300">Framework Architecture Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-green-300">Frontend Frameworks</h3>
                    <ul className="space-y-2 text-gray-400">
                      <li>• React 18 + TypeScript</li>
                      <li>• Vue.js 3 + Composition API</li>
                      <li>• Angular 17 + RxJS</li>
                      <li>• Svelte/SvelteKit</li>
                      <li>• Next.js 14</li>
                      <li>• Nuxt.js 3</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-blue-300">Backend Technologies</h3>
                    <ul className="space-y-2 text-gray-400">
                      <li>• Node.js + Express</li>
                      <li>• Python + FastAPI</li>
                      <li>• Rust + Actix/Axum</li>
                      <li>• Go + Gin/Echo</li>
                      <li>• PHP + Laravel</li>
                      <li>• Java + Spring Boot</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-purple-300">Database & Tools</h3>
                    <ul className="space-y-2 text-gray-400">
                      <li>• PostgreSQL + Drizzle ORM</li>
                      <li>• MongoDB + Mongoose</li>
                      <li>• Redis for Caching</li>
                      <li>• Docker + Kubernetes</li>
                      <li>• AWS/Vercel/Netlify</li>
                      <li>• CI/CD with GitHub Actions</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-8 p-6 bg-gray-800 rounded-lg border border-gray-600">
                  <h3 className="text-lg font-semibold text-yellow-300 mb-4">Learning Path Recommendations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-300">For Absolute Beginners:</h4>
                      <p className="text-sm text-gray-400">Start with Web Development Fundamentals → React Basics → Backend API Development</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-300">For Experienced Developers:</h4>
                      <p className="text-sm text-gray-400">Jump to Framework Deep Dives → Advanced Patterns → Production Deployment</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Tutorial Modal */}
      <TutorialModal
        isOpen={isTutorialModalOpen}
        onClose={() => setIsTutorialModalOpen(false)}
        tutorialId={selectedTutorial}
      />
    </div>
  );
};

export default TutorialPage;