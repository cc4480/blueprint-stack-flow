import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';
interface AnimationControlsProps {
  isPlaying: boolean;
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
}
const AnimationControls = ({
  isPlaying,
  onPause,
  onResume,
  onRestart
}: AnimationControlsProps) => {
  return <div className="flex justify-center gap-4 mb-8">
      
      
    </div>;
};
export default AnimationControls;