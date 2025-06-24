
import React from 'react';
import { animationSteps } from './animationData';

interface StepInfoProps {
  currentStep: number;
}

const StepInfo = ({ currentStep }: StepInfoProps) => {
  const step = animationSteps[currentStep];
  
  if (!step) return null;

  return (
    <div className="text-center mt-6">
      <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
        {step.name}
      </h3>
      <p className="text-purple-200 text-lg">
        {step.description}
      </p>
    </div>
  );
};

export default StepInfo;
