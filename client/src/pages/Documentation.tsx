
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Book, Search, Code, Zap, Database, Users, ExternalLink } from 'lucide-react';

const Documentation = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const docSections = [
    {
      title: 'RAG 2.0 Advanced Retrieval',
      icon: Database,
      description: 'Advanced retrieval-augmented generation techniques and implementations',
      topics: ['Hybrid Search', 'Query Transformation', 'Re-ranking', 'GraphRAG'],
      color: 'blue'
    },
    {
      title: 'Model Context Protocol (MCP)',
      icon: Code,
      description: 'Standardizing agent-tool interaction and context management',
      topics: ['Client-Server Architecture', 'Tools & Resources', 'Protocol Lifecycle'],
      color: 'purple'
    },
    {
      title: 'Agent-to-Agent (A2A) Protocol',
      icon: Users,
      description: 'Facilitating multi-agent collaboration and communication',
      topics: ['Task Management', 'Agent Discovery', 'Security Framework'],
      color: 'red'
    },
    {
      title: 'DeepSeek Reasoner Integration',
      icon: Zap,
      description: 'Advanced reasoning capabilities with chain-of-thought processing',
      topics: ['API Integration', 'Reasoning Chains', 'Multi-turn Conversations'],
      color: 'green'
    }
  ];

  const quickStart = [
    'Set up your DeepSeek API key',
    'Configure RAG 2.0 retrieval pipeline',
    'Initialize MCP server connections',
    'Deploy your first A2A agent',
    'Test end-to-end workflow'
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-logo-text mb-4">
            NoCodeLos Blueprint Stack Documentation
          </h1>
          <p className="text-purple-300 text-lg">
            Complete guide to RAG 2.0, MCP, A2A protocols and advanced AI integration
          </p>
        </div>

        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search documentation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-900 border-blue-400/30"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-900 border-blue-400/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="w-5 h-5 text-blue-400" />
                Quick Start Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2">
                {quickStart.map((step, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-gray-300 text-sm">{step}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-purple-400/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-purple-400" />
                API Reference
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">RAG Endpoints</span>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">MCP Protocol</span>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">A2A Messages</span>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">DeepSeek SDK</span>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-green-400/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-400" />
                Examples & Tutorials
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-gray-300">Building RAG pipelines</div>
              <div className="text-sm text-gray-300">MCP server development</div>
              <div className="text-sm text-gray-300">A2A agent communication</div>
              <div className="text-sm text-gray-300">Advanced reasoning workflows</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {docSections.map((section) => (
            <Card key={section.title} className={`bg-gray-900 border-${section.color}-400/30`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <section.icon className={`w-5 h-5 text-${section.color}-400`} />
                  {section.title}
                </CardTitle>
                <p className="text-gray-400 text-sm">{section.description}</p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {section.topics.map((topic) => (
                    <Badge key={topic} variant="outline" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Documentation;
