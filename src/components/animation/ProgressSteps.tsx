
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
          className={`group relative flex items-center gap-4 p-4 rounded-xl transition-all duration-500 border ${
            index < currentStep 
              ? 'bg-black border-green-400/40 shadow-lg shadow-green-400/20' 
              : index === currentStep
              ? 'bg-black border-blue-400/40 animate-pulse shadow-lg shadow-blue-400/20'
              : 'bg-black border-gray-600/30'
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
              ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 shadow-logo'
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
              <div className="mt-3 w-full bg-gray-800 rounded-full h-1 overflow-hidden border border-blue-400/20">
                <div className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 rounded-full animate-pulse" 
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
