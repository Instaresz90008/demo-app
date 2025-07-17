
import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface AudioVisualizerProps {
  visualizeAudio: boolean;
  isListening: boolean;
  hasTranscript: boolean;
}

const AudioVisualizer = ({ visualizeAudio, isListening, hasTranscript }: AudioVisualizerProps) => {
  const waveContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!waveContainerRef.current) return;
    
    const container = waveContainerRef.current;
    
    // Clear previous waves
    container.innerHTML = '';
    
    if (!visualizeAudio) return;
    
    // Create sound wave bars
    const barCount = 16;
    const bars: HTMLDivElement[] = [];
    
    for (let i = 0; i < barCount; i++) {
      const bar = document.createElement('div');
      bar.className = cn(
        'bg-primary/60 rounded-full w-1',
        isListening ? 'transition-all duration-200 ease-in-out' : ''
      );
      
      // Set initial heights in wave pattern
      const height = isListening ? 
        4 + Math.sin(i * 0.4) * 10 : 
        2 + Math.sin(i * 0.5) * 6;
      
      bar.style.height = `${height}px`;
      container.appendChild(bar);
      bars.push(bar);
    }
    
    // Wave animation
    let frame = 0;
    const animate = () => {
      frame += 0.1;
      
      bars.forEach((bar, i) => {
        const height = isListening ?
          4 + Math.sin(frame + i * 0.4) * 10 :
          2 + Math.sin(frame + i * 0.5) * 6;
          
        bar.style.height = `${height}px`;
      });
      
      requestAnimationFrame(animate);
    };
    
    const animationId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [visualizeAudio, isListening]);

  return (
    <div className="flex flex-col items-center">
      {isListening && (
        <div className="mb-2">
          <p className="text-xs text-primary/70">
            Listening...
          </p>
        </div>
      )}
      
      <div 
        ref={waveContainerRef}
        className="flex items-end justify-center gap-[2px] h-8 w-32"
      />
    </div>
  );
};

export default AudioVisualizer;
