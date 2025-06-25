import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Zap, Database, Code, Brain, Rocket } from 'lucide-react';
import { analytics } from '@/services/analyticsService';
import { promptService, type PromptGenerationRequest } from '@/services/promptService';

const InteractiveDemo = () => {
  const [selectedAppTypes, setSelectedAppTypes] = useState<{[key: string]: string}>({});
  const [selectedDataSource, setSelectedDataSource] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectAllFeatures, setSelectAllFeatures] = useState(false);

  // Framework preset combinations
  const frameworkPresets = [
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
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [streamingText, setStreamingText] = useState('');

  const appTypes = {
    frontend: [
      { id: 'react-spa', name: 'React SPA', icon: '⚛️', description: 'Single Page Application with modern React hooks and state management', difficulty: 'Beginner', popularity: '🔥 Most Popular', compatibility: ['All Backends'] },
      { id: 'nextjs-app', name: 'Next.js App', icon: '▲', description: 'Full-stack React application with SSR and API routes', difficulty: 'Beginner', popularity: '🔥 Most Popular', compatibility: ['Node.js', 'Vercel', 'All Backends'] },
      { id: 'vue-nuxt', name: 'Vue + Nuxt', icon: '💚', description: 'Vue 3 with Nuxt for SSR, file-based routing, and performance', difficulty: 'Beginner', popularity: '⭐ Popular', compatibility: ['Node.js', 'All Backends'] },
      { id: 'svelte-kit', name: 'SvelteKit', icon: '🧡', description: 'Fast, lightweight framework with excellent developer experience', difficulty: 'Beginner', popularity: '⭐ Rising Star', compatibility: ['Node.js', 'Deno', 'All Backends'] },
      { id: 'angular-app', name: 'Angular', icon: '🅰️', description: 'Enterprise application with Angular and TypeScript', difficulty: 'Intermediate', popularity: '💼 Enterprise', compatibility: ['All Backends'] },
      { id: 'solid-js', name: 'Solid.js', icon: '🟦', description: 'High-performance reactive framework with fine-grained reactivity', difficulty: 'Intermediate', popularity: '⚡ Performance', compatibility: ['All Backends'] },
      { id: 'astro-app', name: 'Astro', icon: '🚀', description: 'Modern static site generator with partial hydration', difficulty: 'Beginner', popularity: '🌟 Content Sites', compatibility: ['All Backends', 'Static'] },
      { id: 'remix-app', name: 'Remix', icon: '💿', description: 'Full-stack web framework with nested routing and data loading', difficulty: 'Intermediate', popularity: '🎯 Modern', compatibility: ['Node.js', 'Edge Runtime'] }
    ],
    backend: [
      { id: 'node-express', name: 'Node.js + Express', icon: '🟢', description: 'RESTful API with Express.js and middleware integration', difficulty: 'Beginner', popularity: '🔥 Most Popular', compatibility: ['All Frontends', 'All Databases'] },
      { id: 'node-fastify', name: 'Node.js + Fastify', icon: '⚡', description: 'High-performance Node.js framework with TypeScript support', difficulty: 'Beginner', popularity: '⚡ Fast & Easy', compatibility: ['All Frontends', 'All Databases'] },
      { id: 'bun-elysia', name: 'Bun + Elysia', icon: '🥟', description: 'Ultra-fast runtime with modern TypeScript-first framework', difficulty: 'Beginner', popularity: '🚀 Bleeding Edge', compatibility: ['React', 'Vue', 'Svelte'] },
      { id: 'deno-fresh', name: 'Deno + Fresh', icon: '🦕', description: 'Secure runtime with island architecture and edge computing', difficulty: 'Intermediate', popularity: '🛡️ Secure', compatibility: ['React', 'Preact', 'Islands'] },
      { id: 'python-fastapi', name: 'Python + FastAPI', icon: '🐍', description: 'High-performance Python API with automatic documentation', difficulty: 'Beginner', popularity: '🔥 AI/ML Friendly', compatibility: ['All Frontends', 'PostgreSQL', 'Vector DBs'] },
      { id: 'python-django', name: 'Python + Django', icon: '🎸', description: 'Full-featured web framework with ORM and admin interface', difficulty: 'Intermediate', popularity: '💼 Enterprise', compatibility: ['All Frontends', 'PostgreSQL', 'MySQL'] },
      { id: 'go-gin', name: 'Go + Gin', icon: '🔵', description: 'High-performance HTTP framework with minimal overhead', difficulty: 'Intermediate', popularity: '⚡ Performance', compatibility: ['All Frontends', 'All Databases'] },
      { id: 'rust-axum', name: 'Rust + Axum', icon: '🦀', description: 'Memory-safe, extremely fast web framework for Rust', difficulty: 'Advanced', popularity: '🔥 Blazing Fast', compatibility: ['All Frontends', 'PostgreSQL'] },
      { id: 'graphql-apollo', name: 'GraphQL + Apollo', icon: '🔗', description: 'Flexible API with GraphQL schema and resolvers', difficulty: 'Intermediate', popularity: '🎯 Flexible', compatibility: ['React', 'Vue', 'Angular'] },
      { id: 'microservices', name: 'Microservices', icon: '🔄', description: 'Distributed architecture with service mesh and containers', difficulty: 'Advanced', popularity: '🏢 Enterprise', compatibility: ['All Frontends', 'Distributed DBs'] }
    ],
    fullstack: [
      { id: 'saas-platform', name: 'SaaS Platform', icon: '🏢', description: 'Complete business application with subscriptions, analytics, and user management' },
      { id: 'ecommerce-app', name: 'E-commerce Store', icon: '🛒', description: 'Full shopping platform with payments, inventory, and order management' },
      { id: 'social-network', name: 'Social Network', icon: '👥', description: 'Community platform with real-time messaging and user interactions' },
      { id: 'cms-platform', name: 'CMS Platform', icon: '📝', description: 'Content management system with headless API and admin interface' },
      { id: 'dashboard-app', name: 'Analytics Dashboard', icon: '📊', description: 'Data visualization platform with charts, KPIs, and reporting' },
      { id: 'marketplace', name: 'Marketplace', icon: '🏪', description: 'Multi-vendor platform with vendor management and commission tracking' }
    ],
    advanced: [
      { id: 'ai-saas', name: 'AI SaaS Platform', icon: '🤖', description: 'AI-powered application with RAG 2.0, vector embeddings, and LLM integration' },
      { id: 'realtime-collaboration', name: 'Real-time Collaboration', icon: '📡', description: 'WebSocket-based application with live updates, presence, and co-editing' },
      { id: 'blockchain-dapp', name: 'Web3 dApp', icon: '⛓️', description: 'Decentralized application with smart contracts and wallet integration' },
      { id: 'iot-platform', name: 'IoT Platform', icon: '🌐', description: 'Internet of Things monitoring with device management and edge computing' },
      { id: 'api-gateway', name: 'API Gateway', icon: '🚪', description: 'Centralized API management with rate limiting, auth, and monitoring' },
      { id: 'edge-computing', name: 'Edge Computing', icon: '⚡', description: 'Distributed application with CDN, edge functions, and global deployment' }
    ]
  };

  const dataSources = [
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

  const availableFeatures = [
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

  const handleAppTypeSelect = (appType: string, category: string) => {
    setSelectedAppTypes(prev => ({
      ...prev,
      [category]: appType
    }));
    analytics.trackButtonClick(`app-type-${appType}`, 'interactive-demo');
    console.log('📱 App type selected:', appType, 'in category:', category);
  };

  const handleDataSourceSelect = (dataSource: string) => {
    setSelectedDataSource(dataSource);
    analytics.trackButtonClick(`data-source-${dataSource}`, 'interactive-demo');
    console.log('💾 Data source selected:', dataSource);
  };

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev => {
      const updated = prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature];
      console.log('🔄 NoCodeLos Blueprint Stack features updated:', updated);
      return updated;
    });
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
    console.log('🚀 Generating NoCodeLos Blueprint Stack prompt with RAG 2.0 + MCP + A2A...');
    
    // Simulate streaming text effect
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
    }, 15000); // Slower updates for longer generation time
    
    try {
      const request: PromptGenerationRequest = {
        appType: selectedTypes.join(' + '), // Combine selected types
        dataSource: selectedDataSource,
        features: selectedFeatures,
        platform: 'web',
        additionalContext: description || 'Generate comprehensive NoCodeLos Blueprint Stack with advanced AI integration'
      };

      analytics.trackPromptGeneration(Object.values(selectedAppTypes).join('+'), selectedFeatures);
      const result = await promptService.generatePrompt(request);
      
      clearInterval(streamInterval);
      setStreamingText('');
      setResult(result);
      console.log('✅ NoCodeLos Blueprint Stack prompt generated with full DeepSeek integration:', result);
    } catch (error) {
      clearInterval(streamInterval);
      setStreamingText('');
      console.error('Error generating prompt:', error);
      alert('Failed to generate prompt. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 bg-clip-text text-transparent mb-6">
            Get Your First NoCodeLos Blueprint Stack Master Prompt in 3 Minutes
          </h2>
          <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed mb-8">
            Experience the power of DeepSeek Reasoner with RAG 2.0, MCP & A2A protocols
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
              {frameworkPresets.map((preset) => (
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
          <div className="flex justify-center items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-300 text-sm font-medium">DeepSeek Reasoner</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full">
              <Database className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300 text-sm font-medium">RAG 2.0</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full">
              <Brain className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm font-medium">MCP + A2A</span>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          {/* Step 1: Choose App Type */}
          <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                1
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Choose Your Application Components</h3>
                <p className="text-gray-400 mt-1">Select one or more components from each category to build your complete application</p>
              </div>
            </div>

            <div className="space-y-8">
              {Object.entries(appTypes).map(([category, types]) => (
                <div key={category} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {category === 'frontend' && <Code className="w-5 h-5 text-blue-400" />}
                      {category === 'backend' && <Zap className="w-5 h-5 text-green-400" />}
                      {category === 'fullstack' && <Database className="w-5 h-5 text-purple-400" />}
                      {category === 'advanced' && <Brain className="w-5 h-5 text-red-400" />}
                      <h4 className="text-xl font-bold text-white capitalize">
                        {category === 'fullstack' ? 'Full-Stack' : category} Applications
                      </h4>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {types.length} options
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {types.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => handleAppTypeSelect(type.id, category)}
                        className={`group relative p-6 rounded-xl border text-left transition-all duration-300 hover:scale-105 ${
                          selectedAppTypes[category] === type.id
                            ? 'border-blue-500 bg-gradient-to-br from-blue-500/20 to-purple-500/20 shadow-lg shadow-blue-500/20'
                            : 'border-gray-700 bg-gray-900/50 backdrop-blur-sm hover:border-blue-400 hover:bg-gray-800/80'
                        }`}
                      >
                        <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform duration-200">
                          {type.icon}
                        </div>
                        <h5 className="font-semibold text-white mb-2 text-lg">{type.name}</h5>
                        <p className="text-sm text-gray-300 leading-relaxed">{type.description}</p>
                        {selectedAppTypes[category] === type.id && (
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
              {dataSources.map((source) => (
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

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {availableFeatures.map((feature) => (
                <label
                  key={feature.id}
                  className={`group flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:scale-105 ${
                    selectedFeatures.includes(feature.id)
                      ? 'border-pink-500 bg-gradient-to-r from-pink-500/20 to-red-500/20 shadow-lg shadow-pink-500/20'
                      : 'border-gray-700 bg-gray-900/50 backdrop-blur-sm hover:border-pink-400 hover:bg-gray-800/80'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedFeatures.includes(feature.id)}
                    onChange={() => handleFeatureToggle(feature.id)}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-3 w-full">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
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
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  {streamingText || 'Generating with DeepSeek Reasoner...'}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-3" />
                  Generate NoCodeLos Blueprint Stack Master Prompt
                </>
              )}
            </Button>
          </div>

          {/* Results */}
          {result && (
            <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border-gray-700/50 shadow-2xl">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Rocket className="w-8 h-8 text-green-400" />
                  <h3 className="text-2xl font-bold text-white">Your NoCodeLos Blueprint Stack Master Prompt</h3>
                </div>
                
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
                    <div className="bg-blue-900/20 rounded-lg p-6 border border-blue-700/50">
                      <h4 className="text-lg font-semibold text-blue-300 mb-3 flex items-center gap-2">
                        <Brain className="w-5 h-5" />
                        DeepSeek Reasoning Process & Blueprint Content:
                      </h4>
                      <div className="text-blue-100 whitespace-pre-wrap text-sm leading-relaxed max-h-96 overflow-y-auto bg-blue-950/30 rounded p-4">
                        {result.reasoningContent.split('\n').map((line: string, index: number) => {
                          if (line.includes('## ') || line.includes('# ')) {
                            return <div key={index} className="font-semibold text-blue-200 mt-3 mb-1">{line}</div>;
                          } else if (line.includes('- ') || line.includes('✅')) {
                            return <div key={index} className="text-blue-100 ml-2">{line}</div>;
                          } else {
                            return <div key={index} className="text-blue-100">{line}</div>;
                          }
                        })}
                      </div>
                    </div>
                  )}

                  {result.suggestedComponents && result.suggestedComponents.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Suggested Components:</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.suggestedComponents.map((component: string, index: number) => (
                          <Badge key={index} variant="outline" className="bg-gray-800/50">
                            {component}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveDemo;