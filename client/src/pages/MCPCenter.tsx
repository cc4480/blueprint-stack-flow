import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Server, 
  Settings, 
  Plus, 
  Play, 
  Pause, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertCircle,
  Zap,
  Database,
  Globe
} from 'lucide-react';

// Types
interface MCPServer {
  id: string;
  name: string;
  description: string;
  url: string;
  status: 'active' | 'inactive' | 'error' | 'pending';
  protocol: string;
  lastConnected: string;
  responseTime: number;
  capabilities: string[];
  endpoints: number;
}

interface MCPServerForm {
  name: string;
  description: string;
  url: string;
  protocol: string;
  capabilities: string[];
}

interface ConnectionMetrics {
  totalServers: number;
  activeConnections: number;
  avgResponseTime: number;
  successRate: number;
}

// Mock data
const mockServers: MCPServer[] = [
  {
    id: '1',
    name: 'OpenAI MCP Bridge',
    description: 'Bridge for OpenAI API integration with MCP protocol',
    url: 'https://api.openai.com/v1/mcp',
    status: 'active',
    protocol: 'MCP/1.0',
    lastConnected: '2025-01-25T10:30:00Z',
    responseTime: 150,
    capabilities: ['chat', 'completions', 'embeddings'],
    endpoints: 12
  },
  {
    id: '2',
    name: 'Vector Database MCP',
    description: 'High-performance vector search and similarity matching',
    url: 'https://vectordb.example.com/mcp',
    status: 'active',
    protocol: 'MCP/1.1',
    lastConnected: '2025-01-25T10:25:00Z',
    responseTime: 89,
    capabilities: ['search', 'index', 'similarity'],
    endpoints: 8
  },
  {
    id: '3',
    name: 'Analytics MCP Service',
    description: 'Real-time analytics and data processing pipeline',
    url: 'https://analytics.internal/mcp',
    status: 'pending',
    protocol: 'MCP/1.0',
    lastConnected: '2025-01-25T09:45:00Z',
    responseTime: 320,
    capabilities: ['analytics', 'reporting', 'monitoring'],
    endpoints: 15
  },
  {
    id: '4',
    name: 'Content Generation MCP',
    description: 'Advanced content generation and optimization service',
    url: 'https://content.service.com/mcp',
    status: 'error',
    protocol: 'MCP/1.1',
    lastConnected: '2025-01-25T08:30:00Z',
    responseTime: 0,
    capabilities: ['generation', 'optimization', 'analysis'],
    endpoints: 10
  }
];

// Custom hooks
const useMCPServers = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch servers from API
  const { data: servers = [], isLoading } = useQuery({
    queryKey: ['/api/mcp-servers'],
    refetchInterval: 10000, // Refetch every 10 seconds for real-time status updates
  });

  const addServerMutation = useMutation({
    mutationFn: async (serverData: MCPServerForm) => {
      const response = await fetch('/api/mcp-servers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serverData),
      });

      if (!response.ok) {
        throw new Error('Failed to add MCP server');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mcp-servers'] });
      toast({
        title: "Server Added",
        description: "MCP server has been added successfully. Connection testing in progress...",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add MCP server. Please check your configuration.",
        variant: "destructive",
      });
    },
  });

  const deleteServerMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/mcp-servers/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete MCP server');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mcp-servers'] });
      toast({
        title: "Server Removed",
        description: "MCP server has been removed successfully.",
      });
    },
  });

  const addServer = async (serverData: MCPServerForm) => {
    await addServerMutation.mutateAsync(serverData);
  };

  const deleteServer = async (id: string) => {
    await deleteServerMutation.mutateAsync(id);
  };

  const updateServerStatus = async (id: string, status: MCPServer['status']) => {
    // This would be handled server-side in a real implementation
    console.log('Updating server status:', id, status);
  };

  return {
    servers: servers as MCPServer[],
    isLoading: isLoading || addServerMutation.isPending || deleteServerMutation.isPending,
    addServer,
    updateServerStatus,
    deleteServer
  };
};

const useConnectionMetrics = (servers: MCPServer[]): ConnectionMetrics => {
  return React.useMemo(() => {
    const activeServers = servers.filter(s => s.status === 'active');
    const totalResponseTime = activeServers.reduce((sum, s) => sum + s.responseTime, 0);
    const successfulConnections = servers.filter(s => s.status === 'active' || s.status === 'pending').length;
    
    return {
      totalServers: servers.length,
      activeConnections: activeServers.length,
      avgResponseTime: activeServers.length > 0 ? Math.round(totalResponseTime / activeServers.length) : 0,
      successRate: servers.length > 0 ? Math.round((successfulConnections / servers.length) * 100) : 0
    };
  }, [servers]);
};

// Components
const StatusBadge: React.FC<{ status: MCPServer['status'] }> = ({ status }) => {
  const variants = {
    active: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-500' },
    inactive: { variant: 'secondary' as const, icon: XCircle, color: 'text-gray-500' },
    error: { variant: 'destructive' as const, icon: AlertCircle, color: 'text-red-500' },
    pending: { variant: 'outline' as const, icon: Clock, color: 'text-yellow-500' }
  };

  const { variant, icon: Icon, color } = variants[status];

  return (
    <Badge variant={variant} className="flex items-center gap-1">
      <Icon className={`w-3 h-3 ${color}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const MetricsCard: React.FC<{ metrics: ConnectionMetrics }> = ({ metrics }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Server className="w-4 h-4 text-blue-500" />
          Total Servers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-blue-600">{metrics.totalServers}</div>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Zap className="w-4 h-4 text-green-500" />
          Active Connections
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-green-600">{metrics.activeConnections}</div>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-500" />
          Avg Response Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-purple-600">{metrics.avgResponseTime}ms</div>
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-orange-500" />
          Success Rate
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-orange-600">{metrics.successRate}%</div>
        <Progress value={metrics.successRate} className="mt-2" />
      </CardContent>
    </Card>
  </div>
);

const ServerForm: React.FC<{
  onSubmit: (data: MCPServerForm) => void;
  isLoading: boolean;
}> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<MCPServerForm>({
    name: '',
    description: '',
    url: '',
    protocol: 'MCP/1.0',
    capabilities: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: '',
      description: '',
      url: '',
      protocol: 'MCP/1.0',
      capabilities: []
    });
  };

  const availableCapabilities = [
    'chat', 'completions', 'embeddings', 'search', 'index', 
    'similarity', 'analytics', 'reporting', 'monitoring', 
    'generation', 'optimization', 'analysis'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Server Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="OpenAI MCP Bridge"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Bridge for OpenAI API integration with MCP protocol"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="url">Server URL</Label>
        <Input
          id="url"
          type="url"
          value={formData.url}
          onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
          placeholder="https://api.example.com/mcp"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="protocol">Protocol Version</Label>
        <Select 
          value={formData.protocol} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, protocol: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MCP/1.0">MCP/1.0</SelectItem>
            <SelectItem value="MCP/1.1">MCP/1.1</SelectItem>
            <SelectItem value="MCP/2.0">MCP/2.0 (Beta)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label>Capabilities</Label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {availableCapabilities.map(capability => (
            <label key={capability} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.capabilities.includes(capability)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData(prev => ({
                      ...prev,
                      capabilities: [...prev.capabilities, capability]
                    }));
                  } else {
                    setFormData(prev => ({
                      ...prev,
                      capabilities: prev.capabilities.filter(c => c !== capability)
                    }));
                  }
                }}
                className="rounded"
              />
              <span className="text-sm">{capability}</span>
            </label>
          ))}
        </div>
      </div>
      
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Adding Server...' : 'Add MCP Server'}
      </Button>
    </form>
  );
};

const ServerTable: React.FC<{
  servers: MCPServer[];
  onStatusChange: (id: string, status: MCPServer['status']) => void;
  onDelete: (id: string) => void;
}> = ({ servers, onStatusChange, onDelete }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Server</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Protocol</TableHead>
        <TableHead>Response Time</TableHead>
        <TableHead>Endpoints</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {servers.map((server) => (
        <TableRow key={server.id}>
          <TableCell>
            <div>
              <div className="font-medium">{server.name}</div>
              <div className="text-sm text-gray-500">{server.description}</div>
              <div className="text-xs text-gray-400">{server.url}</div>
            </div>
          </TableCell>
          <TableCell>
            <StatusBadge status={server.status} />
          </TableCell>
          <TableCell>
            <Badge variant="outline">{server.protocol}</Badge>
          </TableCell>
          <TableCell>
            {server.responseTime > 0 ? `${server.responseTime}ms` : 'N/A'}
          </TableCell>
          <TableCell>{server.endpoints}</TableCell>
          <TableCell>
            <div className="flex items-center gap-2">
              {server.status === 'active' ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onStatusChange(server.id, 'inactive')}
                >
                  <Pause className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onStatusChange(server.id, 'active')}
                >
                  <Play className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(server.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default function MCPCenter() {
  const { servers, isLoading, addServer, updateServerStatus, deleteServer } = useMCPServers();
  const metrics = useConnectionMetrics(servers);

  return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Database className="w-8 h-8 text-blue-500" />
                MCP Center
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Manage Model Context Protocol connections and integrations
              </p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add MCP Server
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New MCP Server</DialogTitle>
                  <DialogDescription>
                    Configure a new Model Context Protocol server connection
                  </DialogDescription>
                </DialogHeader>
                <ServerForm onSubmit={addServer} isLoading={isLoading} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <MetricsCard metrics={metrics} />

        <Tabs defaultValue="servers" className="space-y-6">
          <TabsList>
            <TabsTrigger value="servers">MCP Servers</TabsTrigger>
            <TabsTrigger value="protocols">Protocol Info</TabsTrigger>
            <TabsTrigger value="logs">Connection Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="servers">
            <Card>
              <CardHeader>
                <CardTitle>Connected MCP Servers</CardTitle>
                <CardDescription>
                  Manage your Model Context Protocol server connections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ServerTable
                  servers={servers}
                  onStatusChange={updateServerStatus}
                  onDelete={deleteServer}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="protocols">
            <Card>
              <CardHeader>
                <CardTitle>MCP Protocol Information</CardTitle>
                <CardDescription>
                  Learn about Model Context Protocol versions and capabilities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">MCP/1.0</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Basic protocol with standard request/response patterns
                    </p>
                    <div className="mt-2">
                      <Badge variant="secondary">Stable</Badge>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">MCP/1.1</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Enhanced with streaming capabilities and better error handling
                    </p>
                    <div className="mt-2">
                      <Badge variant="default">Recommended</Badge>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">MCP/2.0</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Next-generation with advanced context sharing
                    </p>
                    <div className="mt-2">
                      <Badge variant="outline">Beta</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Connection Logs</CardTitle>
                <CardDescription>
                  Monitor MCP server connection activity and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {servers.map(server => (
                    <div key={server.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                      <StatusBadge status={server.status} />
                      <span className="font-medium">{server.name}</span>
                      <span className="text-sm text-gray-500">
                        Last connected: {new Date(server.lastConnected).toLocaleString()}
                      </span>
                      {server.responseTime > 0 && (
                        <span className="text-sm text-gray-500">
                          ({server.responseTime}ms)
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  );
}