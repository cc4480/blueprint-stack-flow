
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
        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/25"
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
        className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
        size="lg"
      >
        <RotateCcw className="w-5 h-5 mr-2" />
        Restart
      </Button>
    </div>
  );
};

export default AnimationControls;
