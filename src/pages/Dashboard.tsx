import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Brain, Database, Network, Users, Zap, Clock, CheckCircle, AlertTriangle, TrendingUp, Activity, Globe, Server, Cpu, HardDrive } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
const Dashboard = () => {
  const [systemStats, setSystemStats] = useState({
    totalProjects: 127,
    activeAgents: 23,
    mcpConnections: 45,
    ragQueries: 1543,
    responseTime: 0.23,
    uptime: 99.97
  });
  const [performanceData] = useState([{
    time: '00:00',
    rag: 120,
    mcp: 89,
    a2a: 67
  }, {
    time: '04:00',
    rag: 145,
    mcp: 102,
    a2a: 78
  }, {
    time: '08:00',
    rag: 200,
    mcp: 134,
    a2a: 95
  }, {
    time: '12:00',
    rag: 310,
    mcp: 189,
    a2a: 134
  }, {
    time: '16:00',
    rag: 280,
    mcp: 167,
    a2a: 121
  }, {
    time: '20:00',
    rag: 190,
    mcp: 123,
    a2a: 89
  }]);
  const [protocolDistribution] = useState([{
    name: 'RAG 2.0',
    value: 45,
    color: '#3B82F6'
  }, {
    name: 'MCP',
    value: 35,
    color: '#8B5CF6'
  }, {
    name: 'A2A',
    value: 20,
    color: '#EF4444'
  }]);
  const [recentActivities] = useState([{
    id: 1,
    type: 'rag',
    message: 'RAG 2.0 knowledge base updated with 1,200 new documents',
    time: '2 minutes ago',
    status: 'success'
  }, {
    id: 2,
    type: 'mcp',
    message: 'MCP server connection established with GitHub integration',
    time: '5 minutes ago',
    status: 'success'
  }, {
    id: 3,
    type: 'a2a',
    message: 'Agent collaboration completed for project "EcommercePro"',
    time: '8 minutes ago',
    status: 'success'
  }, {
    id: 4,
    type: 'system',
    message: 'DeepSeek Reasoner model updated to latest version',
    time: '15 minutes ago',
    status: 'info'
  }, {
    id: 5,
    type: 'error',
    message: 'Temporary connection timeout to external API (auto-resolved)',
    time: '1 hour ago',
    status: 'warning'
  }]);
  useEffect(() => {
    console.log('🚀 NoCodeLos Blueprint Stack Dashboard initialized with full monitoring');

    // Simulate real-time updates
    const interval = setInterval(() => {
      setSystemStats(prev => ({
        ...prev,
        ragQueries: prev.ragQueries + Math.floor(Math.random() * 5),
        activeAgents: prev.activeAgents + (Math.random() > 0.5 ? 1 : -1),
        responseTime: Math.max(0.1, prev.responseTime + (Math.random() - 0.5) * 0.1)
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  const StatCard = ({
    title,
    value,
    unit,
    icon: Icon,
    trend,
    color
  }: any) => <Card className="border-2 border-blue-400/30 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-gray-900">{value}</span>
              {unit && <span className="text-sm text-gray-500">{unit}</span>}
            </div>
            {trend && <div className="flex items-center mt-2">
                <TrendingUp className={`w-4 h-4 mr-1 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`} />
                <span className={`text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(trend)}% from last hour
                </span>
              </div>}
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-r ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>;
  return <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-20 pb-12">
      <div className="container mx-auto px-6 bg-zinc-950">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-logo-text mb-2">
            NoCodeLos Blueprint Stack Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Real-time monitoring of RAG 2.0, MCP & A2A protocol ecosystem
          </p>
        </div>

        {/* System Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <StatCard title="Total Projects" value={systemStats.totalProjects} icon={BarChart3} trend={12} color="from-blue-500 to-blue-600" />
          <StatCard title="Active Agents" value={systemStats.activeAgents} icon={Users} trend={8} color="from-purple-500 to-purple-600" />
          <StatCard title="MCP Connections" value={systemStats.mcpConnections} icon={Network} trend={-3} color="from-green-500 to-green-600" />
          <StatCard title="RAG Queries" value={systemStats.ragQueries} icon={Database} trend={25} color="from-orange-500 to-orange-600" />
          <StatCard title="Response Time" value={systemStats.responseTime.toFixed(2)} unit="sec" icon={Zap} trend={-15} color="from-red-500 to-red-600" />
          <StatCard title="System Uptime" value={systemStats.uptime} unit="%" icon={CheckCircle} trend={0.02} color="from-indigo-500 to-indigo-600" />
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-1/2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="protocols">Protocols</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Protocol Performance Chart */}
              <Card className="border-2 border-blue-400/30">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    <span>Protocol Performance (24h)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="rag" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="mcp" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="a2a" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Protocol Distribution */}
              <Card className="border-2 border-blue-400/30">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <span>Protocol Usage Distribution</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={protocolDistribution} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={entry => `${entry.name}: ${entry.value}%`}>
                        {protocolDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="border-2 border-blue-400/30">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Server className="w-5 h-5 text-blue-600" />
                    <span>MCP Server Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Auth Provider</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600">Online</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Payment Processor</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600">Online</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">RAG Retriever</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-xs text-yellow-600">Busy</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Knowledge Indexer</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600">Online</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-400/30">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Cpu className="w-5 h-5 text-purple-600" />
                    <span>System Resources</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">CPU Usage</span>
                      <span className="text-sm text-gray-600">34%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{
                      width: '34%'
                    }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Memory</span>
                      <span className="text-sm text-gray-600">67%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{
                      width: '67%'
                    }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Network I/O</span>
                      <span className="text-sm text-gray-600">23%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{
                      width: '23%'
                    }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-400/30">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <HardDrive className="w-5 h-5 text-orange-600" />
                    <span>Storage Usage</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold gradient-logo-text mb-2">2.4TB</div>
                    <div className="text-sm text-gray-600 mb-4">of 5TB used</div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full" style={{
                      width: '48%'
                    }}></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-blue-600 font-medium">RAG Database</div>
                        <div className="text-gray-600">1.8TB</div>
                      </div>
                      <div>
                        <div className="text-purple-600 font-medium">MCP Cache</div>
                        <div className="text-gray-600">0.6TB</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="protocols" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* RAG 2.0 Status */}
              <Card className="border-2 border-blue-400/30">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="w-5 h-5 text-blue-600" />
                    <span>RAG 2.0 Database Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Indexed Documents</div>
                        <div className="text-2xl font-bold text-blue-600">47,392</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Query Accuracy</div>
                        <div className="text-2xl font-bold text-green-600">99.7%</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Avg Retrieval Time</div>
                        <div className="text-2xl font-bold text-orange-600">0.12s</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Vector Embeddings</div>
                        <div className="text-2xl font-bold text-purple-600">2.4M</div>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                    <Database className="w-4 h-4 mr-2" />
                    Manage RAG Database
                  </Button>
                </CardContent>
              </Card>

              {/* A2A Agent Network */}
              <Card className="border-2 border-blue-400/30">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-red-600" />
                    <span>A2A Agent Network</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">Active Agents</div>
                        <div className="text-2xl font-bold text-red-600">{systemStats.activeAgents}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Completed Tasks</div>
                        <div className="text-2xl font-bold text-green-600">1,847</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Avg Collaboration Time</div>
                        <div className="text-2xl font-bold text-blue-600">4.2min</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Success Rate</div>
                        <div className="text-2xl font-bold text-purple-600">98.3%</div>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600">
                    <Users className="w-4 h-4 mr-2" />
                    Configure Agent Network
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="border-2 border-blue-400/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span>Recent System Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map(activity => <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full mt-2 ${activity.status === 'success' ? 'bg-green-500' : activity.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${activity.status === 'success' ? 'bg-green-100 text-green-800' : activity.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                        {activity.type.toUpperCase()}
                      </div>
                    </div>)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <Button className="h-auto p-6 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 flex-col space-y-2">
            <Brain className="w-8 h-8" />
            <span className="font-semibold">Create New Prompt</span>
          </Button>
          <Button className="h-auto p-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 flex-col space-y-2">
            <Database className="w-8 h-8" />
            <span className="font-semibold">Update RAG Database</span>
          </Button>
          <Button className="h-auto p-6 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 flex-col space-y-2">
            <Network className="w-8 h-8" />
            <span className="font-semibold">Configure MCP</span>
          </Button>
          <Button className="h-auto p-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 flex-col space-y-2">
            <Users className="w-8 h-8" />
            <span className="font-semibold">Deploy Agent</span>
          </Button>
        </div>
      </div>
    </div>;
};
export default Dashboard;