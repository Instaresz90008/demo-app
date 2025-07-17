
import React from 'react';
import { Badge } from 'lucide-react';

interface PriceIconProps {
  className?: string;
  size?: number;
}

const PriceIcon: React.FC<PriceIconProps> = ({ className = "w-4 h-4", size }) => {
  return (
    <Badge 
      className={className} 
      size={size}
    />
  );
};

export default PriceIcon;
