
import { useState, useEffect } from 'react';
import { animationSteps } from '../components/animation/animationData';

export const useBuildingAnimation = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [typingText, setTypingText] = useState('');
  const [showingCode, setShowingCode] = useState(false);
  const [builtElements, setBuiltElements] = useState<string[]>([]);

  // Typing animation effect
  useEffect(() => {
    if (showingCode && currentStep < animationSteps.length) {
      const code = animationSteps[currentStep].code;
      let index = 0;
      setTypingText('');
      
      const typeTimer = setInterval(() => {
        if (index < code.length) {
          setTypingText(code.slice(0, index + 1));
          index++;
        } else {
          clearInterval(typeTimer);
        }
      }, 20);

      return () => clearInterval(typeTimer);
    }
  }, [showingCode, currentStep]);

  // Main animation progression
  useEffect(() => {
    if (isPlaying && currentStep < animationSteps.length) {
      setShowingCode(true);
      
      // Add built element after a delay
      setTimeout(() => {
        setBuiltElements(prev => [...prev, animationSteps[currentStep].elementId]);
      }, animationSteps[currentStep].duration * 0.6);
      
      const timer = setTimeout(() => {
        if (currentStep < animationSteps.length - 1) {
          setCurrentStep(prev => prev + 1);
          setShowingCode(false);
        } else {
          // Reset animation after completion
          setTimeout(() => {
            setCurrentStep(0);
            setShowingCode(false);
            setTypingText('');
            setBuiltElements([]);
          }, 2000);
        }
      }, animationSteps[currentStep]?.duration || 3000);

      return () => clearTimeout(timer);
    }
  }, [currentStep, isPlaying]);

  const startAnimation = () => {
    setCurrentStep(0);
    setIsPlaying(true);
    setShowingCode(false);
    setTypingText('');
    setBuiltElements([]);
  };

  const pauseAnimation = () => {
    setIsPlaying(false);
  };

  const resumeAnimation = () => {
    setIsPlaying(true);
  };

  return {
    currentStep,
    isPlaying,
    typingText,
    showingCode,
    builtElements,
    startAnimation,
    pauseAnimation,
    resumeAnimation
  };
};
