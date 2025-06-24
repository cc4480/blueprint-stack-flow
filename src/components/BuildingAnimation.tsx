
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
        <h2 className="text-3xl font-bold gradient-logo-text">
          Live Application Builder
        </h2>
        <p className="text-blue-300 mt-2">Powered by DeepSeek Reasoner + RAG 2.0 + MCP + A2A</p>
      </div>

      {/* Control Panel */}
      <AnimationControls 
        isPlaying={isPlaying}
        onPause={pauseAnimation}
        onResume={resumeAnimation}
        onRestart={startAnimation}
      />

      {/* Main Build Container */}
      <div className="relative bg-black rounded-2xl p-8 min-h-[700px] border-2 border-blue-400/30 shadow-logo"
           style={{
             background: 'linear-gradient(135deg, rgba(0,0,0,0.95), rgba(20,20,40,0.95), rgba(0,0,0,0.95))'
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
