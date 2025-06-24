
import React from 'react';

interface ConnectionLinesProps {
  currentStep: number;
  builtElements: string[];
}

const ConnectionLines = ({ currentStep, builtElements }: ConnectionLinesProps) => {
  if (!builtElements.length) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Animated connection lines between built elements */}
      <svg className="w-full h-full opacity-40">
        <defs>
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="50%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        
        {builtElements.map((_, index) => {
          if (index === 0) return null;
          
          const startY = 200 + (index - 1) * 80;
          const endY = 200 + index * 80;
          
          return (
            <g key={index}>
              <path
                d={`M 300 ${startY} Q 400 ${(startY + endY) / 2} 300 ${endY}`}
                stroke="url(#connectionGradient)"
                strokeWidth="2"
                fill="none"
                className="animate-pulse"
                strokeDasharray="5,5"
              />
              <circle
                cx="300"
                cy={endY}
                r="4"
                fill="#8B5CF6"
                className="animate-pulse"
              />
            </g>
          );
        })}
        
        {/* Data flow animation */}
        {currentStep > 2 && (
          <circle
            cx="50%"
            cy="50%"
            r="3"
            fill="#10B981"
            className="animate-ping"
          />
        )}
      </svg>
    </div>
  );
};

export default ConnectionLines;
