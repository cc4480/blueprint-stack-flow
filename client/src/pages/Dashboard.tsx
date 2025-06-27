import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Brain,
  Zap,
  Database,
  Globe,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Activity,
  Server,
  FileText
} from 'lucide-react';
import SystemHealthMonitor from '@/components/SystemHealthMonitor';

// Types
interface DashboardMetrics {
  totalProjects: number;
  activeUsers: number;
  completedBuilds: number;
  avgBuildTime: number;
  successRate: number;
  ragDocuments: number;
  mcpConnections: number;
  a2aAgents: number;
}

interface ProjectActivity {
  id: string;
  name: string;
  type: 'blueprint' | 'build' | 'deploy';
  status: 'completed' | 'in-progress' | 'failed';
  timestamp: string;
  duration?: number;
}

interface UsageData {
  date: string;
  blueprints: number;
  builds: number;
  deployments: number;
}

interface SystemHealth {
  component: string;
  status: 'healthy' | 'warning' | 'error';
  uptime: number;
  responseTime: number;
}

// Mock data
const mockMetrics: DashboardMetrics = {
  totalProjects: 127,
  activeUsers: 23,
  completedBuilds: 342,
  avgBuildTime: 3.2,
  successRate: 94.7,
  ragDocuments: 156,
  mcpConnections: 8,
  a2aAgents: 12
};

const mockActivities: ProjectActivity[] = [
  {
    id: '1',
    name: 'E-commerce Platform',
    type: 'blueprint',
    status: 'completed',
    timestamp: '2025-01-25T15:30:00Z',
    duration: 180
  },
  {
    id: '2', 
    name: 'AI Chat Application',
    type: 'build',
    status: 'in-progress',
    timestamp: '2025-01-25T15:15:00Z'
  },
  {
    id: '3',
    name: 'Analytics Dashboard',
    type: 'deploy',
    status: 'completed',
    timestamp: '2025-01-25T14:45:00Z',
    duration: 45
  },
  {
    id: '4',
    name: 'Social Media App',
    type: 'blueprint',
    status: 'failed',
    timestamp: '2025-01-25T14:20:00Z'
  }
];

const mockUsageData: UsageData[] = [
  { date: '2025-01-20', blueprints: 12, builds: 8, deployments: 6 },
  { date: '2025-01-21', blueprints: 15, builds: 12, deployments: 9 },
  { date: '2025-01-22', blueprints: 18, builds: 15, deployments: 11 },
  { date: '2025-01-23', blueprints: 22, builds: 18, deployments: 14 },
  { date: '2025-01-24', blueprints: 25, builds: 20, deployments: 16 },
  { date: '2025-01-25', blueprints: 28, builds: 23, deployments: 18 }
];

const mockSystemHealth: SystemHealth[] = [
  { component: 'DeepSeek API', status: 'healthy', uptime: 99.9, responseTime: 234 },
  { component: 'RAG Engine', status: 'healthy', uptime: 99.7, responseTime: 156 },
  { component: 'MCP Gateway', status: 'warning', uptime: 98.2, responseTime: 445 },
  { component: 'A2A Network', status: 'healthy', uptime: 99.8, responseTime: 89 },
  { component: 'Database', status: 'healthy', uptime: 99.9, responseTime: 23 }
];

// Custom hooks
const useDashboardData = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>(mockMetrics);
  const [activities, setActivities] = useState<ProjectActivity[]>(mockActivities);
  const [usageData, setUsageData] = useState<UsageData[]>(mockUsageData);
  const [systemHealth, setSystemHealth] = useState<SystemHealth[]>(mockSystemHealth);
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update metrics with some variation
    setMetrics(prev => ({
      ...prev,
      activeUsers: prev.activeUsers + Math.floor(Math.random() * 5) - 2,
      avgBuildTime: Number((prev.avgBuildTime + (Math.random() - 0.5) * 0.5).toFixed(1))
    }));
    
    setIsLoading(false);
  };

  useEffect(() => {
    // Auto-refresh every 30 seconds
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, []);

  return {
    metrics,
    activities,
    usageData,
    systemHealth,
    isLoading,
    refreshData
  };
};

// Components
const MetricsGrid: React.FC<{ metrics: DashboardMetrics }> = ({ metrics }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
        <Brain className="h-4 w-4 text-blue-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-blue-600">{metrics.totalProjects}</div>
        <p className="text-xs text-muted-foreground">+12% from last month</p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
        <Users className="h-4 w-4 text-green-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-green-600">{metrics.activeUsers}</div>
        <p className="text-xs text-muted-foreground">+3 new today</p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
        <CheckCircle className="h-4 w-4 text-purple-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-purple-600">{metrics.successRate}%</div>
        <Progress value={metrics.successRate} className="mt-2" />
      </CardContent>
    </Card>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Avg Build Time</CardTitle>
        <Clock className="h-4 w-4 text-orange-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-orange-600">{metrics.avgBuildTime}min</div>
        <p className="text-xs text-muted-foreground">-0.3min improvement</p>
      </CardContent>
    </Card>
  </div>
);

const ActivityFeed: React.FC<{ activities: ProjectActivity[] }> = ({ activities }) => (
  <Card>
    <CardHeader>
      <CardTitle>Recent Activity</CardTitle>
      <CardDescription>Latest project builds and deployments</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                activity.status === 'completed' ? 'bg-green-500' :
                activity.status === 'in-progress' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <div>
                <p className="font-medium">{activity.name}</p>
                <p className="text-sm text-gray-500 capitalize">{activity.type}</p>
              </div>
            </div>
            <div className="text-right">
              <Badge 
                variant={
                  activity.status === 'completed' ? 'default' :
                  activity.status === 'in-progress' ? 'secondary' : 'destructive'
                }
              >
                {activity.status}
              </Badge>
              <p className="text-xs text-gray-500 mt-1">
                {activity.duration ? `${activity.duration}s` : 'Running...'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const UsageChart: React.FC<{ data: UsageData[] }> = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Usage Trends</CardTitle>
      <CardDescription>Daily blueprint generation and deployment activity</CardDescription>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="blueprints" stroke="#3B82F6" strokeWidth={2} name="Blueprints" />
          <Line type="monotone" dataKey="builds" stroke="#10B981" strokeWidth={2} name="Builds" />
          <Line type="monotone" dataKey="deployments" stroke="#F59E0B" strokeWidth={2} name="Deployments" />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

const SystemStatus: React.FC<{ health: SystemHealth[] }> = ({ health }) => (
  <Card>
    <CardHeader>
      <CardTitle>System Health</CardTitle>
      <CardDescription>Monitor system components and performance</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {health.map((component) => (
          <div key={component.component} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                component.status === 'healthy' ? 'bg-green-500' :
                component.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <div>
                <p className="font-medium">{component.component}</p>
                <p className="text-sm text-gray-500">{component.uptime}% uptime</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{component.responseTime}ms</p>
              <Badge 
                variant={
                  component.status === 'healthy' ? 'default' :
                  component.status === 'warning' ? 'secondary' : 'destructive'
                }
              >
                {component.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const QuickActions: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Quick Actions</CardTitle>
      <CardDescription>Common tasks and shortcuts</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 gap-4">
        <Button className="flex items-center justify-center gap-2 h-16">
          <Brain className="w-5 h-5" />
          <span>New Blueprint</span>
        </Button>
        <Button variant="outline" className="flex items-center justify-center gap-2 h-16">
          <Database className="w-5 h-5" />
          <span>RAG Upload</span>
        </Button>
        <Button variant="outline" className="flex items-center justify-center gap-2 h-16">
          <Server className="w-5 h-5" />
          <span>MCP Config</span>
        </Button>
        <Button variant="outline" className="flex items-center justify-center gap-2 h-16">
          <Activity className="w-5 h-5" />
          <span>A2A Monitor</span>
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default function Dashboard() {
  const { metrics, activities, usageData, systemHealth, isLoading, refreshData } = useDashboardData();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6 bg-[#000000]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              NoCodeLos Blueprint Stack Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Monitor your AI-powered development workflow and system performance
            </p>
          </div>
          <Button onClick={refreshData} disabled={isLoading}>
            <TrendingUp className="w-4 h-4 mr-2" />
            {isLoading ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </div>

        <MetricsGrid metrics={metrics} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <UsageChart data={usageData} />
          </div>
          <div>
            <QuickActions />
          </div>
        </div>

        <Tabs defaultValue="activity" className="space-y-6">
          <TabsList>
            <TabsTrigger value="activity">Activity Feed</TabsTrigger>
            <TabsTrigger value="system">System Status</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="activity">
            <ActivityFeed activities={activities} />
          </TabsContent>

          <TabsContent value="system">
            <SystemStatus health={systemHealth} />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Component Usage Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{metrics.ragDocuments}</div>
                      <div className="text-sm text-gray-500">RAG Documents</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{metrics.mcpConnections}</div>
                      <div className="text-sm text-gray-500">MCP Connections</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{metrics.a2aAgents}</div>
                      <div className="text-sm text-gray-500">A2A Agents</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{metrics.completedBuilds}</div>
                      <div className="text-sm text-gray-500">Total Builds</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Blueprint Generation</span>
                        <span>Fast</span>
                      </div>
                      <Progress value={85} className="mt-1" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>RAG Retrieval Speed</span>
                        <span>Optimal</span>
                      </div>
                      <Progress value={92} className="mt-1" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>MCP Response Time</span>
                        <span>Good</span>
                      </div>
                      <Progress value={78} className="mt-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <SystemHealthMonitor />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}