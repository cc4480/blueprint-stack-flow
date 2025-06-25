
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface AnimationControlsProps {
  isPlaying: boolean;
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
}

const AnimationControls = ({ isPlaying, onPause, onResume, onRestart }: AnimationControlsProps) => {
  return (
    <div className="flex justify-center gap-4 mb-8">
      <Button 
        onClick={isPlaying ? onPause : onResume}
        className="bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 hover:from-blue-600 hover:via-purple-600 hover:to-red-600 text-white transition-all duration-300 transform hover:scale-105 shadow-logo border border-blue-400/30"
        size="lg"
      >
        {isPlaying ? (
          <>
            <Pause className="w-5 h-5 mr-2" />
            Pause Build
          </>
        ) : (
          <>
            <Play className="w-5 h-5 mr-2" />
            Resume Build
          </>
        )}
      </Button>
      <Button 
        onClick={onRestart} 
        variant="outline"
        className="border-2 border-blue-400 text-blue-400 hover:bg-blue-400/10 hover:text-blue-300 transition-all duration-300 transform hover:scale-105 shadow-logo bg-black"
        size="lg"
      >
        <RotateCcw className="w-5 h-5 mr-2" />
        Restart
      </Button>
    </div>
  );
};

export default AnimationControls;
