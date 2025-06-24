
import React from 'react';
import AnimationControls from './animation/AnimationControls';
import CodeTerminal from './animation/CodeTerminal';
import LivePreview from './animation/LivePreview';
import ProgressSteps from './animation/ProgressSteps';
import ParticleCanvas from './animation/ParticleCanvas';
import ConnectionLines from './animation/ConnectionLines';
import FloatingIndicators from './animation/FloatingIndicators';
import StepInfo from './animation/StepInfo';
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
    <div className="relative w-full max-w-6xl mx-auto p-8 overflow-hidden">
      {/* Background Particle Canvas */}
      <ParticleCanvas isPlaying={isPlaying} />
      
      {/* Connection Lines Between Elements */}
      <ConnectionLines currentStep={currentStep} builtElements={builtElements} />

      {/* Control Panel */}
      <AnimationControls 
        isPlaying={isPlaying}
        onPause={pauseAnimation}
        onResume={resumeAnimation}
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
        <FloatingIndicators isPlaying={isPlaying} />
      </div>

      {/* Current Step Info */}
      <StepInfo currentStep={currentStep} />
    </div>
  );
};

export default BuildingAnimation;
