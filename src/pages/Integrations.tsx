
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Zap, Database, MessageSquare, Settings, ExternalLink, CheckCircle } from 'lucide-react';

const Integrations = () => {
  const [integrations, setIntegrations] = useState([
    {
      id: 1,
      name: 'OpenAI GPT-4',
      description: 'Advanced language model for enhanced reasoning capabilities',
      category: 'AI Models',
      status: 'connected',
      enabled: true,
      icon: '🤖',
      config: { apiKey: '••••••••••••sk-1234' }
    },
    {
      id: 2,
      name: 'Pinecone Vector DB',
      description: 'High-performance vector database for RAG implementations',
      category: 'Databases',
      status: 'available',
      enabled: false,
      icon: '🗄️',
      config: {}
    },
    {
      id: 3,
      name: 'Anthropic Claude',
      description: 'Constitutional AI for safe and helpful responses',
      category: 'AI Models',
      status: 'available',
      enabled: false,
      icon: '🧠',
      config: {}
    },
    {
      id: 4,
      name: 'Chroma Vector Store',
      description: 'Open-source embedding database for RAG applications',
      category: 'Databases',
      status: 'connected',
      enabled: true,
      icon: '🎨',
      config: { endpoint: 'http://localhost:8000' }
    },
    {
      id: 5,
      name: 'LangChain Framework',
      description: 'Building applications with LLMs through composability',
      category: 'Frameworks',
      status: 'connected',
      enabled: true,
      icon: '🔗',
      config: { version: '0.1.0' }
    },
    {
      id: 6,
      name: 'Hugging Face Hub',
      description: 'Access to thousands of models and datasets',
      category: 'AI Models',
      status: 'available',
      enabled: false,
      icon: '🤗',
      config: {}
    }
  ]);

  const toggleIntegration = (id: number) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === id 
          ? { ...integration, enabled: !integration.enabled }
          : integration
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-400';
      case 'available': return 'text-gray-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const categories = ['All', 'AI Models', 'Databases', 'Frameworks'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredIntegrations = selectedCategory === 'All' 
    ? integrations 
    : integrations.filter(integration => integration.category === selectedCategory);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-logo-text mb-4">
            Integration Hub
          </h1>
          <p className="text-purple-300 text-lg">
            Connect and manage external services for your NoCodeLos Blueprint Stack
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-900 border-green-400/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-400">
                    {integrations.filter(i => i.status === 'connected').length}
                  </p>
                  <p className="text-gray-400">Connected</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-blue-400/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-400">
                    {integrations.filter(i => i.enabled).length}
                  </p>
                  <p className="text-gray-400">Active</p>
                </div>
                <Zap className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-purple-400/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-purple-400">{integrations.length}</p>
                  <p className="text-gray-400">Available</p>
                </div>
                <Database className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2 mb-6">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category 
                ? "bg-gradient-to-r from-blue-500 via-purple-500 to-red-500" 
                : "border-blue-400/50"
              }
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIntegrations.map((integration) => (
            <Card key={integration.id} className="bg-gray-900 border-blue-400/30">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{integration.icon}</span>
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {integration.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className={`w-4 h-4 ${getStatusColor(integration.status)}`} />
                    <Switch
                      checked={integration.enabled}
                      onCheckedChange={() => toggleIntegration(integration.id)}
                      disabled={integration.status !== 'connected'}
                    />
                  </div>
                </div>
                <p className="text-gray-400 text-sm">{integration.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {integration.status === 'connected' && Object.keys(integration.config).length > 0 && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Configuration</p>
                    <div className="space-y-1">
                      {Object.entries(integration.config).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-xs">
                          <span className="text-gray-500">{key}:</span>
                          <span className="text-gray-300">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    variant={integration.status === 'connected' ? 'outline' : 'default'}
                  >
                    {integration.status === 'connected' ? (
                      <>
                        <Settings className="w-3 h-3 mr-1" />
                        Configure
                      </>
                    ) : (
                      <>
                        <Zap className="w-3 h-3 mr-1" />
                        Connect
                      </>
                    )}
                  </Button>
                  <Button size="sm" variant="outline">
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Integrations;
