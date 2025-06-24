
import React from 'react';
import { Globe, Database, Shield, Code, Zap, Monitor } from 'lucide-react';

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
          <span className="text-gray-600 text-sm">localhost:3000</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-600">Live</span>
        </div>
      </div>
      
      {/* App Content */}
      <div className="p-6 h-96 overflow-y-auto bg-gradient-to-br from-gray-50 to-white">
        {/* App Header */}
        <div className={`transition-all duration-1000 ${hasElement('project-setup') ? 'animate-fade-in' : 'opacity-0'}`}>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              My Lovable App
            </h1>
            <p className="text-gray-600 mt-2">Built with Lovable AI Platform</p>
          </div>
        </div>

        {/* Navigation */}
        {hasElement('components') && (
          <div className="animate-scale-in mb-6">
            <nav className="flex gap-4 p-4 bg-white rounded-lg shadow-sm border">
              <button className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors">
                Dashboard
              </button>
              <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                Users
              </button>
              <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                Settings
              </button>
            </nav>
          </div>
        )}

        {/* Auth Section */}
        {hasElement('auth') && (
          <div className="animate-fade-in mb-6">
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
                <h3 className="font-semibold text-blue-800">Authentication System</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="p-3 border rounded-md bg-white"
                  disabled
                />
                <input 
                  type="password" 
                  placeholder="Password" 
                  className="p-3 border rounded-md bg-white"
                  disabled
                />
              </div>
              <button className="w-full mt-4 p-3 bg-blue-600 text-white rounded-md font-medium">
                Sign In Securely
              </button>
            </div>
          </div>
        )}

        {/* Database Status */}
        {hasElement('database') && (
          <div className="animate-scale-in mb-6">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200 flex items-center gap-3">
              <Database className="w-5 h-5 text-green-600" />
              <div>
                <h4 className="font-semibold text-green-800">Database Connected</h4>
                <p className="text-sm text-green-600">Supabase PostgreSQL • Real-time enabled</p>
              </div>
              <div className="ml-auto">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        {/* API Status */}
        {hasElement('api') && (
          <div className="animate-fade-in mb-6">
            <div className="grid grid-cols-1 gap-3">
              <div className="p-3 bg-gray-100 rounded-lg flex justify-between items-center">
                <span className="text-gray-800 font-mono text-sm">GET /api/users</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">200 OK</span>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg flex justify-between items-center">
                <span className="text-gray-800 font-mono text-sm">POST /api/users</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">201 Created</span>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg flex justify-between items-center">
                <span className="text-gray-800 font-mono text-sm">WebSocket /realtime</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Connected</span>
              </div>
            </div>
          </div>
        )}

        {/* State Management */}
        {hasElement('state') && (
          <div className="animate-scale-in mb-6">
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold text-purple-800">Global State</h4>
              </div>
              <div className="space-y-2">
                {['User Authentication', 'Data Caching', 'Real-time Updates'].map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="text-purple-700">{item}</span>
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Production Ready */}
        {hasElement('production') && (
          <div className="animate-fade-in">
            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <Monitor className="w-6 h-6 text-green-600" />
                <h4 className="font-bold text-green-800">🚀 Production Ready!</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-700">Performance:</span>
                  <span className="font-semibold text-green-800">98/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Accessibility:</span>
                  <span className="font-semibold text-green-800">100/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Best Practices:</span>
                  <span className="font-semibold text-green-800">95/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">SEO:</span>
                  <span className="font-semibold text-green-800">92/100</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LivePreview;
