
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Folder, Clock, Star, Settings, Play } from 'lucide-react';

const Projects = () => {
  const [projects] = useState([
    {
      id: 1,
      name: 'Enterprise Knowledge Base',
      description: 'RAG 2.0 implementation for company documentation',
      status: 'active',
      technologies: ['RAG 2.0', 'Vector DB', 'DeepSeek'],
      lastModified: '2 hours ago',
      favorite: true
    },
    {
      id: 2,
      name: 'Multi-Agent Workflow',
      description: 'A2A protocol for automated customer service',
      status: 'development',
      technologies: ['A2A', 'MCP', 'Agent Framework'],
      lastModified: '1 day ago',
      favorite: false
    },
    {
      id: 3,
      name: 'Intelligent API Gateway',
      description: 'MCP-based tool orchestration platform',
      status: 'completed',
      technologies: ['MCP', 'API Gateway', 'Protocol Hub'],
      lastModified: '3 days ago',
      favorite: true
    },
    {
      id: 4,
      name: 'Reasoning Chain Demo',
      description: 'DeepSeek reasoner with chain-of-thought display',
      status: 'planning',
      technologies: ['DeepSeek', 'CoT', 'Reasoning'],
      lastModified: '1 week ago',
      favorite: false
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'development': return 'bg-blue-500';
      case 'completed': return 'bg-purple-500';
      case 'planning': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-logo-text mb-2">
              Project Workspace
            </h1>
            <p className="text-purple-300 text-lg">
              Manage your NoCodeLos Blueprint Stack implementations
            </p>
          </div>
          <Button className="bg-gradient-to-r from-blue-500 via-purple-500 to-red-500">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-900 border-blue-400/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-400">{projects.length}</p>
                  <p className="text-gray-400">Total Projects</p>
                </div>
                <Folder className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-green-400/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-400">
                    {projects.filter(p => p.status === 'active').length}
                  </p>
                  <p className="text-gray-400">Active</p>
                </div>
                <Play className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-purple-400/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-purple-400">
                    {projects.filter(p => p.favorite).length}
                  </p>
                  <p className="text-gray-400">Favorites</p>
                </div>
                <Star className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="bg-gray-900 border-blue-400/30 hover:border-blue-400/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {project.name}
                      {project.favorite && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
                    </CardTitle>
                    <p className="text-gray-400 text-sm mt-2">{project.description}</p>
                  </div>
                  <Badge 
                    className={`${getStatusColor(project.status)} text-white`}
                  >
                    {project.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-2">Technologies</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="w-3 h-3" />
                    {project.lastModified}
                  </div>
                  <Button size="sm" variant="outline">
                    <Settings className="w-3 h-3 mr-1" />
                    Configure
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

export default Projects;
