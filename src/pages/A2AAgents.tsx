
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, MessageSquare, Zap, Plus, Settings, Activity } from 'lucide-react';

const A2AAgents = () => {
  const [agents] = useState([
    {
      id: 1,
      name: 'RAG Assistant',
      status: 'active',
      capabilities: ['document-search', 'knowledge-synthesis'],
      connections: 3,
      lastActive: '2 minutes ago'
    },
    {
      id: 2,
      name: 'MCP Coordinator',
      status: 'active',
      capabilities: ['tool-orchestration', 'protocol-management'],
      connections: 5,
      lastActive: '5 minutes ago'
    },
    {
      id: 3,
      name: 'Analytics Agent',
      status: 'idle',
      capabilities: ['data-analysis', 'reporting'],
      connections: 1,
      lastActive: '1 hour ago'
    }
  ]);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-logo-text mb-4">
            Agent-to-Agent Communication Hub
          </h1>
          <p className="text-purple-300 text-lg">
            Manage and monitor autonomous agent interactions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-900 border-blue-400/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-400">3</p>
                  <p className="text-gray-400">Active Agents</p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-purple-400/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-purple-400">127</p>
                  <p className="text-gray-400">Messages Today</p>
                </div>
                <MessageSquare className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-green-400/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-400">9</p>
                  <p className="text-gray-400">Active Tasks</p>
                </div>
                <Activity className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Agent Registry</h2>
          <Button className="bg-gradient-to-r from-blue-500 via-purple-500 to-red-500">
            <Plus className="w-4 h-4 mr-2" />
            Deploy New Agent
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <Card key={agent.id} className="bg-gray-900 border-blue-400/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{agent.name}</CardTitle>
                  <Badge 
                    variant={agent.status === 'active' ? 'default' : 'secondary'}
                    className={agent.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}
                  >
                    {agent.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-2">Capabilities</p>
                  <div className="flex flex-wrap gap-2">
                    {agent.capabilities.map((cap) => (
                      <Badge key={cap} variant="outline" className="text-xs">
                        {cap}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Connections: {agent.connections}</span>
                  <span className="text-gray-400">Last: {agent.lastActive}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Chat
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="w-3 h-3" />
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

export default A2AAgents;
