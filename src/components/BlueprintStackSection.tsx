import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code, Database, Layers, Zap, Settings } from 'lucide-react';
import BuildingAnimation from './BuildingAnimation';
import { analytics } from '../services/analyticsService';
const BlueprintStackSection = () => {
  const handleLearnMore = () => {
    analytics.trackButtonClick('learn-more-stack', 'blueprint-stack');
    console.log('🧠 User clicked learn more about Blueprint Stack');
  };
  const handleTryDemo = () => {
    analytics.trackButtonClick('try-demo', 'blueprint-stack');
    const element = document.getElementById('interactive-demo');
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
      console.log('📍 Scrolled to interactive demo from blueprint section');
    }
  };
  const stackLayers = [{
    icon: <Code className="w-8 h-8 text-purple-400" />,
    title: "Core Build Prompts",
    description: "Pre-tested, battle-hardened prompts for every development scenario",
    features: ["Component generation", "State management", "API integration", "Authentication flows"]
  }, {
    icon: <Layers className="w-8 h-8 text-blue-400" />,
    title: "Master Blueprint Template",
    description: "The new-generation replacement for outdated PRDs",
    features: ["AI-native structure", "Component hierarchy", "Data flow patterns", "Performance optimization"]
  }, {
    icon: <Settings className="w-8 h-8 text-green-400" />,
    title: "Refactor Engine",
    description: "Code optimization without breaking functionality",
    features: ["Component splitting", "Performance tuning", "Bundle optimization", "Memory management"]
  }, {
    icon: <Zap className="w-8 h-8 text-yellow-400" />,
    title: "Error Recovery Layer",
    description: "Zero-bug deployment workflows",
    features: ["Error pattern recognition", "Automated debugging", "Production monitoring", "Rollback procedures"]
  }, {
    icon: <Database className="w-8 h-8 text-pink-400" />,
    title: "Platform Optimization",
    description: "Tool-specific best practices for maximum efficiency",
    features: ["Lovable optimization", "Cursor integration", "Cross-platform compatibility", "Performance monitoring"]
  }];
  return <section className="py-20 bg-gradient-to-b from-slate-900 to-purple-900 text-white">
      <div className="container mx-auto px-6 bg-gray-900">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            The <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">NoCodeLos Blueprint Stack</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            This is the same system I've used to build fully functional, scalable, and optimized apps—without writing code or hiring a team.
          </p>
        </div>

        {/* Building Animation */}
        <div className="mb-20">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Watch AI Build Your App in Real-Time
            </h3>
            <p className="text-lg text-purple-200 max-w-2xl mx-auto">
              See how the Blueprint Stack transforms ideas into production-ready applications
            </p>
          </div>
          <BuildingAnimation />
        </div>

        {/* Stack Layers */}
        <div className="space-y-8 mb-16">
          {stackLayers.map((layer, index) => <Card key={index} className="bg-white/5 backdrop-blur-lg border-purple-400/20 p-8 hover:bg-white/10 transition-all duration-300 hover:border-purple-400/40 hover:scale-105">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-purple-400/30">
                    {layer.icon}
                  </div>
                </div>
                
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold text-white mb-3">{layer.title}</h3>
                  <p className="text-lg text-gray-300 mb-4">{layer.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {layer.features.map((feature, featureIndex) => <div key={featureIndex} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                        <span className="text-gray-300">{feature}</span>
                      </div>)}
                  </div>
                </div>
              </div>
            </Card>)}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-lg rounded-2xl p-8 border border-purple-400/20">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Build Smarter?
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Don't just watch others ship fast. Start doing it. Right now.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleTryDemo} size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                Try the Stack Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button onClick={handleLearnMore} variant="outline" size="lg" className="border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default BlueprintStackSection;