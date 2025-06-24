
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Logo = ({ size = 'md', className = '' }: LogoProps) => {
  const sizes = {
    sm: 'h-8',
    md: 'h-12', 
    lg: 'h-16',
    xl: 'h-24'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/placeholder.svg" 
        alt="NoCodeLos Logo" 
        className={`${sizes[size]} w-auto object-contain filter drop-shadow-lg`}
        style={{
          filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.5)) drop-shadow(0 0 40px rgba(147, 51, 234, 0.3))'
        }}
      />
    </div>
  );
};

export default Logo;
