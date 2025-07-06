import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BookOpen, 
  Play, 
  Code, 
  Clock, 
  CheckCircle, 
  ExternalLink,
  Copy,
  X
} from 'lucide-react';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  duration: string;
  content: string;
  code_examples: Array<{
    title: string;
    code: string;
  }>;
  key_features: string[];
  learning_objectives: string[];
  technology: string;
  estimated_minutes: number;
}

interface TutorialResource {
  id: string;
  title: string;
  type: string;
  url: string;
  description: string;
}

interface TutorialModule {
  id: string;
  title: string;
  description: string;
  content: string;
  code_example: string;
  order: number;
  duration: string;
  is_completed: boolean;
}

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  tutorialId: string | null;
}

const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose, tutorialId }) => {
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [resources, setResources] = useState<TutorialResource[]>([]);
  const [modules, setModules] = useState<TutorialModule[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentModule, setCurrentModule] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (tutorialId && isOpen) {
      fetchTutorialDetails();
    }
  }, [tutorialId, isOpen]);

  const fetchTutorialDetails = async () => {
    if (!tutorialId) return;

    setLoading(true);
    try {
      const [tutorialRes, resourcesRes, modulesRes] = await Promise.all([
        fetch(`/api/tutorials/${tutorialId}`),
        fetch(`/api/tutorial-resources/${tutorialId}`),
        fetch(`/api/tutorial-modules?tutorialId=${tutorialId}`)
      ]);

      const tutorialData = await tutorialRes.json();
      const resourcesData = await resourcesRes.json();
      const modulesData = await modulesRes.json();

      setTutorial(tutorialData);
      setResources(resourcesData);
      setModules(modulesData);

      // Calculate progress
      const completedModules = modulesData.filter((m: TutorialModule) => m.is_completed).length;
      const progressPercent = modulesData.length > 0 ? (completedModules / modulesData.length) * 100 : 0;
      setProgress(progressPercent);
    } catch (error) {
      console.error('Error fetching tutorial details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    // You could add a toast notification here
  };

  const handleCompleteModule = async (moduleId: string) => {
    try {
      await fetch(`/api/tutorial-modules/${moduleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_completed: true })
      });
      
      // Refresh data
      fetchTutorialDetails();
    } catch (error) {
      console.error('Error completing module:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!tutorial) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <DialogTitle className="text-2xl text-blue-300">{tutorial.title}</DialogTitle>
              <div className="flex gap-2">
                <Badge className={getDifficultyColor(tutorial.difficulty)}>
                  {tutorial.difficulty}
                </Badge>
                <Badge variant="secondary">{tutorial.technology}</Badge>
                <Badge variant="outline" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {tutorial.estimated_minutes} mins
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Progress</span>
              <span className="text-gray-300">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full h-2" />
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-gray-800">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="modules">Modules</TabsTrigger>
              <TabsTrigger value="code">Code Examples</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="objectives">Objectives</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-300">Tutorial Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">{tutorial.content}</p>
                </CardContent>
              </Card>

              {tutorial.key_features && tutorial.key_features.length > 0 && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-300">Key Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {tutorial.key_features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="modules" className="space-y-4">
              {modules.length > 0 ? (
                modules.map((module, index) => (
                  <Card key={module.id} className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg text-blue-300 flex items-center gap-2">
                            {module.is_completed ? (
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-gray-500" />
                            )}
                            {module.title}
                          </CardTitle>
                          <p className="text-sm text-gray-400 mt-1">{module.duration}</p>
                        </div>
                        {!module.is_completed && (
                          <Button 
                            size="sm" 
                            onClick={() => handleCompleteModule(module.id)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-gray-300">{module.content}</p>
                      {module.code_example && (
                        <div className="bg-gray-900 rounded-lg p-4 relative">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute top-2 right-2"
                            onClick={() => handleCopyCode(module.code_example)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <pre className="text-sm text-gray-300 overflow-x-auto">
                            <code>{module.code_example}</code>
                          </pre>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-gray-400 text-center py-8">No modules available for this tutorial.</p>
              )}
            </TabsContent>

            <TabsContent value="code" className="space-y-4">
              {tutorial.code_examples && tutorial.code_examples.length > 0 ? (
                tutorial.code_examples.map((example, index) => (
                  <Card key={index} className="bg-gray-800 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-lg text-blue-300">{example.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-900 rounded-lg p-4 relative">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2"
                          onClick={() => handleCopyCode(example.code)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <pre className="text-sm text-gray-300 overflow-x-auto">
                          <code>{example.code}</code>
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-gray-400 text-center py-8">No code examples available for this tutorial.</p>
              )}
            </TabsContent>

            <TabsContent value="resources" className="space-y-4">
              {resources.length > 0 ? (
                resources.map((resource) => (
                  <Card key={resource.id} className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h3 className="text-lg font-medium text-blue-300">{resource.title}</h3>
                          <p className="text-gray-400 text-sm">{resource.description}</p>
                          <Badge variant="outline" className="text-xs">
                            {resource.type}
                          </Badge>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.open(resource.url, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Open
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-gray-400 text-center py-8">No resources available for this tutorial.</p>
              )}
            </TabsContent>

            <TabsContent value="objectives" className="space-y-4">
              {tutorial.learning_objectives && tutorial.learning_objectives.length > 0 ? (
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-300">Learning Objectives</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {tutorial.learning_objectives.map((objective, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                          {objective}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ) : (
                <p className="text-gray-400 text-center py-8">No learning objectives defined for this tutorial.</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TutorialModal;