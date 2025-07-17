
import React from 'react';

interface CanvasConfettiProps {
  active: boolean;
  particleCount?: number;
  colors?: string[];
  zIndex?: number;
  duration?: number;
}

// Static confetti - NO ANIMATIONS for simple themes
const CanvasConfetti: React.FC<CanvasConfettiProps> = ({
  active,
  particleCount = 200,
  colors = ['#60a5fa', '#34d399', '#8b5cf6', '#f97316', '#f43f5e'],
  zIndex = 50,
  duration = 4000
}) => {
  return null; // No canvas animations in simple themes
};

export default CanvasConfetti;
