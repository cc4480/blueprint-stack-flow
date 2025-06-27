import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Sparkles, Loader2, Brain, Code, Database, Palette, Zap } from 'lucide-react';
import { promptService, type PromptGenerationRequest } from '../services/promptService';
import { analytics } from '../services/analyticsService';

// Lovable 2.0 Fixed Technology Stack
const LOVABLE_STACK = {
  frontend: {
    framework: "React 18",
    styling: "Tailwind CSS",
    build: "Vite",
    components: "Shadcn/UI",
    icons: "Lucide React"
  },
  backend: {
    service: "Supabase",
    database: "PostgreSQL",
    auth: "Supabase Auth",
    storage: "Supabase Storage",
    realtime: "Supabase Realtime"
  },
  integrations: {
    ai: "Claude 3.5 Sonnet",
    payments: "Stripe",
    email: "Resend",
    media: "Replicate",
    domains: "Entri",
    deployment: "Vercel/Netlify"
  }
};

// Advanced Features for Lovable Applications
const ADVANCED_FEATURES = [
  { id: 'auth', name: 'User Authentication & Authorization', description: 'Complete auth system with Supabase Auth' },
  { id: 'database', name: 'PostgreSQL Database', description: 'Full database schema with relationships' },
  { id: 'realtime', name: 'Real-time Features', description: 'Live updates with Supabase Realtime' },
  { id: 'ai', name: 'AI Integration', description: 'Claude 3.5 Sonnet AI capabilities' },
  { id: 'payments', name: 'Payment Processing', description: 'Stripe integration for transactions' },
  { id: 'email', name: 'Email Services', description: 'Transactional emails with Resend' },
  { id: 'file-upload', name: 'File Storage', description: 'Secure file uploads with Supabase Storage' },
  { id: 'search', name: 'Full-Text Search', description: 'PostgreSQL full-text search capabilities' },
  { id: 'analytics', name: 'Analytics Dashboard', description: 'Custom analytics and metrics tracking' },
  { id: 'responsive', name: 'Responsive Design', description: 'Mobile-first responsive layouts' },
  { id: 'seo', name: 'SEO Optimization', description: 'Search engine optimization features' },
  { id: 'pwa', name: 'Progressive Web App', description: 'PWA capabilities with offline support' }
];

export default function InteractiveDemo() {
  const [prompt, setPrompt] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [generatedBlueprint, setGeneratedBlueprint] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [streamProgress, setStreamProgress] = useState('');

  const handleFeatureToggle = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedFeatures([]);
    } else {
      setSelectedFeatures(ADVANCED_FEATURES.map(f => f.id));
    }
    setSelectAll(!selectAll);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setIsStreaming(true);
    setGeneratedBlueprint('');
    setStreamProgress('Initializing Lovable 2.0 blueprint generation...');
    analytics.trackPromptGeneration('lovable-app', selectedFeatures);

    try {
      // Create comprehensive prompt for Lovable 2.0
      const fullPrompt = `Generate a comprehensive Lovable 2.0 application blueprint for:

${prompt}

**Selected Features:** ${selectedFeatures.join(', ')}

**Requirements:**
- Use only Lovable's fixed technology stack (React 18, Tailwind CSS, Vite, Shadcn/UI, Supabase)
- Include complete code examples and database schemas
- Provide detailed implementation instructions
- Ensure production-ready architecture
- Include deployment and hosting configurations`;

      const response = await fetch('/api/stream-blueprint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: fullPrompt,
          temperature: 0.7,
          systemPrompt: 'You are a Lovable 2.0 blueprint generation expert specialized in creating production-ready applications using React 18, Tailwind CSS, Vite, Shadcn/UI, and Supabase.'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response stream available');
      }

      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim();
          if (line.startsWith('data:')) {
            try {
              const data = JSON.parse(line.slice(5));
              
              if (data.type === 'token') {
                setGeneratedBlueprint(data.fullContent);
                setStreamProgress(`Generating blueprint... ${data.fullContent.length} characters`);
              } else if (data.type === 'complete') {
                setGeneratedBlueprint(data.content);
                setStreamProgress(`✅ Blueprint completed! ${data.tokens} tokens in ${data.processingTime}ms`);
                setIsStreaming(false);
                console.log(`✅ Blueprint generation completed in ${data.processingTime}ms`);
                break;
              } else if (data.type === 'error') {
                setStreamProgress(`❌ Error: ${data.error}`);
                throw new Error(data.error);
              }
            } catch (parseError) {
              console.warn('Failed to parse streaming data:', parseError);
            }
          }
        }
        
        buffer = lines[lines.length - 1];
      }
    } catch (error) {
      console.error('Streaming generation failed:', error);
      setGeneratedBlueprint('Failed to generate blueprint. Please check your connection and try again.');
      setStreamProgress('❌ Generation failed');
    } finally {
      setIsGenerating(false);
      setIsStreaming(false);
    }
  };

  return (
    <section id="interactive-demo" className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Lovable 2.0 Blueprint Generator
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Generate production-ready application blueprints using Lovable's proven technology stack
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Lovable Stack Overview */}
          <div className="space-y-6">
            <Card className="border-2 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-purple-600" />
                  Lovable 2.0 Technology Stack
                </CardTitle>
                <CardDescription>
                  Pre-configured stack optimized for rapid development and deployment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="font-medium text-blue-700 dark:text-blue-300 mb-1">Frontend</div>
                    <div className="text-sm space-y-1">
                      <div>React 18 + TypeScript</div>
                      <div>Tailwind CSS + Shadcn/UI</div>
                      <div>Vite Build Tool</div>
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="font-medium text-green-700 dark:text-green-300 mb-1">Backend</div>
                    <div className="text-sm space-y-1">
                      <div>Supabase Platform</div>
                      <div>PostgreSQL Database</div>
                      <div>Real-time Features</div>
                    </div>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="font-medium text-purple-700 dark:text-purple-300 mb-1">AI & Services</div>
                    <div className="text-sm space-y-1">
                      <div>Claude 3.5 Sonnet</div>
                      <div>Stripe Payments</div>
                      <div>Resend Email</div>
                    </div>
                  </div>
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="font-medium text-orange-700 dark:text-orange-300 mb-1">Deployment</div>
                    <div className="text-sm space-y-1">
                      <div>Vercel/Netlify Hosting</div>
                      <div>Entri Domains</div>
                      <div>GitHub Integration</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Features Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  Advanced Features
                </CardTitle>
                <CardDescription>
                  Select the features you want to include in your application
                </CardDescription>
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox 
                    id="select-all" 
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                  />
                  <label htmlFor="select-all" className="text-sm font-medium">
                    Select All Features
                  </label>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ADVANCED_FEATURES.map((feature) => (
                    <div key={feature.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <Checkbox
                        id={feature.id}
                        checked={selectedFeatures.includes(feature.id)}
                        onCheckedChange={() => handleFeatureToggle(feature.id)}
                      />
                      <div className="flex-1">
                        <label htmlFor={feature.id} className="text-sm font-medium cursor-pointer">
                          {feature.name}
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Prompt Input and Generation */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  Describe Your Vision
                </CardTitle>
                <CardDescription>
                  Tell us about the application you want to build. Be as detailed as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Describe your application idea... For example: 'A social media platform for photographers with portfolio galleries, image editing tools, and collaboration features. Users should be able to upload photos, create albums, follow other photographers, and sell prints.'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[200px] resize-none"
                />
                <Button 
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isStreaming ? 'Streaming Blueprint...' : 'Generating Blueprint...'}
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Lovable Blueprint
                    </>
                  )}
                </Button>
                
                {/* Streaming Progress */}
                {(isGenerating || streamProgress) && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      {isStreaming && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
                      <span className="text-sm text-blue-700 dark:text-blue-300">
                        {streamProgress || 'Preparing blueprint generation...'}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Generated Blueprint */}
            {generatedBlueprint && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-green-600" />
                    Generated Blueprint
                  </CardTitle>
                  <CardDescription>
                    Your production-ready Lovable application blueprint
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">
                      {generatedBlueprint}
                    </pre>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => navigator.clipboard.writeText(generatedBlueprint)}
                      size="sm"
                    >
                      Copy Blueprint
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        const blob = new Blob([generatedBlueprint], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'lovable-blueprint.txt';
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      size="sm"
                    >
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}