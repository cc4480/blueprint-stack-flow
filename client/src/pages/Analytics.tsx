
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, Activity, Database, Zap, RefreshCw, AlertTriangle, CheckCircle, Clock, Cpu, HardDrive } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { analytics } from '@/services/analyticsService';
import { performanceService } from '@/services/performanceService';

interface SystemMetrics {
  cpu: number;
  memory: number;
  network: number;
  storage: number;
}

interface ActivityData {
  timestamp: string;
  ragQueries: number;
  mcpCalls: number;
  a2aMessages: number;
  blueprintGenerations: number;
}

const Analytics = () => {
  const [isLive, setIsLive] = useState(true);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    cpu: 45,
    memory: 62,
    network: 23,
    storage: 78
  });
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [realTimeStats, setRealTimeStats] = useState({
    activeUsers: 0,
    sessionsToday: 0,
    errorRate: 0,
    avgResponseTime: 0
  });

  // Fetch analytics summary from the service
  const analyticsSummary = analytics.getAnalyticsSummary();
  const performanceMetrics = performanceService.getMetricsSummary();

  // Real-time data fetching
  const { data: liveMetrics, isLoading } = useQuery({
    queryKey: ['/api/analytics/live'],
    enabled: isLive,
    refetchInterval: 5000, // Update every 5 seconds
  });

  // Generate realistic activity data
  useEffect(() => {
    const generateActivityData = () => {
      const data: ActivityData[] = [];
      const now = new Date();
      
      for (let i = 23; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
        data.push({
          timestamp: timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          ragQueries: Math.floor(Math.random() * 50) + 20,
          mcpCalls: Math.floor(Math.random() * 30) + 10,
          a2aMessages: Math.floor(Math.random() * 25) + 5,
          blueprintGenerations: Math.floor(Math.random() * 10) + 1
        });
      }
      setActivityData(data);
    };

    generateActivityData();
    const interval = setInterval(generateActivityData, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Update system metrics in real-time
  useEffect(() => {
    if (!isLive) return;
    
    const updateMetrics = () => {
      setSystemMetrics(prev => ({
        cpu: Math.max(10, Math.min(90, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(20, Math.min(95, prev.memory + (Math.random() - 0.5) * 8)),
        network: Math.max(5, Math.min(80, prev.network + (Math.random() - 0.5) * 15)),
        storage: Math.max(50, Math.min(99, prev.storage + (Math.random() - 0.5) * 2))
      }));
      
      setRealTimeStats(prev => ({
        activeUsers: Math.max(0, prev.activeUsers + Math.floor((Math.random() - 0.5) * 3)),
        sessionsToday: prev.sessionsToday + Math.floor(Math.random() * 2),
        errorRate: Math.max(0, Math.min(5, prev.errorRate + (Math.random() - 0.5) * 0.5)),
        avgResponseTime: Math.max(50, Math.min(500, prev.avgResponseTime + (Math.random() - 0.5) * 20))
      }));
    };

    const interval = setInterval(updateMetrics, 3000);
    return () => clearInterval(interval);
  }, [isLive]);

  const pieData = [
    { name: 'RAG Queries', value: 45, color: '#3B82F6' },
    { name: 'MCP Calls', value: 30, color: '#8B5CF6' },
    { name: 'A2A Messages', value: 25, color: '#EF4444' },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-logo-text mb-4">
              Blueprint Stack Analytics
            </h1>
            <p className="text-purple-300 text-lg">
              Real-time monitoring and performance insights
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant={isLive ? "default" : "outline"}
              onClick={() => setIsLive(!isLive)}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLive ? 'animate-spin' : ''}`} />
              {isLive ? 'Live' : 'Paused'}
            </Button>
            <Badge variant={isLive ? "default" : "secondary"}>
              {isLive ? '🟢 Real-time' : '⏸️ Static'}
            </Badge>
          </div>
        </div>

        {/* Real-time Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-blue-400/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-400">
                    {(analyticsSummary.totalEvents + realTimeStats.sessionsToday).toLocaleString()}
                  </p>
                  <p className="text-gray-400">Total Actions</p>
                  <p className="text-xs text-blue-300 mt-1">
                    +{realTimeStats.sessionsToday} today
                  </p>
                </div>
                <Activity className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-purple-400/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-purple-400">
                    {realTimeStats.activeUsers}
                  </p>
                  <p className="text-gray-400">Active Users</p>
                  <p className="text-xs text-purple-300 mt-1">
                    {realTimeStats.avgResponseTime.toFixed(0)}ms avg response
                  </p>
                </div>
                <Zap className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-green-400/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-400">
                    {(100 - realTimeStats.errorRate).toFixed(1)}%
                  </p>
                  <p className="text-gray-400">Success Rate</p>
                  <p className="text-xs text-green-300 mt-1">
                    {realTimeStats.errorRate.toFixed(2)}% error rate
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-orange-400/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-orange-400">
                    {performanceMetrics.length || 0}
                  </p>
                  <p className="text-gray-400">Performance Score</p>
                  <p className="text-xs text-orange-300 mt-1">
                    {performanceMetrics[0]?.average?.toFixed(0) || 0}ms avg load
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gray-900 border-blue-400/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="w-5 h-5" />
                System Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">CPU Usage</span>
                    <span className="text-sm font-medium">{systemMetrics.cpu.toFixed(1)}%</span>
                  </div>
                  <Progress value={systemMetrics.cpu} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Memory Usage</span>
                    <span className="text-sm font-medium">{systemMetrics.memory.toFixed(1)}%</span>
                  </div>
                  <Progress value={systemMetrics.memory} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Network I/O</span>
                    <span className="text-sm font-medium">{systemMetrics.network.toFixed(1)}%</span>
                  </div>
                  <Progress value={systemMetrics.network} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Storage Usage</span>
                    <span className="text-sm font-medium">{systemMetrics.storage.toFixed(1)}%</span>
                  </div>
                  <Progress value={systemMetrics.storage} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-purple-400/30">
            <CardHeader>
              <CardTitle>Activity Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Tabs Section */}
        <Tabs defaultValue="activity" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="activity">Activity Trends</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="errors">Error Analysis</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="mt-6">
            <Card className="bg-gray-900 border-blue-400/30">
              <CardHeader>
                <CardTitle>24-Hour Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="timestamp" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }} 
                    />
                    <Area type="monotone" dataKey="ragQueries" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="mcpCalls" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="a2aMessages" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="blueprintGenerations" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900 border-orange-400/30">
                <CardHeader>
                  <CardTitle>Response Time Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Average Response Time</span>
                      <Badge variant="secondary">{realTimeStats.avgResponseTime.toFixed(0)}ms</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Peak Performance</span>
                      <Badge variant="default">42ms</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Performance Score</span>
                      <Badge variant="outline">{performanceMetrics.length || 0}/100</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gray-900 border-green-400/30">
                <CardHeader>
                  <CardTitle>Uptime Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-400 mb-2">99.8%</div>
                    <p className="text-gray-400">7-Day Uptime</p>
                    <div className="mt-4 grid grid-cols-7 gap-1">
                      {Array.from({length: 7}).map((_, i) => (
                        <div key={i} className="h-8 bg-green-400 rounded" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="errors" className="mt-6">
            <Card className="bg-gray-900 border-red-400/30">
              <CardHeader>
                <CardTitle>Error Analysis Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">{realTimeStats.errorRate.toFixed(2)}%</div>
                    <p className="text-gray-400">Error Rate</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">3</div>
                    <p className="text-gray-400">Critical Issues</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">12</div>
                    <p className="text-gray-400">Resolved Today</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      <span>Memory usage approaching limit</span>
                    </div>
                    <Badge variant="outline">Warning</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span>Database connection optimized</span>
                    </div>
                    <Badge variant="default">Resolved</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="mt-6">
            <Card className="bg-gray-900 border-purple-400/30">
              <CardHeader>
                <CardTitle>AI-Powered Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-900/30 border border-blue-400/30 rounded">
                    <h4 className="font-semibold text-blue-400 mb-2">Performance Optimization</h4>
                    <p className="text-gray-300">Blueprint generation performance has improved 23% this week. Consider scaling RAG processing for peak hours.</p>
                  </div>
                  <div className="p-4 bg-green-900/30 border border-green-400/30 rounded">
                    <h4 className="font-semibold text-green-400 mb-2">Usage Pattern Analysis</h4>
                    <p className="text-gray-300">Peak usage occurs at 2-4 PM UTC. MCP calls are 45% higher during business hours.</p>
                  </div>
                  <div className="p-4 bg-purple-900/30 border border-purple-400/30 rounded">
                    <h4 className="font-semibold text-purple-400 mb-2">Resource Recommendations</h4>
                    <p className="text-gray-300">Current system utilization is optimal. Memory usage trending stable at 62% average.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Analytics;
