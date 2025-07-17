
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

export const initParticlesAnimationV1 = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  animationFrameRef: React.MutableRefObject<number | undefined>
) => {
  const particles: Particle[] = [];
  
  // Ultra-subtle colors with very low opacity
  const colors = [
    'rgba(155, 135, 245, 0.015)', // Much more subtle
    'rgba(126, 105, 171, 0.01)', 
    'rgba(110, 89, 165, 0.008)', 
    'rgba(214, 188, 250, 0.012)', 
  ];

  // Drastically reduced particle count for better performance
  const createParticles = () => {
    const particleCount = Math.min(8, Math.floor((canvas.width * canvas.height) / 80000)); // Much fewer particles
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1, // Smaller sizes
        speedX: (Math.random() - 0.5) * 0.15, // Much slower movement
        speedY: (Math.random() - 0.5) * 0.15, 
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: 'circle', // Only circles for better performance
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.003 // Very slow rotation
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
    const maxDistance = 60; // Much shorter connection distance
    
    // Only connect a few particles to reduce calculations
    for (let i = 0; i < Math.min(particles.length, 4); i++) {
      for (let j = i + 1; j < Math.min(particles.length, i + 3); j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.008; // Ultra-low opacity
          ctx.beginPath();
          ctx.strokeStyle = `rgba(155, 135, 245, ${opacity})`;
          ctx.lineWidth = 0.3;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }
  };

  // Much slower animation (15fps instead of 60fps)
  let lastTime = 0;
  const fps = 15;
  const interval = 1000 / fps;

  const animate = (currentTime: number) => {
    if (currentTime - lastTime >= interval) {
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
      
      // Connect particles (very limited)
      connectParticles();
      
      lastTime = currentTime;
    }
    
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
