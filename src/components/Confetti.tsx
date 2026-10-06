import React, { useEffect, useRef } from 'react';

interface ConfettiProps {
  active: boolean;
  onComplete?: () => void;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

const PALETTE = [
  '#8B5E3C', // Deep Bronze
  '#D4AF37', // Antique Gold
  '#C5A059', // Champagne
  '#E1D5C5', // Cream Ivory
  '#E11D48', // Diary Red Accent
  '#B45309', // Warm Amber
];

export default function Confetti({ active, onComplete }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    // Resize canvas
    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    // Spawn elegant confetti particles
    const spawnCount = 120;
    for (let i = 0; i < spawnCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height - 20,
        size: Math.random() * 8 + 6,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        speedX: Math.random() * 4 - 2,
        speedY: Math.random() * 3 + 2.5,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 4 - 2,
        opacity: 1,
      });
    }

    let framesActive = 0;
    const maxFrames = 180; // ~3 seconds of gorgeous cascade

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      framesActive++;

      let activeCount = 0;

      particles.forEach((p) => {
        // Update physics
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(framesActive / 15) * 0.3; // subtle breeze sway
        p.rotation += p.rotationSpeed;

        // Fade out as it gets to bottom or ends
        if (p.y > canvas.height - 100) {
          p.opacity = Math.max(0, p.opacity - 0.02);
        } else if (framesActive > maxFrames - 50) {
          p.opacity = Math.max(0, p.opacity - 0.02);
        }

        if (p.opacity > 0 && p.y < canvas.height) {
          activeCount++;
          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          
          // Draw rectangle confetti bits
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          
          ctx.restore();
        }
      });

      if (framesActive < maxFrames && activeCount > 0) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        if (onComplete) onComplete();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [active, onComplete]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-55 w-full h-full"
      style={{ mixBlendMode: 'multiply', opacity: 0.85 }}
    />
  );
}
