
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import AnimationControls from './animation/AnimationControls';
import CodeTerminal from './animation/CodeTerminal';
import LivePreview from './animation/LivePreview';
import ProgressSteps from './animation/ProgressSteps';
import ParticleCanvas from './animation/ParticleCanvas';
import ConnectionLines from './animation/ConnectionLines';
import { animationSteps } from './animation/animationData';

const BuildingAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [typingText, setTypingText] = useState('');
  const [showingCode, setShowingCode] = useState(false);
  const [builtElements, setBuiltElements] = useState<string[]>([]);

  // Typing animation effect
  useEffect(() => {
    if (showingCode && currentStep < animationSteps.length) {
      const code = animationSteps[currentStep].code;
      let index = 0;
      setTypingText('');
      
      const typeTimer = setInterval(() => {
        if (index < code.length) {
          setTypingText(code.slice(0, index + 1));
          index++;
        } else {
          clearInterval(typeTimer);
        }
      }, 20);

      return () => clearInterval(typeTimer);
    }
  }, [showingCode, currentStep]);

  // Main animation progression
  useEffect(() => {
    if (isPlaying && currentStep < animationSteps.length) {
      setShowingCode(true);
      
      // Add built element after a delay
      setTimeout(() => {
        setBuiltElements(prev => [...prev, animationSteps[currentStep].elementId]);
      }, animationSteps[currentStep].duration * 0.6);
      
      const timer = setTimeout(() => {
        if (currentStep < animationSteps.length - 1) {
          setCurrentStep(prev => prev + 1);
          setShowingCode(false);
        } else {
          // Reset animation after completion
          setTimeout(() => {
            setCurrentStep(0);
            setShowingCode(false);
            setTypingText('');
            setBuiltElements([]);
          }, 2000);
        }
      }, animationSteps[currentStep]?.duration || 3000);

      return () => clearTimeout(timer);
    }
  }, [currentStep, isPlaying]);

  const startAnimation = () => {
    setCurrentStep(0);
    setIsPlaying(true);
    setShowingCode(false);
    setTypingText('');
    setBuiltElements([]);
  };

  const pauseAnimation = () => {
    setIsPlaying(false);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto p-8 overflow-hidden">
      {/* Background Particle Canvas */}
      <ParticleCanvas isPlaying={isPlaying} />
      
      {/* Connection Lines Between Elements */}
      <ConnectionLines currentStep={currentStep} builtElements={builtElements} />

      {/* Control Panel */}
      <AnimationControls 
        isPlaying={isPlaying}
        onPause={pauseAnimation}
        onResume={() => setIsPlaying(true)}
        onRestart={startAnimation}
      />

      {/* Main Build Container */}
      <div className="relative bg-gradient-to-br from-slate-900/95 via-purple-900/95 to-slate-900/95 rounded-2xl p-8 min-h-[700px] backdrop-blur-sm border border-purple-500/20">
        {/* Code Terminal */}
        <CodeTerminal 
          typingText={typingText}
          showingCode={showingCode}
          currentStep={currentStep}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Progress Steps */}
          <ProgressSteps 
            currentStep={currentStep}
            steps={animationSteps}
          />

          {/* Live Preview */}
          <LivePreview 
            currentStep={currentStep}
            builtElements={builtElements}
          />
        </div>

        {/* Floating Build Indicators */}
        {isPlaying && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-ping opacity-60"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${1 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Current Step Info */}
      <div className="text-center mt-6">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
          {animationSteps[currentStep]?.name}
        </h3>
        <p className="text-purple-200 text-lg">
          {animationSteps[currentStep]?.description}
        </p>
      </div>
    </div>
  );
};

export default BuildingAnimation;
