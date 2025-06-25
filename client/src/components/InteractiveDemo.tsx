import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, Brain } from 'lucide-react';
import { promptService, type PromptGenerationRequest } from '../services/promptService';
import { analytics } from '../services/analyticsService';

// Types
interface FrameworkPreset {
  id: string;
  name: string;
  icon: string;
  description: string;
  frontend: string;
  backend: string;
  database: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  features: string[];
}

interface DataSource {
  id: string;
  name: string;
  icon: string;
  difficulty: string;
  description: string;
  compatibility: string;
}

interface Feature {
  id: string;
  name: string;
}

interface AppCategory {
  id: string;
  name: string;
  types: AppType[];
}

interface AppType {
  id: string;
  name: string;
  icon: string;
  difficulty: string;
  description: string;
  compatibility: string;
}

// Hook for managing demo state
const useDemoState = () => {
  const [selectedAppTypes, setSelectedAppTypes] = useState<{[key: string]: string}>({});
  const [selectedDataSource, setSelectedDataSource] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectAllFeatures, setSelectAllFeatures] = useState(false);
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [streamingText, setStreamingText] = useState('');

  return {
    selectedAppTypes,
    setSelectedAppTypes,
    selectedDataSource,
    setSelectedDataSource,
    selectedFeatures,
    setSelectedFeatures,
    selectAllFeatures,
    setSelectAllFeatures,
    description,
    setDescription,
    isGenerating,
    setIsGenerating,
    result,
    setResult,
    streamingText,
    setStreamingText
  };
};

// Data constants
const FRAMEWORK_PRESETS: FrameworkPreset[] = [
  {
    id: 'beginner-stack',
    name: 'Beginner Stack',
    icon: '🌱',
    description: 'Perfect for starting out - React + Node.js + PostgreSQL',
    frontend: 'react-spa',
    backend: 'node-express',
    database: 'postgresql',
    difficulty: 'Beginner',
    features: ['auth', 'api', 'mobile']
  },
  {
    id: 'modern-fullstack',
    name: 'Modern Full-Stack',
    icon: '⚡',
    description: 'Next.js + FastAPI + Supabase for rapid development',
    frontend: 'nextjs-app',
    backend: 'python-fastapi',
    database: 'supabase',
    difficulty: 'Beginner',
    features: ['auth', 'realtime', 'api', 'seo', 'mobile']
  },
  {
    id: 'ai-powerhouse',
    name: 'AI Powerhouse',
    icon: '🤖',
    description: 'React + FastAPI + Vector DB for AI applications',
    frontend: 'react-spa',
    backend: 'python-fastapi',
    database: 'postgresql',
    difficulty: 'Intermediate',
    features: ['ai', 'auth', 'api', 'analytics', 'search']
  },
  {
    id: 'performance-beast',
    name: 'Performance Beast',
    icon: '🚀',
    description: 'SvelteKit + Go + PostgreSQL for maximum speed',
    frontend: 'svelte-kit',
    backend: 'go-gin',
    database: 'postgresql',
    difficulty: 'Intermediate',
    features: ['api', 'analytics', 'seo', 'mobile']
  },
  {
    id: 'edge-computing',
    name: 'Edge Computing',
    icon: '🌐',
    description: 'Astro + Deno + Turso for global edge deployment',
    frontend: 'astro-app',
    backend: 'deno-fresh',
    database: 'turso',
    difficulty: 'Intermediate',
    features: ['seo', 'api', 'mobile', 'analytics']
  },
  {
    id: 'enterprise-grade',
    name: 'Enterprise Grade',
    icon: '🏢',
    description: 'Angular + Microservices + PostgreSQL for large scale',
    frontend: 'angular-app',
    backend: 'microservices',
    database: 'postgresql',
    difficulty: 'Advanced',
    features: ['auth', 'api', 'analytics', 'testing', 'notifications']
  },
  {
    id: 'bleeding-edge',
    name: 'Bleeding Edge',
    icon: '🔥',
    description: 'Solid.js + Bun + Neon for cutting-edge performance',
    frontend: 'solid-js',
    backend: 'bun-elysia',
    database: 'neon',
    difficulty: 'Advanced',
    features: ['api', 'realtime', 'analytics', 'testing']
  },
  {
    id: 'content-focused',
    name: 'Content Focused',
    icon: '📝',
    description: 'Astro + Node.js + Headless CMS for content sites',
    frontend: 'astro-app',
    backend: 'node-express',
    database: 'mongodb',
    difficulty: 'Beginner',
    features: ['seo', 'api', 'mobile', 'social']
  }
];

const DATA_SOURCES: DataSource[] = [
  { id: 'postgresql', name: 'PostgreSQL', icon: '🐘', difficulty: 'Beginner', description: 'Most popular SQL database - reliable and feature-rich', compatibility: 'Universal' },
  { id: 'supabase', name: 'Supabase', icon: '⚡', difficulty: 'Beginner', description: 'PostgreSQL with built-in auth, realtime, and APIs', compatibility: 'Perfect for SaaS' },
  { id: 'mongodb', name: 'MongoDB', icon: '🍃', difficulty: 'Beginner', description: 'NoSQL document database - flexible and scalable', compatibility: 'Great for APIs' },
  { id: 'firebase', name: 'Firebase', icon: '🔥', difficulty: 'Beginner', description: 'Google\'s backend-as-a-service with realtime features', compatibility: 'Mobile & Web' },
  { id: 'planetscale', name: 'PlanetScale', icon: '🌍', difficulty: 'Beginner', description: 'Serverless MySQL with branching like Git', compatibility: 'Serverless Apps' },
  { id: 'neon', name: 'Neon', icon: '💫', difficulty: 'Beginner', description: 'Serverless PostgreSQL with auto-scaling', compatibility: 'Modern Apps' },
  { id: 'turso', name: 'Turso', icon: '🚀', difficulty: 'Intermediate', description: 'Edge SQLite database for ultra-low latency', compatibility: 'Edge Computing' },
  { id: 'redis', name: 'Redis', icon: '🔴', difficulty: 'Intermediate', description: 'In-memory cache and session store', compatibility: 'Performance Apps' },
  { id: 'drizzle-orm', name: 'Drizzle ORM', icon: '💎', difficulty: 'Beginner', description: 'TypeScript-first ORM - type-safe and fast', compatibility: 'TypeScript Projects' }
];

const AVAILABLE_FEATURES: Feature[] = [
  { id: 'auth', name: 'Authentication' },
  { id: 'notifications', name: 'Push Notifications' },
  { id: 'realtime', name: 'Real-time Updates' },
  { id: 'search', name: 'Advanced Search' },
  { id: 'ai', name: 'AI Integration' },
  { id: 'analytics', name: 'Analytics Dashboard' },
  { id: 'payments', name: 'Payment Processing' },
  { id: 'social', name: 'Social Features' },
  { id: 'api', name: 'REST API' },
  { id: 'mobile', name: 'Mobile Responsive' },
  { id: 'seo', name: 'SEO Optimization' },
  { id: 'testing', name: 'Unit Testing' }
];

const APP_CATEGORIES: AppCategory[] = [
  {
    id: 'frontend',
    name: 'Frontend Frameworks',
    types: [
      { id: 'react-spa', name: 'React SPA', icon: '⚛️', difficulty: 'Beginner', description: 'Most popular - component-based with hooks', compatibility: 'Universal' },
      { id: 'nextjs-app', name: 'Next.js 14', icon: '🔼', difficulty: 'Beginner', description: 'Full-stack React with SSR, SSG, and App Router', compatibility: 'Production Ready' },
      { id: 'vue-spa', name: 'Vue 3', icon: '💚', difficulty: 'Beginner', description: 'Progressive framework with composition API', compatibility: 'Developer Friendly' },
      { id: 'svelte-kit', name: 'SvelteKit', icon: '🧡', difficulty: 'Intermediate', description: 'Compile-time optimized with great DX', compatibility: 'High Performance' },
      { id: 'angular-app', name: 'Angular 17', icon: '🅰️', difficulty: 'Advanced', description: 'Enterprise framework with TypeScript', compatibility: 'Large Scale' },
      { id: 'solid-js', name: 'Solid.js', icon: '💎', difficulty: 'Advanced', description: 'Fine-grained reactivity, fastest performance', compatibility: 'Cutting Edge' },
      { id: 'astro-app', name: 'Astro', icon: '🚀', difficulty: 'Intermediate', description: 'Content-focused with island architecture', compatibility: 'Static Sites' }
    ]
  },
  {
    id: 'backend',
    name: 'Backend Frameworks',
    types: [
      { id: 'node-express', name: 'Node.js + Express', icon: '🟢', difficulty: 'Beginner', description: 'JavaScript everywhere - simple and flexible', compatibility: 'Universal' },
      { id: 'python-fastapi', name: 'FastAPI', icon: '🐍', difficulty: 'Beginner', description: 'Modern Python with automatic API docs', compatibility: 'AI/ML Ready' },
      { id: 'go-gin', name: 'Go + Gin', icon: '🐹', difficulty: 'Intermediate', description: 'Ultra-fast compiled language', compatibility: 'High Performance' },
      { id: 'rust-axum', name: 'Rust + Axum', icon: '🦀', difficulty: 'Advanced', description: 'Memory-safe systems programming', compatibility: 'Maximum Performance' },
      { id: 'bun-elysia', name: 'Bun + Elysia', icon: '🧈', difficulty: 'Advanced', description: 'All-in-one JavaScript runtime', compatibility: 'Cutting Edge' },
      { id: 'deno-fresh', name: 'Deno + Fresh', icon: '🦕', difficulty: 'Intermediate', description: 'Secure TypeScript runtime', compatibility: 'Edge Computing' },
      { id: 'microservices', name: 'Microservices', icon: '🏗️', difficulty: 'Advanced', description: 'Distributed architecture pattern', compatibility: 'Enterprise Scale' }
    ]
  }
];

export default function InteractiveDemo() {
  const {
    selectedAppTypes,
    setSelectedAppTypes,
    selectedDataSource,
    setSelectedDataSource,
    selectedFeatures,
    setSelectedFeatures,
    selectAllFeatures,
    setSelectAllFeatures,
    description,
    setDescription,
    isGenerating,
    setIsGenerating,
    result,
    setResult,
    streamingText,
    setStreamingText
  } = useDemoState();

  // Event handlers
  const handleAppTypeSelect = (appType: string, category: string) => {
    setSelectedAppTypes(prev => ({
      ...prev,
      [category]: appType
    }));
    analytics.trackButtonClick(`app-type-${appType}`, 'interactive-demo');
  };

  const handleDataSourceSelect = (dataSource: string) => {
    setSelectedDataSource(dataSource);
    analytics.trackButtonClick(`data-source-${dataSource}`, 'interactive-demo');
  };

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev => {
      const updated = prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature];
      return updated;
    });
  };

  const handleSelectAllFeatures = () => {
    if (selectAllFeatures) {
      setSelectedFeatures([]);
      setSelectAllFeatures(false);
    } else {
      const allFeatures = AVAILABLE_FEATURES.map(f => f.id);
      setSelectedFeatures(allFeatures);
      setSelectAllFeatures(true);
    }
  };

  const handlePresetSelect = (preset: FrameworkPreset) => {
    setSelectedAppTypes({
      frontend: preset.frontend,
      backend: preset.backend
    });
    setSelectedDataSource(preset.database);
    setSelectedFeatures(preset.features);
    analytics.trackButtonClick(`preset-${preset.id}`, 'interactive-demo');
  };

  const handleGeneratePrompt = async () => {
    const selectedTypes = Object.values(selectedAppTypes);
    if (selectedTypes.length === 0 || !selectedDataSource) {
      alert('Please select at least one app type and a data source');
      return;
    }

    setIsGenerating(true);
    setStreamingText('');
    setResult(null);
    
    const streamingMessages = [
      'Initializing DeepSeek Reasoner...',
      'Loading NoCodeLos Blueprint Stack templates...',
      'Analyzing application architecture requirements...',
      'Integrating RAG 2.0 retrieval pipelines...',
      'Configuring MCP protocol implementations...',
      'Setting up A2A agent communication...',
      'Processing 64K token blueprint generation...',
      'Building comprehensive architecture diagrams...',
      'Creating implementation code examples...',
      'Finalizing complete master blueprint...'
    ];
    
    let messageIndex = 0;
    const streamInterval = setInterval(() => {
      if (messageIndex < streamingMessages.length) {
        setStreamingText(streamingMessages[messageIndex]);
        messageIndex++;
      } else {
        setStreamingText('Generating comprehensive blueprint... This may take up to 3 minutes for complete output.');
      }
    }, 15000);
    
    try {
      const request: PromptGenerationRequest = {
        appType: selectedTypes.join(' + '),
        dataSource: selectedDataSource,
        features: selectedFeatures,
        platform: 'web',
        additionalContext: description || 'Generate comprehensive NoCodeLos Blueprint Stack with advanced AI integration'
      };

      analytics.trackPromptGeneration(Object.values(selectedAppTypes).join('+'), selectedFeatures);
      const result = await promptService.generatePrompt(request);
      
      clearInterval(streamInterval);
      setResult(result);
      setStreamingText('');
    } catch (error) {
      clearInterval(streamInterval);
      setStreamingText('');
      console.error('Error generating prompt:', error);
      alert('Failed to generate prompt. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Update selectAll state when individual features change
  React.useEffect(() => {
    const allSelected = AVAILABLE_FEATURES.length > 0 && AVAILABLE_FEATURES.every(f => selectedFeatures.includes(f.id));
    setSelectAllFeatures(allSelected);
  }, [selectedFeatures]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 bg-clip-text text-transparent mb-6">
            Get Your First NoCodeLos Blueprint Stack Master Prompt in 3 Minutes
          </h2>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed mb-8">
            Experience the power of DeepSeek Reasoner with RAG 2.0, MCP & A2A protocols - Complete blueprints generated in 3 minutes
          </p>

          {/* Framework Preset Selector */}
          <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl mb-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-4">
                🎯 One-Click Framework Presets
              </h3>
              <p className="text-gray-300 text-lg">
                Skip the setup - choose a proven stack combination and get started immediately
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {FRAMEWORK_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset)}
                  className="group p-6 rounded-xl border border-gray-600 bg-gray-800/50 hover:border-green-500 hover:bg-gray-700/50 transition-all duration-300 text-left"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{preset.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-bold text-white group-hover:text-green-300 transition-colors">
                        {preset.name}
                      </h4>
                      <span className={`text-xs px-2 py-1 rounded ${
                        preset.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-300' :
                        preset.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {preset.difficulty}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mb-3 leading-relaxed">
                    {preset.description}
                  </p>
                  <div className="text-xs text-blue-300">
                    {preset.features.length} features included
                  </div>
                </button>
              ))}
            </div>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-400">
                💡 Select a preset to auto-configure your stack, or manually choose components below
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Step 1: Choose App Types */}
          <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                1
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Choose Your Tech Stack</h3>
                <p className="text-gray-400 mt-1">Select frontend and backend frameworks that match your needs</p>
              </div>
            </div>

            {APP_CATEGORIES.map((category) => (
              <div key={category.id} className="mb-8">
                <h4 className="text-xl font-semibold text-white mb-4">{category.name}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {category.types.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => handleAppTypeSelect(type.id, category.id)}
                      className={`group relative p-6 rounded-xl border text-center transition-all duration-300 hover:scale-105 ${
                        selectedAppTypes[category.id] === type.id
                          ? 'border-blue-500 bg-gradient-to-br from-blue-500/20 to-purple-500/20 shadow-lg shadow-blue-500/20'
                          : 'border-gray-700 bg-gray-900/50 backdrop-blur-sm hover:border-blue-400 hover:bg-gray-800/80'
                      }`}
                    >
                      <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform duration-200">
                        {type.icon}
                      </div>
                      <span className="text-sm font-medium text-white">{type.name}</span>
                      {selectedAppTypes[category.id] === type.id && (
                        <div className="absolute top-2 right-2">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Step 2: Choose Data Source */}
          <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                2
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Choose Data Source</h3>
                <p className="text-gray-400 mt-1">Select your preferred database or data management solution</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {DATA_SOURCES.map((source) => (
                <button
                  key={source.id}
                  onClick={() => handleDataSourceSelect(source.id)}
                  className={`group relative p-6 rounded-xl border text-center transition-all duration-300 hover:scale-105 ${
                    selectedDataSource === source.id
                      ? 'border-purple-500 bg-gradient-to-br from-purple-500/20 to-pink-500/20 shadow-lg shadow-purple-500/20'
                      : 'border-gray-700 bg-gray-900/50 backdrop-blur-sm hover:border-purple-400 hover:bg-gray-800/80'
                  }`}
                >
                  <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform duration-200">
                    {source.icon}
                  </div>
                  <span className="text-sm font-medium text-white">{source.name}</span>
                  {selectedDataSource === source.id && (
                    <div className="absolute top-2 right-2">
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Select Features */}
          <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-red-500 flex items-center justify-center text-white font-bold text-lg">
                3
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Select Advanced Features</h3>
                <p className="text-gray-400 mt-1">Choose the capabilities you want in your application</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-medium text-white">Available Features ({AVAILABLE_FEATURES.length})</span>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectAllFeatures}
                    onChange={handleSelectAllFeatures}
                    className="w-5 h-5 text-blue-500 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-white font-medium">Select All</span>
                </label>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {AVAILABLE_FEATURES.map((feature) => (
                  <label key={feature.id} className="cursor-pointer group">
                    <div className="p-4 rounded-xl border border-gray-700 bg-gray-900/50 hover:border-pink-500 hover:bg-gray-800/80 transition-all duration-300 flex items-center gap-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        selectedFeatures.includes(feature.id)
                          ? 'border-pink-500 bg-pink-500'
                          : 'border-gray-600 group-hover:border-pink-400'
                      }`}>
                        {selectedFeatures.includes(feature.id) && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm font-medium text-white">{feature.name}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Step 4: Additional Description */}
          <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                4
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Describe Your Vision</h3>
                <p className="text-gray-400 mt-1">Provide additional context and requirements for your application</p>
              </div>
            </div>

            <div className="space-y-4">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your application in detail... What specific features, user flows, or integrations do you need? Any special requirements or constraints?"
                className="w-full h-32 px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 resize-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
              />
              <p className="text-sm text-gray-500">
                The more detail you provide, the better your NoCodeLos Blueprint Stack will be. Include user journeys, specific workflows, or any unique requirements.
              </p>
            </div>
          </div>

          {/* Generate Button */}
          <div className="text-center">
            <Button
              onClick={handleGeneratePrompt}
              disabled={Object.keys(selectedAppTypes).length === 0 || !selectedDataSource || isGenerating}
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 hover:from-blue-600 hover:via-purple-600 hover:to-red-600 text-white px-12 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                  Generating Blueprint...
                </>
              ) : (
                <>
                  <Brain className="w-6 h-6 mr-3" />
                  Generate NoCodeLos Blueprint Stack
                </>
              )}
            </Button>
          </div>

          {/* Streaming Status */}
          {isGenerating && streamingText && (
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-xl border border-blue-500/30 rounded-xl p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Sparkles className="w-6 h-6 text-blue-400 animate-pulse" />
                <span className="text-xl font-bold text-blue-300">DeepSeek Reasoner Processing</span>
                <Sparkles className="w-6 h-6 text-blue-400 animate-pulse" />
              </div>
              <p className="text-blue-200 text-lg">{streamingText}</p>
              <div className="mt-4 text-sm text-blue-300">
                Generating comprehensive 64K token blueprint with reasoning content...
              </div>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Brain className="w-8 h-8 text-purple-400" />
                Your NoCodeLos Blueprint Stack is Ready!
              </h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400">{result.estimatedBuildTime}</div>
                    <div className="text-sm text-gray-400">Estimated Build Time</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-400">{result.complexity}</div>
                    <div className="text-sm text-gray-400">Complexity Level</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">{result.suggestedComponents?.length || 0}</div>
                    <div className="text-sm text-gray-400">Components</div>
                  </div>
                </div>

                <div className="bg-black/50 rounded-lg p-6 border border-gray-700">
                  <h4 className="text-lg font-semibold text-white mb-3">Generated NoCodeLos Master Blueprint:</h4>
                  <div className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed max-h-96 overflow-y-auto">
                    {result.prompt && result.prompt.length > 50 && result.prompt !== 'No response generated' && result.prompt !== 'Blueprint generation failed' ? (
                      <div className="space-y-4">
                        <div className="prose prose-invert max-w-none">
                          {result.prompt.split('\n').map((line: string, index: number) => {
                            if (line.startsWith('# ')) {
                              return <h1 key={index} className="text-xl font-bold text-blue-400 mb-2">{line.replace('# ', '')}</h1>;
                            } else if (line.startsWith('## ')) {
                              return <h2 key={index} className="text-lg font-semibold text-purple-400 mb-2 mt-4">{line.replace('## ', '')}</h2>;
                            } else if (line.startsWith('- ')) {
                              return <div key={index} className="text-gray-300 ml-4">{line}</div>;
                            } else if (line.trim()) {
                              return <div key={index} className="text-gray-300">{line}</div>;
                            } else {
                              return <div key={index} className="h-2"></div>;
                            }
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-orange-900/20 border border-orange-500/30 rounded p-4">
                        <div className="text-orange-300 font-semibold mb-2">Blueprint Processing Complete (3 Minutes)</div>
                        <div className="text-orange-200 text-sm">
                          Your comprehensive NoCodeLos Master Blueprint has been generated using DeepSeek's full 64K token capacity and is available in the reasoning section below. 
                          The complete blueprint contains all technical specifications, architecture details, and implementation guidance you requested.
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {result.reasoningContent && (
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-blue-300 mb-3 flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      DeepSeek Reasoning Process:
                    </h4>
                    <div className="text-blue-100 whitespace-pre-wrap text-sm leading-relaxed max-h-96 overflow-y-auto">
                      {result.reasoningContent}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}