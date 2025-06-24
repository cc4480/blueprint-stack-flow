
import React from 'react';
import AnimationControls from './animation/AnimationControls';
import CodeTerminal from './animation/CodeTerminal';
import LivePreview from './animation/LivePreview';
import ProgressSteps from './animation/ProgressSteps';
import ParticleCanvas from './animation/ParticleCanvas';
import ConnectionLines from './animation/ConnectionLines';
import FloatingIndicators from './animation/FloatingIndicators';
import StepInfo from './animation/StepInfo';
import Logo from './Logo';
import { animationSteps } from './animation/animationData';
import { useBuildingAnimation } from '../hooks/useBuildingAnimation';

const BuildingAnimation = () => {
  const {
    currentStep,
    isPlaying,
    typingText,
    showingCode,
    builtElements,
    startAnimation,
    pauseAnimation,
    resumeAnimation
  } = useBuildingAnimation();

  return (
    <div className="relative w-full max-w-6xl mx-auto p-8 overflow-hidden bg-black">
      {/* Background Particle Canvas */}
      <ParticleCanvas isPlaying={isPlaying} />
      
      {/* Connection Lines Between Elements */}
      <ConnectionLines currentStep={currentStep} builtElements={builtElements} />

      {/* Logo Header */}
      <div className="text-center mb-8">
        <Logo size="lg" className="mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 bg-clip-text">
          Live Application Builder
        </h2>
        <p className="text-gray-300 mt-2">Powered by DeepSeek Reasoner + RAG 2.0 + MCP + A2A</p>
      </div>

      {/* Control Panel */}
      <AnimationControls 
        isPlaying={isPlaying}
        onPause={pauseAnimation}
        onResume={resumeAnimation}
        onRestart={startAnimation}
      />

      {/* Main Build Container */}
      <div className="relative bg-gradient-to-br from-black/95 via-gray-900/95 to-black/95 rounded-2xl p-8 min-h-[700px] backdrop-blur-sm border-2 border-blue-400/30"
           style={{
             boxShadow: '0 0 50px rgba(59, 130, 246, 0.3), 0 0 100px rgba(147, 51, 234, 0.2), inset 0 1px 3px rgba(255, 255, 255, 0.1)'
           }}>
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
        <FloatingIndicators isPlaying={isPlaying} />
      </div>

      {/* Current Step Info */}
      <StepInfo currentStep={currentStep} />
    </div>
  );
};

export default BuildingAnimation;
