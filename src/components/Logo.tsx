
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
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        {/* Blue metallic C */}
        <div className="relative">
          <span className={`font-black text-transparent bg-gradient-to-br from-blue-300 via-blue-500 to-blue-700 bg-clip-text ${size === 'xl' ? 'text-6xl' : size === 'lg' ? 'text-4xl' : size === 'md' ? 'text-3xl' : 'text-2xl'} filter drop-shadow-lg`}
                style={{
                  textShadow: '0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.3)',
                  fontFamily: 'Arial Black, sans-serif'
                }}>
            C
          </span>
          
          {/* Red cursor arrow overlay */}
          <div className="absolute -top-1 -right-2">
            <div className={`${size === 'xl' ? 'w-8 h-8' : size === 'lg' ? 'w-6 h-6' : size === 'md' ? 'w-5 h-5' : 'w-4 h-4'} transform rotate-12`}>
              <div className="w-full h-full bg-gradient-to-br from-red-400 via-red-500 to-red-700 clip-path-arrow filter drop-shadow-lg"
                   style={{
                     clipPath: 'polygon(0% 40%, 60% 40%, 60% 20%, 100% 50%, 60% 80%, 60% 60%, 0% 60%)',
                     boxShadow: '0 0 15px rgba(239, 68, 68, 0.6), inset 0 1px 3px rgba(255, 255, 255, 0.3)'
                   }}>
              </div>
            </div>
          </div>
        </div>
        
        {/* Purple AI chip */}
        <div className={`absolute -top-2 -right-4 ${size === 'xl' ? 'w-10 h-10' : size === 'lg' ? 'w-8 h-8' : size === 'md' ? 'w-6 h-6' : 'w-5 h-5'} bg-gradient-to-br from-purple-400 via-purple-600 to-purple-800 rounded-lg border border-purple-300/30 flex items-center justify-center`}
             style={{
               boxShadow: '0 0 20px rgba(147, 51, 234, 0.5), inset 0 1px 3px rgba(255, 255, 255, 0.2)'
             }}>
          <span className={`font-bold text-white ${size === 'xl' ? 'text-xs' : size === 'lg' ? 'text-xs' : 'text-xs'}`}
                style={{ fontSize: size === 'sm' ? '8px' : '10px' }}>
            AI
          </span>
          
          {/* Circuit pattern overlay */}
          <div className="absolute inset-0 opacity-30">
            <div className="w-full h-full bg-gradient-to-br from-transparent via-purple-300/20 to-transparent rounded-lg"></div>
          </div>
        </div>
      </div>
      
      {/* NoCodeLos text */}
      <span className={`font-black text-transparent bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500 bg-clip-text tracking-tight ${size === 'xl' ? 'text-4xl' : size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-xl' : 'text-lg'}`}
            style={{
              textShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
              fontFamily: 'Arial Black, sans-serif',
              filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
            }}>
        NoCodeLos
      </span>
    </div>
  );
};

export default Logo;
