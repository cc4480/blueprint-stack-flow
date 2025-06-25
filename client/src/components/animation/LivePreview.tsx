
import React from 'react';
import { Globe, Database, Shield, Code, Zap, Monitor, Users, Settings, Bell, Search, Plus, Edit, Trash2, Eye, Heart, MessageCircle, Share2, Calendar, FileText, BarChart3, CreditCard } from 'lucide-react';

interface LivePreviewProps {
  currentStep: number;
  builtElements: string[];
}

const LivePreview = ({ currentStep, builtElements }: LivePreviewProps) => {
  const hasElement = (elementId: string) => builtElements.includes(elementId);

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-2xl border border-gray-200">
      {/* Browser Header */}
      <div className="bg-gray-100 px-4 py-3 border-b flex items-center gap-3">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="flex items-center gap-2 ml-4 bg-white rounded-full px-3 py-1 border">
          <Globe className="w-4 h-4 text-gray-600" />
          <span className="text-gray-600 text-sm">myapp.com</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-600">Live</span>
        </div>
      </div>
      
      {/* App Content */}
      <div className="h-96 overflow-y-auto bg-gradient-to-br from-gray-50 to-white">
        {/* App Header with Navigation */}
        <div className={`transition-all duration-1000 ${hasElement('project-setup') ? 'animate-fade-in' : 'opacity-0'}`}>
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">TaskFlow</h1>
              </div>
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-600 hover:text-gray-900 cursor-pointer" />
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-purple-600">JD</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        {hasElement('components') && (
          <div className="animate-scale-in px-6 py-4 bg-white border-b">
            <nav className="flex gap-6">
              <button className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium">
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <FileText className="w-4 h-4" />
                Projects
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Users className="w-4 h-4" />
                Team
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </nav>
          </div>
        )}

        <div className="p-6">
          {/* Dashboard Stats */}
          {hasElement('components') && (
            <div className="animate-fade-in mb-6">
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm font-medium">Active Projects</p>
                      <p className="text-2xl font-bold text-blue-900">24</p>
                    </div>
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 text-sm font-medium">Completed</p>
                      <p className="text-2xl font-bold text-green-900">156</p>
                    </div>
                    <Eye className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-600 text-sm font-medium">Team Members</p>
                      <p className="text-2xl font-bold text-yellow-900">12</p>
                    </div>
                    <Users className="w-8 h-8 text-yellow-600" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600 text-sm font-medium">Revenue</p>
                      <p className="text-2xl font-bold text-purple-900">$24k</p>
                    </div>
                    <CreditCard className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Authentication Section */}
          {hasElement('auth') && (
            <div className="animate-fade-in mb-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-blue-600" />
                    <h3 className="font-semibold text-blue-800">User Authentication</h3>
                  </div>
                  <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    ✓ Secure
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-purple-600">JD</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">John Doe</p>
                        <p className="text-sm text-gray-600">john@example.com</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 p-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                      Manage Users
                    </button>
                    <button className="px-4 py-3 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Database Status */}
          {hasElement('database') && (
            <div className="animate-scale-in mb-6">
              <div className="bg-green-50 rounded-lg border border-green-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Database className="w-6 h-6 text-green-600" />
                    <h4 className="font-semibold text-green-800">Database Status</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-600">Connected</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Tables</p>
                    <p className="text-xl font-bold text-gray-900">8</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Records</p>
                    <p className="text-xl font-bold text-gray-900">1.2k</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Storage</p>
                    <p className="text-xl font-bold text-gray-900">24MB</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* API Endpoints */}
          {hasElement('api') && (
            <div className="animate-fade-in mb-6">
              <div className="bg-gray-50 rounded-lg border p-6">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  API Endpoints
                </h4>
                <div className="space-y-2">
                  {[
                    { method: 'GET', endpoint: '/api/projects', status: '200', desc: 'Fetch all projects' },
                    { method: 'POST', endpoint: '/api/projects', status: '201', desc: 'Create new project' },
                    { method: 'PUT', endpoint: '/api/projects/:id', status: '200', desc: 'Update project' },
                    { method: 'DELETE', endpoint: '/api/projects/:id', status: '204', desc: 'Delete project' },
                    { method: 'GET', endpoint: '/api/users', status: '200', desc: 'Get user list' },
                    { method: 'WebSocket', endpoint: '/realtime', status: 'Connected', desc: 'Real-time updates' }
                  ].map((api, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded text-xs font-mono ${
                          api.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                          api.method === 'POST' ? 'bg-green-100 text-green-800' :
                          api.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                          api.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {api.method}
                        </span>
                        <span className="font-mono text-sm text-gray-700">{api.endpoint}</span>
                        <span className="text-sm text-gray-500">{api.desc}</span>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        api.status.includes('20') || api.status === 'Connected' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {api.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Real-time Activity Feed */}
          {hasElement('state') && (
            <div className="animate-scale-in mb-6">
              <div className="bg-purple-50 rounded-lg border border-purple-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-purple-800 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Real-time Activity
                  </h4>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-purple-600">Live</span>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { user: 'Sarah Chen', action: 'created new project "Mobile App Redesign"', time: '2 min ago', avatar: 'SC' },
                    { user: 'Mike Johnson', action: 'completed task "API Integration"', time: '5 min ago', avatar: 'MJ' },
                    { user: 'Emma Wilson', action: 'commented on "Dashboard Updates"', time: '8 min ago', avatar: 'EW' },
                    { user: 'Alex Rodriguez', action: 'uploaded 3 new files', time: '12 min ago', avatar: 'AR' }
                  ].map((activity, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-lg">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-purple-600">{activity.avatar}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{activity.user}</span> {activity.action}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Project Cards */}
          {hasElement('state') && (
            <div className="animate-fade-in mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-800">Recent Projects</h4>
                <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  New Project
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'E-commerce Platform', progress: 85, team: 5, status: 'In Progress' },
                  { name: 'Mobile App', progress: 60, team: 3, status: 'Development' },
                  { name: 'Dashboard Redesign', progress: 95, team: 4, status: 'Review' },
                  { name: 'API Documentation', progress: 40, team: 2, status: 'Planning' }
                ].map((project, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <h5 className="font-medium text-gray-900">{project.name}</h5>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{project.team} members</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        project.status === 'Development' ? 'bg-yellow-100 text-yellow-800' :
                        project.status === 'Review' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Production Deployment */}
          {hasElement('production') && (
            <div className="animate-fade-in">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Monitor className="w-6 h-6 text-green-600" />
                    <h4 className="font-bold text-green-800">🚀 Production Deployment</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-600">Live</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <h5 className="font-semibold text-green-800 mb-3">Performance Metrics</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-green-700">Performance Score</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-green-200 rounded-full overflow-hidden">
                            <div className="w-full h-full bg-green-500 rounded-full"></div>
                          </div>
                          <span className="font-semibold text-green-800">98/100</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-green-700">Accessibility</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-green-200 rounded-full overflow-hidden">
                            <div className="w-full h-full bg-green-500 rounded-full"></div>
                          </div>
                          <span className="font-semibold text-green-800">100/100</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-green-700">SEO Score</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-green-200 rounded-full overflow-hidden">
                            <div className="w-14 h-full bg-green-500 rounded-full"></div>
                          </div>
                          <span className="font-semibold text-green-800">92/100</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold text-green-800 mb-3">Deployment Status</h5>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-700">SSL Certificate Active</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-700">CDN Optimized</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-700">Auto-scaling Enabled</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-700">Monitoring Active</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-green-800">Application URL</p>
                      <p className="text-sm text-green-600">https://taskflow.vercel.app</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      <Eye className="w-4 h-4" />
                      View Live
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
