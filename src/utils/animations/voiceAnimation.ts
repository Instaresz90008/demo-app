
export const initEnhancedVoiceAnimation = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  animationFrameRef: React.MutableRefObject<number | undefined>
) => {
  let time = 0;
  const particles: Array<{
    x: number;
    y: number;
    radius: number;
    angle: number;
    speed: number;
    color: string;
  }> = [];

  // Create voice-reactive particles
  for (let i = 0; i < 30; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: Math.random() * 3 + 1,
      angle: (Math.PI * 2 * i) / 30,
      speed: Math.random() * 2 + 1,
      color: `hsl(${240 + Math.random() * 60}, 70%, ${50 + Math.random() * 30}%)`
    });
  }

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    time += 0.02;

    // Central pulse
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Main pulse
    const pulseRadius = 50 + Math.sin(time * 2) * 20;
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, pulseRadius);
    gradient.addColorStop(0, 'rgba(155, 135, 245, 0.3)');
    gradient.addColorStop(1, 'rgba(155, 135, 245, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
    ctx.fill();

    // Animated particles
    particles.forEach((particle, index) => {
      const distance = 100 + Math.sin(time + index * 0.1) * 50;
      particle.x = centerX + Math.cos(particle.angle + time * particle.speed) * distance;
      particle.y = centerY + Math.sin(particle.angle + time * particle.speed) * distance;
      
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Connect to center
      ctx.strokeStyle = `rgba(155, 135, 245, 0.1)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(particle.x, particle.y);
      ctx.stroke();
    });

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  animate();

  return () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };
};
