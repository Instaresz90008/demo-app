
import React from 'react';

interface ConfettiOverlayProps {
  active: boolean;
  particleCount?: number;
  colors?: string[];
  zIndex?: number;
}

// Static confetti - NO ANIMATIONS for simple themes
const ConfettiOverlay: React.FC<ConfettiOverlayProps> = ({
  active,
  particleCount = 50,
  colors = ['#60a5fa', '#34d399', '#8b5cf6', '#f97316', '#f43f5e'],
  zIndex = 50
}) => {
  return null; // No confetti animations in simple themes
};

export default ConfettiOverlay;
