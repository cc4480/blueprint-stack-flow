
import React from 'react';
import { CheckCircle, Circle, Loader2 } from 'lucide-react';

interface Step {
  name: string;
  description: string;
  elementId: string;
}

interface ProgressStepsProps {
  currentStep: number;
  steps: Step[];
}

const ProgressSteps = ({ currentStep, steps }: ProgressStepsProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
        Build Progress
      </h3>
      
      {steps.map((step, index) => (
        <div 
          key={index}
          className={`group relative flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
            index < currentStep 
              ? 'bg-green-500/20 border border-green-500/40 shadow-lg shadow-green-500/10' 
              : index === currentStep
              ? 'bg-yellow-500/20 border border-yellow-500/40 animate-pulse shadow-lg shadow-yellow-500/10'
              : 'bg-gray-700/20 border border-gray-600/30'
          }`}
        >
          {/* Connection line to next step */}
          {index < steps.length - 1 && (
            <div 
              className={`absolute left-6 top-16 w-0.5 h-8 transition-all duration-1000 ${
                index < currentStep ? 'bg-green-400' : 'bg-gray-600'
              }`}
            />
          )}
          
          {/* Step icon */}
          <div className={`relative z-10 p-3 rounded-full transition-all duration-500 ${
            index < currentStep 
              ? 'bg-green-500 shadow-lg shadow-green-500/30' 
              : index === currentStep
              ? 'bg-yellow-500 shadow-lg shadow-yellow-500/30'
              : 'bg-gray-600'
          }`}>
            {index < currentStep ? (
              <CheckCircle className="w-5 h-5 text-white" />
            ) : index === currentStep ? (
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            ) : (
              <Circle className="w-5 h-5 text-white" />
            )}
          </div>
          
          {/* Step content */}
          <div className="flex-1">
            <div className={`font-semibold transition-colors duration-300 ${
              index <= currentStep ? 'text-white' : 'text-gray-400'
            }`}>
              {step.name}
            </div>
            <div className="text-gray-400 text-sm mt-1">{step.description}</div>
            
            {/* Progress bar for current step */}
            {index === currentStep && (
              <div className="mt-3 w-full bg-gray-700 rounded-full h-1 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse" 
                     style={{ width: '70%' }}></div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressSteps;
