
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Star, Eye, Clock } from 'lucide-react';

const Templates = () => {
  const templates = [
    {
      id: 1,
      name: 'RAG 2.0 Knowledge Base',
      description: 'Complete implementation of advanced retrieval-augmented generation with hybrid search and re-ranking',
      category: 'RAG',
      difficulty: 'Intermediate',
      downloads: 1234,
      rating: 4.8,
      technologies: ['RAG 2.0', 'Vector DB', 'Hybrid Search', 'Re-ranking'],
      preview: '/templates/rag-preview.png'
    },
    {
      id: 2,
      name: 'MCP Tool Orchestrator',
      description: 'Model Context Protocol implementation for seamless tool integration and management',
      category: 'MCP',
      difficulty: 'Advanced',
      downloads: 892,
      rating: 4.9,
      technologies: ['MCP', 'Tool Integration', 'Protocol Management'],
      preview: '/templates/mcp-preview.png'
    },
    {
      id: 3,
      name: 'A2A Agent Network',
      description: 'Multi-agent system with Agent-to-Agent communication protocols',
      category: 'A2A',
      difficulty: 'Expert',
      downloads: 567,
      rating: 4.7,
      technologies: ['A2A Protocol', 'Multi-Agent', 'Communication'],
      preview: '/templates/a2a-preview.png'
    },
    {
      id: 4,
      name: 'DeepSeek Reasoner Integration',
      description: 'Chain-of-thought reasoning implementation with DeepSeek API',
      category: 'AI Reasoning',
      difficulty: 'Beginner',
      downloads: 2156,
      rating: 4.9,
      technologies: ['DeepSeek', 'Chain of Thought', 'Reasoning'],
      preview: '/templates/deepseek-preview.png'
    },
    {
      id: 5,
      name: 'Full Stack Blueprint',
      description: 'Complete NoCodeLos Blueprint Stack with all protocols integrated',
      category: 'Complete',
      difficulty: 'Expert',
      downloads: 445,
      rating: 5.0,
      technologies: ['RAG 2.0', 'MCP', 'A2A', 'DeepSeek', 'Full Integration'],
      preview: '/templates/blueprint-preview.png'
    },
    {
      id: 6,
      name: 'Enterprise RAG Pipeline',
      description: 'Production-ready RAG implementation with enterprise security and scalability',
      category: 'RAG',
      difficulty: 'Advanced',
      downloads: 723,
      rating: 4.6,
      technologies: ['Enterprise RAG', 'Security', 'Scalability', 'Production'],
      preview: '/templates/enterprise-preview.png'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-500';
      case 'Intermediate': return 'bg-blue-500';
      case 'Advanced': return 'bg-orange-500';
      case 'Expert': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-logo-text mb-4">
            Blueprint Stack Templates
          </h1>
          <p className="text-purple-300 text-lg">
            Pre-built implementations for rapid development with RAG 2.0, MCP, and A2A protocols
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="bg-gray-900 border-blue-400/30 hover:border-blue-400/50 transition-all duration-300 group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg mb-2">{template.name}</CardTitle>
                    <Badge className={`${getDifficultyColor(template.difficulty)} text-white`}>
                      {template.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-yellow-400">
                    <Star className="w-3 h-3 fill-current" />
                    {template.rating}
                  </div>
                </div>
                <p className="text-gray-400 text-sm mt-2">{template.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-2">Technologies</p>
                  <div className="flex flex-wrap gap-1">
                    {template.technologies.slice(0, 3).map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {template.technologies.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.technologies.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    {template.downloads.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {template.category}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500">
                    <Download className="w-3 h-3 mr-1" />
                    Use Template
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="w-3 h-3" />
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

export default Templates;
