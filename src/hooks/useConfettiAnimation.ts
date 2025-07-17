
import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

/**
 * Custom hook to control confetti animation timing
 * @param trigger - Boolean that triggers the confetti when true
 * @param delay - Delay in ms before showing confetti (default: 500ms)
 * @param duration - How long the confetti should show in ms (default: 5000ms)
 * @returns Boolean indicating if confetti should be shown
 */
const useConfettiAnimation = (
  trigger: boolean,
  delay = 500,
  duration = 5000
): boolean => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!trigger) return;

    const startTimer = setTimeout(() => {
      setShowConfetti(true);
      
      // Launch confetti from the middle
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Then from the left
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
      }, 250);

      // Then from the right
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 400);

      const stopTimer = setTimeout(() => {
        setShowConfetti(false);
      }, duration);

      return () => clearTimeout(stopTimer);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [trigger, delay, duration]);

  return showConfetti;
};

export default useConfettiAnimation;
