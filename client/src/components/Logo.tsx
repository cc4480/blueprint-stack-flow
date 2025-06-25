import React from 'react';
interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}
const Logo = ({
  size = 'md',
  className = ''
}: LogoProps) => {
  const sizes = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-24'
  };
  return <div className={`flex items-center ${className}`}>
      
    </div>;
};
export default Logo;