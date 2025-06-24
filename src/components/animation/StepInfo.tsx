
import React from 'react';
import { animationSteps } from './animationData';

interface StepInfoProps {
  currentStep: number;
}

const StepInfo = ({ currentStep }: StepInfoProps) => {
  const step = animationSteps[currentStep];
  
  if (!step) return null;

  return (
    <div className="text-center mt-6 p-6 bg-black border border-purple-400/30 rounded-2xl shadow-logo">
      <h3 className="text-2xl font-bold gradient-logo-text mb-2">
        {step.name}
      </h3>
      <p className="text-purple-300 text-lg">
        {step.description}
      </p>
    </div>
  );
};

export default StepInfo;
