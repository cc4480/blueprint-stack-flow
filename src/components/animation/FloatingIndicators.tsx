
import React from 'react';

interface FloatingIndicatorsProps {
  isPlaying: boolean;
}

const FloatingIndicators = ({ isPlaying }: FloatingIndicatorsProps) => {
  if (!isPlaying) return null;

  return (
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
  );
};

export default FloatingIndicators;
