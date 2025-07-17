
export const initWavesAnimation = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  animationFrameRef: React.MutableRefObject<number | undefined>
) => {
  let time = 0;
  
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    time += 0.01;
    
    // Create flowing wave patterns
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, 'rgba(155, 135, 245, 0.1)');
    gradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.05)');
    gradient.addColorStop(1, 'rgba(139, 92, 246, 0.1)');
    
    ctx.fillStyle = gradient;
    
    // Draw multiple wave layers
    for (let layer = 0; layer < 3; layer++) {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      
      for (let x = 0; x <= canvas.width; x += 2) {
        const y = canvas.height / 2 + 
          Math.sin(x * 0.01 + time + layer * 2) * (20 + layer * 10) +
          Math.sin(x * 0.005 + time * 0.5 + layer) * (30 + layer * 15);
        ctx.lineTo(x, y);
      }
      
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.globalAlpha = 0.1 - layer * 0.02;
      ctx.fill();
    }
    
    ctx.globalAlpha = 1;
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  animate();

  return () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };
};
