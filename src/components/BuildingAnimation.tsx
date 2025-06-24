
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code, Database, Layout, Shield, Zap, CheckCircle } from 'lucide-react';

const BuildingAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [typingText, setTypingText] = useState('');
  const [showingCode, setShowingCode] = useState(false);

  const steps = [
    { 
      name: 'Project Setup', 
      description: 'Initializing React + TypeScript project',
      icon: <Layout className="w-6 h-6" />,
      code: `npx create-react-app my-app --template typescript
cd my-app
npm install @radix-ui/react-dialog tailwindcss`,
      duration: 3000
    },
    { 
      name: 'Component Structure', 
      description: 'Building reusable UI components',
      icon: <Code className="w-6 h-6" />,
      code: `// Button.tsx
export const Button = ({ children, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      {children}
    </button>
  );
};`,
      duration: 4000
    },
    { 
      name: 'Authentication', 
      description: 'Implementing secure login system',
      icon: <Shield className="w-6 h-6" />,
      code: `// AuthProvider.tsx
const AuthContext = createContext();

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const login = async (email, password) => {
    const response = await signIn(email, password);
    setUser(response.user);
  };
}`,
      duration: 5000
    },
    { 
      name: 'Database Integration', 
      description: 'Connecting to Supabase backend',
      icon: <Database className="w-6 h-6" />,
      code: `// supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://your-project.supabase.co'
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)`,
      duration: 4000
    },
    { 
      name: 'API Routes', 
      description: 'Creating RESTful endpoints',
      icon: <Zap className="w-6 h-6" />,
      code: `// api/users.ts
export const getUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
};`,
      duration: 3500
    },
    { 
      name: 'Production Ready', 
      description: 'Optimizing and deploying',
      icon: <CheckCircle className="w-6 h-6" />,
      code: `npm run build
npm run test
npm run deploy

✅ Build successful!
✅ Tests passing!
✅ Deployed to production!`,
      duration: 3000
    }
  ];

  // Typing animation effect
  useEffect(() => {
    if (showingCode && currentStep < steps.length) {
      const code = steps[currentStep].code;
      let index = 0;
      setTypingText('');
      
      const typeTimer = setInterval(() => {
        if (index < code.length) {
          setTypingText(code.slice(0, index + 1));
          index++;
        } else {
          clearInterval(typeTimer);
        }
      }, 30);

      return () => clearInterval(typeTimer);
    }
  }, [showingCode, currentStep, steps]);

  // Main animation progression
  useEffect(() => {
    if (isPlaying && currentStep < steps.length) {
      setShowingCode(true);
      
      const timer = setTimeout(() => {
        if (currentStep < steps.length - 1) {
          setCurrentStep(prev => prev + 1);
          setShowingCode(false);
        } else {
          // Reset animation after completion
          setTimeout(() => {
            setCurrentStep(0);
            setShowingCode(false);
            setTypingText('');
          }, 2000);
        }
      }, steps[currentStep]?.duration || 3000);

      return () => clearTimeout(timer);
    }
  }, [currentStep, isPlaying, steps]);

  const startAnimation = () => {
    setCurrentStep(0);
    setIsPlaying(true);
    setShowingCode(false);
    setTypingText('');
  };

  const pauseAnimation = () => {
    setIsPlaying(false);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto p-8">
      {/* Control Panel */}
      <div className="flex justify-center gap-4 mb-8">
        <Button 
          onClick={isPlaying ? pauseAnimation : () => setIsPlaying(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          {isPlaying ? 'Pause' : 'Resume'} Building
        </Button>
        <Button 
          onClick={startAnimation} 
          variant="outline"
          className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
        >
          Restart
        </Button>
      </div>

      {/* Main Build Container */}
      <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-8 min-h-[700px] overflow-hidden">
        {/* Terminal/Code Window */}
        <div className="relative bg-gray-900 rounded-lg border border-gray-700 mb-6 overflow-hidden">
          {/* Terminal Header */}
          <div className="bg-gray-800 px-4 py-2 flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="ml-4 text-gray-300 text-sm font-mono">Lovable AI Builder</span>
          </div>
          
          {/* Code Content */}
          <div className="p-6 h-64 overflow-y-auto">
            <pre className="text-green-400 font-mono text-sm leading-relaxed">
              {typingText}
              {showingCode && <span className="animate-pulse">|</span>}
            </pre>
          </div>
        </div>

        {/* Live Preview Window */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Progress Steps */}
          <div className="space-y-4">
            <h3 className="text-white text-xl font-bold mb-4">Build Progress</h3>
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-500 ${
                  index <= currentStep 
                    ? 'bg-green-500/20 border border-green-500/30' 
                    : index === currentStep + 1
                    ? 'bg-yellow-500/20 border border-yellow-500/30 animate-pulse'
                    : 'bg-gray-700/20 border border-gray-600/30'
                }`}
              >
                <div className={`p-2 rounded-full ${
                  index <= currentStep ? 'bg-green-500' : 'bg-gray-600'
                }`}>
                  {index <= currentStep ? <CheckCircle className="w-4 h-4 text-white" /> : step.icon}
                </div>
                <div>
                  <div className={`font-semibold ${
                    index <= currentStep ? 'text-green-400' : 'text-gray-300'
                  }`}>
                    {step.name}
                  </div>
                  <div className="text-gray-400 text-sm">{step.description}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Live App Preview */}
          <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
            <div className="bg-gray-100 px-4 py-2 border-b">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="ml-4 text-gray-600 text-sm">localhost:3000</span>
              </div>
            </div>
            
            <div className="p-6 h-96 overflow-y-auto">
              {/* Dynamically show built components based on current step */}
              {currentStep >= 0 && (
                <div className="animate-fade-in">
                  <div className="text-center text-gray-600 mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">My App</h1>
                    <p className="text-gray-600">Building in progress...</p>
                  </div>
                </div>
              )}
              
              {currentStep >= 1 && (
                <div className="animate-fade-in space-y-4">
                  <button className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                    Sample Button
                  </button>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold text-gray-800">Card Component</h3>
                    <p className="text-gray-600">Reusable UI component</p>
                  </div>
                </div>
              )}
              
              {currentStep >= 2 && (
                <div className="animate-fade-in mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Login Form</h4>
                  <input 
                    type="email" 
                    placeholder="Email" 
                    className="w-full p-2 border rounded mb-2"
                    disabled
                  />
                  <input 
                    type="password" 
                    placeholder="Password" 
                    className="w-full p-2 border rounded mb-2"
                    disabled
                  />
                  <button className="w-full p-2 bg-blue-500 text-white rounded">
                    Sign In
                  </button>
                </div>
              )}
              
              {currentStep >= 3 && (
                <div className="animate-fade-in mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Database Connected</h4>
                  <div className="text-sm text-green-600">
                    ✅ Supabase connection established
                  </div>
                </div>
              )}
              
              {currentStep >= 4 && (
                <div className="animate-fade-in mt-4">
                  <div className="grid grid-cols-1 gap-2">
                    {['User 1', 'User 2', 'User 3'].map((user, i) => (
                      <div key={i} className="p-2 bg-gray-100 rounded flex justify-between items-center">
                        <span className="text-gray-800">{user}</span>
                        <span className="text-xs text-gray-500">Online</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {currentStep >= 5 && (
                <div className="animate-fade-in mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800">🚀 Production Ready!</h4>
                  <p className="text-purple-600 text-sm">Your app is live and optimized</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Building Particles Effect */}
        <div className="absolute inset-0 pointer-events-none">
          {isPlaying && [...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-purple-400 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Current Step Info */}
      <div className="text-center mt-6">
        <h3 className="text-xl font-semibold text-white mb-2">
          {steps[currentStep]?.name}
        </h3>
        <p className="text-purple-200">
          {steps[currentStep]?.description}
        </p>
      </div>
    </div>
  );
};

export default BuildingAnimation;
