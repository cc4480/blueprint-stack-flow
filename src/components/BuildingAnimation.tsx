import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const BuildingAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true); // Start playing immediately

  const steps = [
    { name: 'Canvas', description: 'Starting with blank canvas' },
    { name: 'Layout', description: 'Building responsive layout' },
    { name: 'Header', description: 'Adding navigation header' },
    { name: 'Auth', description: 'Implementing authentication' },
    { name: 'Content', description: 'Creating content areas' },
    { name: 'Backend', description: 'Connecting backend services' },
    { name: 'Polish', description: 'Adding final touches' },
    { name: 'Complete', description: 'Production-ready app!' }
  ];

  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => {
          const nextStep = prev + 1;
          if (nextStep >= steps.length) {
            // Reset to beginning for continuous loop
            setTimeout(() => setCurrentStep(0), 2000);
            return prev;
          }
          return nextStep;
        });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, isPlaying, steps.length]);

  // Auto-start the animation when component mounts
  useEffect(() => {
    setIsPlaying(true);
  }, []);

  const startAnimation = () => {
    setCurrentStep(0);
    setIsPlaying(true);
  };

  const pauseAnimation = () => {
    setIsPlaying(false);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto p-8">
      {/* Control Panel */}
      <div className="flex justify-center gap-4 mb-8">
        <Button 
          onClick={isPlaying ? pauseAnimation : startAnimation}
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

      {/* Main Animation Canvas */}
      <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-8 min-h-[600px] overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(147, 51, 234, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(147, 51, 234, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-purple-400 rounded-full animate-pulse ${
                isPlaying ? 'animate-bounce' : ''
              }`}
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + i * 10}%`,
                animationDelay: `${i * 0.5}s`
              }}
            />
          ))}
        </div>

        {/* Step 0: Blank Canvas */}
        {currentStep >= 0 && (
          <div className={`transition-all duration-1000 ${currentStep >= 1 ? 'opacity-100' : 'opacity-50'}`}>
            <div className="text-center text-white/60 text-lg">
              {currentStep === 0 ? 'Ready to build...' : ''}
            </div>
          </div>
        )}

        {/* Step 1: Layout Structure */}
        {currentStep >= 1 && (
          <div className="absolute inset-4 transition-all duration-1000 transform animate-scale-in">
            <div className="grid grid-cols-12 gap-4 h-full">
              {/* Sidebar */}
              <div className="col-span-2 bg-white/10 rounded-lg border border-purple-400/30 backdrop-blur-sm animate-fade-in">
                <div className="p-4">
                  <div className="w-full h-4 bg-purple-400/40 rounded mb-3 animate-pulse"></div>
                  <div className="space-y-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-full h-2 bg-white/20 rounded animate-pulse" style={{animationDelay: `${i * 0.2}s`}}></div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Main Content Area */}
              <div className="col-span-10 bg-white/5 rounded-lg border border-purple-400/20 backdrop-blur-sm animate-fade-in" style={{animationDelay: '0.3s'}}>
                <div className="p-6 h-full">
                  <div className="w-full h-full border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-white/40">Content Area</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Header Navigation */}
        {currentStep >= 2 && (
          <div className="absolute top-4 left-4 right-4 transition-all duration-1000 transform animate-fade-in">
            <div className="bg-white/15 backdrop-blur-sm rounded-lg border border-purple-400/40 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                  <div className="w-24 h-4 bg-white/30 rounded animate-pulse"></div>
                </div>
                <div className="flex space-x-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-16 h-3 bg-white/25 rounded animate-pulse" style={{animationDelay: `${i * 0.1}s`}}></div>
                  ))}
                </div>
                <div className="w-20 h-6 bg-purple-500/50 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Authentication Forms */}
        {currentStep >= 3 && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 animate-scale-in">
            <Card className="bg-white/10 backdrop-blur-lg border-purple-400/30 p-8 w-96">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-32 h-6 bg-white/40 rounded mx-auto mb-4 animate-pulse"></div>
                </div>
                <div className="space-y-3">
                  <div className="w-full h-10 bg-white/20 rounded border border-purple-400/30 animate-pulse"></div>
                  <div className="w-full h-10 bg-white/20 rounded border border-purple-400/30 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-full h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Step 4: Content Cards */}
        {currentStep >= 4 && (
          <div className="absolute bottom-4 left-4 right-4 transition-all duration-1000">
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="bg-white/10 backdrop-blur-sm border-purple-400/30 p-4 animate-fade-in" style={{animationDelay: `${i * 0.2}s`}}>
                  <div className="space-y-3">
                    <div className="w-full h-20 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded animate-pulse"></div>
                    <div className="w-3/4 h-3 bg-white/30 rounded animate-pulse"></div>
                    <div className="w-1/2 h-2 bg-white/20 rounded animate-pulse"></div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Backend Connections */}
        {currentStep >= 5 && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Animated Connection Lines */}
            <svg className="w-full h-full absolute inset-0">
              <defs>
                <linearGradient id="connectionGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgb(147, 51, 234)" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="rgb(236, 72, 153)" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              
              {/* Flowing Lines */}
              {[...Array(4)].map((_, i) => (
                <path
                  key={i}
                  d={`M ${50 + i * 100} 50 Q ${200 + i * 50} ${100 + i * 80} ${300 + i * 80} ${200 + i * 50}`}
                  stroke="url(#connectionGrad)"
                  strokeWidth="2"
                  fill="none"
                  className="animate-pulse"
                  style={{
                    animationDelay: `${i * 0.3}s`,
                    strokeDasharray: '10,5',
                    strokeDashoffset: '15'
                  }}
                />
              ))}
            </svg>
            
            {/* Backend Service Nodes */}
            <div className="absolute top-8 right-8 space-y-4">
              {['API', 'DB', 'Auth'].map((service, i) => (
                <div 
                  key={service}
                  className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse shadow-lg"
                  style={{animationDelay: `${i * 0.2}s`}}
                >
                  {service}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Polish & Microinteractions */}
        {currentStep >= 6 && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Sparkle Effects */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}
            
            {/* Success Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-pink-500/10 animate-pulse"></div>
          </div>
        )}

        {/* Step 7: Complete */}
        {currentStep >= 7 && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-sm rounded-2xl">
            <div className="text-center space-y-4 animate-scale-in">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">Production Ready!</h3>
              <p className="text-purple-200">Full-stack app built in minutes, not months</p>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-2">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index <= currentStep 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-110' 
                    : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Step Description */}
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
