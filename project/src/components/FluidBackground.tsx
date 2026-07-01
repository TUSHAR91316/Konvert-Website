import React, { useEffect, useRef } from 'react';

export const FluidBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    interface Blob {
      x: number;
      y: number;
      radius: number;
      color: string;
      baseX: number;
      baseY: number;
      angle: number;
      speed: number;
    }

    const blobs: Blob[] = [
      {
        x: width * 0.25,
        y: height * 0.3,
        radius: Math.min(width, height) * 0.45,
        color: 'rgba(16, 185, 129, 0.06)',
        baseX: width * 0.25,
        baseY: height * 0.3,
        angle: 0,
        speed: 0.002,
      },
      {
        x: width * 0.75,
        y: height * 0.7,
        radius: Math.min(width, height) * 0.4,
        color: 'rgba(6, 182, 212, 0.06)',
        baseX: width * 0.75,
        baseY: height * 0.7,
        angle: Math.PI,
        speed: 0.0015,
      },
    ];

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      blobs.forEach((blob) => {
        blob.angle += blob.speed;
        const driftX = Math.cos(blob.angle) * 60;
        const driftY = Math.sin(blob.angle) * 60;

        const dx = mouse.x - blob.x;
        const dy = mouse.y - blob.y;
        const dist = Math.hypot(dx, dy);
        
        const maxDist = 400;
        let forceX = 0;
        let forceY = 0;
        if (dist < maxDist) {
          const force = (maxDist - dist) / maxDist;
          forceX = (dx / dist) * force * 20;
          forceY = (dy / dist) * force * 20;
        }

        const targetX = blob.baseX + driftX + forceX;
        const targetY = blob.baseY + driftY + forceY;

        blob.x += (targetX - blob.x) * 0.02;
        blob.y += (targetY - blob.y) * 0.02;

        const gradient = ctx.createRadialGradient(
          blob.x,
          blob.y,
          0,
          blob.x,
          blob.y,
          blob.radius
        );
        gradient.addColorStop(0, blob.color);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};
