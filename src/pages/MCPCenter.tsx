
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Network,
  Server,
  Plus,
  Settings,
  Play,
  Pause,
  Trash2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  Database,
  Shield,
  Code,
  Monitor,
  Globe,
  Link
} from 'lucide-react';
import { toast } from 'sonner';

const MCPCenter = () => {
  const [isConnecting, setIsConnecting] = useState(false);

  const [mcpServers] = useState([
    {
      id: 'auth-provider',
      name: 'Authentication Provider',
      endpoint: '/mcp/auth-provider',
      status: 'active',
      connections: 23,
      type: 'security',
      lastPing: '< 1s',
      uptime: '99.98%'
    },
    {
      id: 'payment-processor',
      name: 'Payment Processor',
      endpoint: '/mcp/payment-processor',
      status: 'active',
      connections: 15,
      type: 'commerce',
      lastPing: '< 1s',
      uptime: '99.94%'
    },
    {
      id: 'rag-retriever',
      name: 'RAG Retriever',
      endpoint: '/mcp/rag-retriever',
      status: 'busy',
      connections: 45,
      type: 'knowledge',
      lastPing: '2s',
      uptime: '99.87%'
    },
    {
      id: 'knowledge-indexer',
      name: 'Knowledge Indexer',
      endpoint: '/mcp/knowledge-indexer',
      status: 'active',
      connections: 12,
      type: 'knowledge',
      lastPing: '< 1s',
      uptime: '99.99%'
    },
    {
      id: 'websocket-server',
      name: 'WebSocket Server',
      endpoint: '/mcp/websocket-server',
      status: 'maintenance',
      connections: 0,
      type: 'communication',
      lastPing: '-',
      uptime: '98.45%'
    }
  ]);

  const [mcpClients] = useState([
    {
      id: 'main-app',
      name: 'Main Application',
      connectedServers: 4,
      status: 'connected',
      lastActivity: '< 1min',
      requestsPerMin: 234
    },
    {
      id: 'prompt-studio',
      name: 'Prompt Studio',
      connectedServers: 2,
      status: 'connected',
      lastActivity: '3min',
      requestsPerMin: 67
    },
    {
      id: 'rag-hub',
      name: 'RAG Hub',
      connectedServers: 3,
      status: 'connected',
      lastActivity: '< 1min',
      requestsPerMin: 156
    }
  ]);

  const [protocolMetrics] = useState({
    totalConnections: 95,
    activeProtocols: 12,
    avgResponseTime: 0.089,
    errorRate: 0.003,
    throughput: 457,
    dataTransferred: '2.4GB'
  });

  useEffect(() => {
    console.log('🌐 MCP Center initialized with full protocol management');
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'busy': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'maintenance': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'security': return <Shield className="w-4 h-4 text-blue-600" />;
      case 'commerce': return <Zap className="w-4 h-4 text-green-600" />;
      case 'knowledge': return <Database className="w-4 h-4 text-purple-600" />;
      case 'communication': return <Network className="w-4 h-4 text-orange-600" />;
      default: return <Server className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'security': return 'bg-blue-100 text-blue-800';
      case 'commerce': return 'bg-green-100 text-green-800';
      case 'knowledge': return 'bg-purple-100 text-purple-800';
      case 'communication': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleServerAction = (action: string, serverId: string) => {
    console.log(`🔧 MCP Server ${action}:`, serverId);
    toast.success(`${action} server ${serverId}`);
  };

  const connectNewServer = async () => {
    setIsConnecting(true);
    console.log('🔗 Connecting new MCP server...');
    toast.info('Establishing MCP server connection...');

    setTimeout(() => {
      setIsConnecting(false);
      toast.success('New MCP server connected successfully!');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-20 pb-12">
      <div className="container mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-logo-text mb-2">
            MCP Protocol Center
          </h1>
          <p className="text-xl text-gray-600">
            Model Context Protocol management and monitoring dashboard
          </p>
        </div>

        {/* Protocol Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <Card className="border-2 border-blue-400/30">
            <CardContent className="p-4 text-center">
              <Network className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{protocolMetrics.totalConnections}</div>
              <div className="text-sm text-gray-600">Total Connections</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-blue-400/30">
            <CardContent className="p-4 text-center">
              <Server className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{protocolMetrics.activeProtocols}</div>
              <div className="text-sm text-gray-600">Active Protocols</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-blue-400/30">
            <CardContent className="p-4 text-center">
              <Zap className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{protocolMetrics.avgResponseTime}s</div>
              <div className="text-sm text-gray-600">Avg Response</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-blue-400/30">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{(protocolMetrics.errorRate * 100).toFixed(2)}%</div>
              <div className="text-sm text-gray-600">Error Rate</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-blue-400/30">
            <CardContent className="p-4 text-center">
              <Monitor className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{protocolMetrics.throughput}/min</div>
              <div className="text-sm text-gray-600">Throughput</div>
            </CardContent>
          </Card>
          <Card className="border-2 border-blue-400/30">
            <CardContent className="p-4 text-center">
              <Database className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{protocolMetrics.dataTransferred}</div>
              <div className="text-sm text-gray-600">Data Transfer</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="servers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="servers">MCP Servers</TabsTrigger>
            <TabsTrigger value="clients">MCP Clients</TabsTrigger>
            <TabsTrigger value="protocols">Protocols</TabsTrigger>
            <TabsTrigger value="settings">Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="servers" className="space-y-6">
            {/* Add New Server */}
            <Card className="border-2 border-blue-400/30">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Plus className="w-5 h-5 text-blue-600" />
                    <span>Add New MCP Server</span>
                  </div>
                  <Button 
                    onClick={connectNewServer} 
                    disabled={isConnecting}
                    className="bg-gradient-to-r from-blue-500 to-purple-500"
                  >
                    {isConnecting ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    {isConnecting ? 'Connecting...' : 'Connect Server'}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input placeholder="Server Name" />
                  <Input placeholder="Endpoint URL" />
                  <Input placeholder="Authentication Token" />
                </div>
              </CardContent>
            </Card>

            {/* Server List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mcpServers.map((server) => (
                <Card key={server.id} className="border-2 border-blue-400/30 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getTypeIcon(server.type)}
                        <span className="font-semibold">{server.name}</span>
                        {getStatusIcon(server.status)}
                      </div>
                      <Badge className={getTypeColor(server.type)}>
                        {server.type}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Endpoint:</span>
                        <div className="font-mono text-xs bg-gray-100 p-1 rounded mt-1">{server.endpoint}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Connections:</span>
                        <div className="font-semibold">{server.connections}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Last Ping:</span>
                        <div className="font-semibold">{server.lastPing}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Uptime:</span>
                        <div className="font-semibold text-green-600">{server.uptime}</div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 pt-2 border-t">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleServerAction('restart', server.id)}
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Restart
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleServerAction('configure', server.id)}
                      >
                        <Settings className="w-3 h-3 mr-1" />
                        Config
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleServerAction('monitor', server.id)}
                      >
                        <Monitor className="w-3 h-3 mr-1" />
                        Monitor
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleServerAction('stop', server.id)}
                      >
                        <Pause className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {mcpClients.map((client) => (
                <Card key={client.id} className="border-2 border-blue-400/30">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Globe className="w-5 h-5 text-blue-600" />
                      <span>{client.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Status</span>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-medium text-green-600">{client.status}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Connected Servers</span>
                        <span className="font-semibold">{client.connectedServers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Last Activity</span>
                        <span className="font-semibold">{client.lastActivity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Requests/min</span>
                        <span className="font-semibold text-blue-600">{client.requestsPerMin}</span>
                      </div>
                    </div>
                    
                    <Button className="w-full" variant="outline">
                      <Link className="w-4 h-4 mr-2" />
                      View Connections
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="protocols" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-2 border-blue-400/30">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Network className="w-5 h-5 text-blue-600" />
                    <span>Protocol Specifications</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">JSON-RPC 2.0 Protocol</h4>
                      <div className="text-sm text-blue-700 space-y-1">
                        <p>• Request/Response messaging format</p>
                        <p>• Error handling and validation</p>
                        <p>• Notification support</p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">Transport Mechanisms</h4>
                      <div className="text-sm text-green-700 space-y-1">
                        <p>• stdio (Standard Input/Output)</p>
                        <p>• HTTP with Server-Sent Events</p>
                        <p>• WebSocket connections</p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-800 mb-2">Core Primitives</h4>
                      <div className="text-sm text-purple-700 space-y-1">
                        <p>• Tools (model-controlled actions)</p>
                        <p>• Resources (application data)</p>
                        <p>• Prompts (user workflows)</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-400/30">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Code className="w-5 h-5 text-blue-600" />
                    <span>Protocol Examples</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Tool Invocation</h4>
                      <div className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs font-mono">
                        <pre>{`{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "query_database",
    "arguments": {
      "table": "users",
      "filter": "active = true"
    }
  }
}`}</pre>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Resource Request</h4>
                      <div className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs font-mono">
                        <pre>{`{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "resources/get",
  "params": {
    "uri": "file://docs/api.md"
  }
}`}</pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="border-2 border-blue-400/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-blue-600" />
                  <span>MCP Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Global Settings</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Default Timeout (seconds)
                        </label>
                        <Input type="number" defaultValue="30" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Max Concurrent Connections
                        </label>
                        <Input type="number" defaultValue="100" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Retry Attempts
                        </label>
                        <Input type="number" defaultValue="3" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Security Settings</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Authentication Method
                        </label>
                        <Input defaultValue="bearer-token" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Rate Limit (requests/min)
                        </label>
                        <Input type="number" defaultValue="1000" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CORS Origins
                        </label>
                        <Input defaultValue="*" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-4 pt-4 border-t">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500">
                    Save Configuration
                  </Button>
                  <Button variant="outline">
                    Reset to Defaults
                  </Button>
                  <Button variant="outline">
                    Export Config
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MCPCenter;
