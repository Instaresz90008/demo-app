
import { useRef, useState, MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { Button, ButtonProps } from '@/components/ui/button';

interface MagneticButtonProps extends ButtonProps {
  strength?: number;
  children: React.ReactNode;
}

const MagneticButton = ({ strength = 15, children, ...props }: MagneticButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from pointer to center of button
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    // Calculate the magnetic pull (stronger when closer to center)
    const pull = strength;
    
    setPosition({
      x: distanceX * pull / (rect.width / 2),
      y: distanceY * pull / (rect.height / 2)
    });
  };
  
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };
  
  return (
    <motion.div
      animate={{ x: isHovered ? position.x : 0, y: isHovered ? position.y : 0 }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      className="magnetic-button"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Button
        ref={buttonRef}
        {...props}
        className={`${props.className} relative overflow-hidden`}
      >
        {children}
        {isHovered && (
          <motion.div
            className="absolute inset-0 bg-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </Button>
    </motion.div>
  );
};

export default MagneticButton;
