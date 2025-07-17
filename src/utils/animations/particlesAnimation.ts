
interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  shape: 'circle' | 'triangle' | 'square';
  rotation: number;
  rotationSpeed: number;
}

export const initParticlesAnimation = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  animationFrameRef: React.MutableRefObject<number | undefined>
) => {
  const particles: Particle[] = [];
  const colors = [
    'rgba(155, 135, 245, 0.012)', 
    'rgba(126, 105, 171, 0.01)', 
    'rgba(110, 89, 165, 0.008)',  
    'rgba(214, 188, 250, 0.01)', 
  ];

  // Reduced particle count for better performance
  const createParticles = () => {
    const particleCount = Math.min(12, Math.floor((canvas.width * canvas.height) / 60000));
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1, 
        speedX: (Math.random() - 0.5) * 0.3, 
        speedY: (Math.random() - 0.5) * 0.3, 
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: 'circle', // Only circles for performance
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.005 
      });
    }
  };

  const drawShape = (particle: Particle) => {
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  };

  const connectParticles = () => {
    const maxDistance = 80; 
    
    // Limit connections for performance
    for (let i = 0; i < Math.min(particles.length, 6); i++) {
      const checkLimit = Math.min(particles.length, i + 4);
      for (let j = i + 1; j < checkLimit; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.01; 
          ctx.beginPath();
          ctx.strokeStyle = `rgba(155, 135, 245, ${opacity})`;
          ctx.lineWidth = 0.4; 
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
  };

  // Reduced frame rate for better performance
  let lastFrameTime = 0;
  const frameInterval = 66; // 15fps instead of 60fps

  const animate = (timestamp: number) => {
    if (timestamp - lastFrameTime < frameInterval) {
      animationFrameRef.current = requestAnimationFrame(animate);
      return;
    }
    
    lastFrameTime = timestamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    particles.forEach(particle => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      particle.rotation += particle.rotationSpeed;
      
      // Bounce off walls
      if (particle.x < 0 || particle.x > canvas.width) {
        particle.speedX *= -1;
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
      }
      
      if (particle.y < 0 || particle.y > canvas.height) {
        particle.speedY *= -1;
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));
      }
      
      drawShape(particle);
    });
    
    // Connect nearby particles
    connectParticles();
    
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  createParticles();
  animate(0);

  return () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };
};
