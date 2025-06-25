
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Activity, Database, Zap } from 'lucide-react';

const Analytics = () => {
  const performanceData = [
    { name: 'Mon', rag: 4000, mcp: 2400, a2a: 2400 },
    { name: 'Tue', rag: 3000, mcp: 1398, a2a: 2210 },
    { name: 'Wed', rag: 2000, mcp: 9800, a2a: 2290 },
    { name: 'Thu', rag: 2780, mcp: 3908, a2a: 2000 },
    { name: 'Fri', rag: 1890, mcp: 4800, a2a: 2181 },
    { name: 'Sat', rag: 2390, mcp: 3800, a2a: 2500 },
    { name: 'Sun', rag: 3490, mcp: 4300, a2a: 2100 },
  ];

  const pieData = [
    { name: 'RAG Queries', value: 45, color: '#3B82F6' },
    { name: 'MCP Calls', value: 30, color: '#8B5CF6' },
    { name: 'A2A Messages', value: 25, color: '#EF4444' },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-logo-text mb-4">
            Blueprint Stack Analytics
          </h1>
          <p className="text-purple-300 text-lg">
            Real-time monitoring and performance insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-blue-400/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-blue-400">12.4K</p>
                  <p className="text-gray-400">RAG Queries</p>
                </div>
                <Database className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-purple-400/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-purple-400">8.2K</p>
                  <p className="text-gray-400">MCP Calls</p>
                </div>
                <Zap className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-red-400/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-red-400">6.8K</p>
                  <p className="text-gray-400">A2A Messages</p>
                </div>
                <Activity className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-green-400/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-400">99.2%</p>
                  <p className="text-gray-400">Uptime</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gray-900 border-blue-400/30">
            <CardHeader>
              <CardTitle>System Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }} 
                  />
                  <Line type="monotone" dataKey="rag" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="mcp" stroke="#8B5CF6" strokeWidth={2} />
                  <Line type="monotone" dataKey="a2a" stroke="#EF4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-purple-400/30">
            <CardHeader>
              <CardTitle>Protocol Usage Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
