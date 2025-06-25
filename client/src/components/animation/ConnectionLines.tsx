
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
      <svg className="w-full h-full opacity-60">
        <defs>
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="50%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
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
                strokeWidth="3"
                fill="none"
                className="animate-pulse"
                strokeDasharray="8,4"
                filter="url(#glow)"
              />
              <circle
                cx="300"
                cy={endY}
                r="6"
                fill="#A855F7"
                className="animate-pulse"
                filter="url(#glow)"
              />
            </g>
          );
        })}
        
        {/* Data flow animation */}
        {currentStep > 2 && (
          <circle
            cx="50%"
            cy="50%"
            r="4"
            fill="#60A5FA"
            className="animate-ping"
            filter="url(#glow)"
          />
        )}
      </svg>
    </div>
  );
};

export default ConnectionLines;
