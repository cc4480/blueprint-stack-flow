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

    // Create AbortController for request cancellation
    const abortController = new AbortController();
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    try {
      // Create comprehensive prompt for Lovable 2.0
      const fullPrompt = `Create a comprehensive production-ready application blueprint for the following requirements:

**PROJECT DESCRIPTION:**
${prompt}

**SELECTED FEATURES TO IMPLEMENT:**
${selectedFeatures.map(f => `- ${f}`).join('\n')}

**IMPORTANT INSTRUCTIONS:**
1. Generate a COMPLETE blueprint with MINIMUM 20,000 characters
2. Use Lovable's technology stack: React 18, TypeScript, Tailwind CSS, Vite, Shadcn/UI, Supabase
3. Include FULL code implementations, not snippets or placeholders
4. Provide detailed database schemas with all fields and relationships
5. Include complete authentication flows and API implementations
6. Add comprehensive error handling and edge case management
7. Provide production deployment configurations

Remember: This blueprint will be used to build a real production application on Lovable.dev, so be extremely thorough and detailed in every section.`;

      // Use the exact streaming implementation you provided
      const messages = [
        {
          role: "system",
          content: 'You are a Lovable 2.0 blueprint generation expert specialized in creating production-ready applications using React 18, Tailwind CSS, Vite, Shadcn/UI, and Supabase.'
        },
        {
          role: "user", 
          content: fullPrompt
        }
      ];

      const response = await fetch("/api/stream-blueprint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: fullPrompt,
          temperature: 0.7,
          systemPrompt: 'You are a Lovable 2.0 blueprint generation expert specialized in creating production-ready applications using React 18, Tailwind CSS, Vite, Shadcn/UI, and Supabase.'
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers.get('content-type'));

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      if (!response.body) throw new Error("No response stream");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      let accumulatedContent = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log('Stream reading completed');
          break;
        }
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i].trim();
          if (line === '') continue; // Skip empty lines
          
          if (line.startsWith('data:')) {
            const jsonData = line.slice(5).trim();
            
            if (jsonData === '[DONE]') {
              console.log('Received [DONE] signal');
              continue;
            }
            
            try {
              const data = JSON.parse(jsonData);
              
              if (data.type === 'token' && data.content) {
                accumulatedContent += data.content;
                setGeneratedBlueprint(accumulatedContent);
                const percentage = Math.min(Math.round((accumulatedContent.length / 20000) * 100), 100);
                setStreamProgress(`Generating comprehensive blueprint... ${accumulatedContent.length.toLocaleString()} characters (${percentage}%)`);
              } else if (data.type === 'complete') {
                const finalContent = data.content || accumulatedContent;
                const finalLength = finalContent.length;
                
                setGeneratedBlueprint(finalContent);
                setStreamProgress(`✅ Blueprint completed! Generated ${finalLength.toLocaleString()} characters`);
                console.log(`✅ Blueprint generation completed with ${finalLength.toLocaleString()} characters`);
                
                // Save to database if blueprint is substantial
                if (finalLength > 15000) {
                  fetch('/api/blueprint-prompts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      name: `Lovable Blueprint - ${new Date().toLocaleDateString()}`,
                      prompt: prompt,
                      generatedBlueprint: finalContent,
                      features: selectedFeatures,
                      metadata: {
                        characterCount: finalLength,
                        generatedAt: new Date().toISOString()
                      }
                    })
                  }).then(() => console.log('✅ Blueprint saved to database'))
                    .catch(err => console.error('Failed to save blueprint:', err));
                }
                
                setIsStreaming(false);
                return;
              } else if (data.type === 'error') {
                setStreamProgress(`❌ Error: ${data.error}`);
                setIsStreaming(false);
                throw new Error(data.error);
              }
            } catch (parseError) {
              console.error('Failed to parse streaming data:', parseError, 'Line:', line);
            }
          }
        }
        
        buffer = lines[lines.length - 1];
      }
    } catch (error) {
      console.error('Streaming generation failed:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        setGeneratedBlueprint('Blueprint generation was cancelled due to timeout.');
        setStreamProgress('❌ Generation cancelled (timeout)');
      } else {
        setGeneratedBlueprint('Failed to generate blueprint. Please check your connection and try again.');
        setStreamProgress('❌ Generation failed');
      }
    } finally {
      // Cleanup
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      setIsGenerating(false);
      setIsStreaming(false);
    }
  };

  return (
    <section id="interactive-demo" className="relative min-h-screen bg-black text-white overflow-hidden py-20">
      {/* Background Animation - matching hero section */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%224%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-red-500/20 rounded-full border border-blue-400/30 font-medium mb-8 backdrop-blur-sm">
            <Sparkles className="h-5 w-5 text-blue-400" />
            <span className="text-gray-200">Interactive Blueprint Generator</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 bg-clip-text text-transparent">
              Lovable 2.0 Blueprint Generator
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Generate production-ready application blueprints using <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text font-bold">Lovable's proven technology stack</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Lovable Stack Overview */}
          <div className="space-y-6">
            <Card className="relative bg-black/50 border-2 border-blue-400/30 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-red-500/10 rounded-lg"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Code className="h-5 w-5 text-blue-400" />
                  Lovable 2.0 Technology Stack
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Pre-configured stack optimized for rapid development and deployment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-blue-500/20 to-blue-600/30 rounded-lg border border-blue-400/30 backdrop-blur-sm">
                    <div className="font-semibold text-blue-300 mb-2">Frontend</div>
                    <div className="text-sm space-y-1 text-gray-300">
                      <div>React 18 + TypeScript</div>
                      <div>Tailwind CSS + Shadcn/UI</div>
                      <div>Vite Build Tool</div>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-green-500/20 to-green-600/30 rounded-lg border border-green-400/30 backdrop-blur-sm">
                    <div className="font-semibold text-green-300 mb-2">Backend</div>
                    <div className="text-sm space-y-1 text-gray-300">
                      <div>Supabase Platform</div>
                      <div>PostgreSQL Database</div>
                      <div>Real-time Features</div>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-500/20 to-purple-600/30 rounded-lg border border-purple-400/30 backdrop-blur-sm">
                    <div className="font-semibold text-purple-300 mb-2">AI & Services</div>
                    <div className="text-sm space-y-1 text-gray-300">
                      <div>Claude 4 Sonnet</div>
                      <div>Stripe Payments</div>
                      <div>Resend Email</div>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-orange-500/20 to-orange-600/30 rounded-lg border border-orange-400/30 backdrop-blur-sm">
                    <div className="font-semibold text-orange-300 mb-2">Deployment</div>
                    <div className="text-sm space-y-1 text-gray-300">
                      <div>Vercel/Netlify Hosting</div>
                      <div>Entri Domains</div>
                      <div>GitHub Integration</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Features Selection */}
            <Card className="relative bg-black/50 border-2 border-purple-400/30 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-green-500/10 rounded-lg"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  Advanced Features
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Select the features you want to include in your application
                </CardDescription>
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox 
                    id="select-all" 
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                    className="border-blue-400/50 data-[state=checked]:bg-blue-500"
                  />
                  <label htmlFor="select-all" className="text-sm font-medium text-gray-200">
                    Select All Features
                  </label>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ADVANCED_FEATURES.map((feature) => (
                    <div key={feature.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-blue-500/10 border border-transparent hover:border-blue-400/30 transition-all duration-200 backdrop-blur-sm">
                      <Checkbox
                        id={feature.id}
                        checked={selectedFeatures.includes(feature.id)}
                        onCheckedChange={() => handleFeatureToggle(feature.id)}
                        className="border-blue-400/50 data-[state=checked]:bg-blue-500"
                      />
                      <div className="flex-1">
                        <label htmlFor={feature.id} className="text-sm font-medium cursor-pointer text-gray-200">
                          {feature.name}
                        </label>
                        <p className="text-xs text-gray-400 mt-1">
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
            <Card className="relative bg-black/50 border-2 border-green-400/30 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 rounded-lg"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Brain className="h-5 w-5 text-green-400" />
                  Describe Your Vision
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Tell us about the application you want to build. Be as detailed as possible.
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <Textarea
                  placeholder="Describe your application idea in detail... Be specific about features, user workflows, and functionality. The more detailed your description, the more comprehensive your blueprint will be. For example: 'A social media platform for photographers with portfolio galleries, image editing tools, and collaboration features. Users should be able to upload photos, create albums, follow other photographers, and sell prints. Include admin dashboard, analytics, payment processing, and mobile responsiveness.'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[250px] resize-none bg-black/30 border-gray-600/50 text-gray-200 placeholder:text-gray-400 focus:border-blue-400/50 focus:ring-blue-400/20"
                />
                <div className="mt-2 text-xs text-gray-400">
                  💡 Tip: Provide detailed descriptions to generate comprehensive 20,000+ character blueprints tailored for Lovable
                </div>
                <Button 
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="relative w-full mt-4 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 hover:from-blue-600 hover:via-purple-600 hover:to-red-600 text-white px-8 py-6 text-lg font-bold rounded-full border border-blue-300/30 transition-all duration-300 transform hover:scale-105"
                  style={{
                    boxShadow: '0 0 30px rgba(59, 130, 246, 0.4), 0 0 60px rgba(147, 51, 234, 0.2)'
                  }}
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
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-400/30 backdrop-blur-sm">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {isStreaming && <Loader2 className="h-4 w-4 animate-spin text-blue-400" />}
                        <span className="text-sm text-blue-300 font-medium">
                          {streamProgress || 'Preparing blueprint generation...'}
                        </span>
                      </div>
                      {generatedBlueprint.length > 0 && (
                        <span className="text-xs text-blue-200 font-mono">
                          {generatedBlueprint.length.toLocaleString()} chars
                        </span>
                      )}
                    </div>
                    {generatedBlueprint.length > 0 && (
                      <div className="mt-2 w-full bg-blue-900/30 rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300"
                          style={{ width: `${Math.min((generatedBlueprint.length / 20000) * 100, 100)}%` }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Generated Blueprint */}
            {generatedBlueprint && (
              <Card className="relative bg-black/50 border-2 border-green-400/30 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 rounded-lg"></div>
                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Sparkles className="h-5 w-5 text-green-400" />
                    Generated Blueprint
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Your production-ready Lovable application blueprint
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="bg-black/30 border border-gray-600/50 p-6 rounded-lg max-h-[600px] overflow-y-auto backdrop-blur-sm">
                    <div className="mb-3 text-sm text-gray-400">
                      Blueprint Length: {generatedBlueprint.length.toLocaleString()} characters
                    </div>
                    <pre className="whitespace-pre-wrap text-sm text-gray-200 font-mono leading-relaxed">
                      {generatedBlueprint}
                    </pre>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => navigator.clipboard.writeText(generatedBlueprint)}
                      size="sm"
                      className="border-blue-400/50 text-blue-300 hover:bg-blue-500/10 hover:border-blue-400 backdrop-blur-sm"
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
                      className="border-green-400/50 text-green-300 hover:bg-green-500/10 hover:border-green-400 backdrop-blur-sm"
                    >
                      Download
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        window.open('https://lovable.dev', '_blank');
                      }}
                      size="sm"
                      className="border-purple-400/50 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 backdrop-blur-sm"
                    >
                      Use in Lovable
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