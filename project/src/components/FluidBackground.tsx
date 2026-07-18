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

    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
    };

    // Store blobs as ratios of viewport so resize doesn't cause jarring jumps
    interface BlobDef {
      xRatio: number;
      yRatio: number;
      radiusRatio: number;
      color: string;
      angle: number;
      speed: number;
    }

    const blobDefs: BlobDef[] = [
      { xRatio: 0.25, yRatio: 0.3, radiusRatio: 0.45, color: 'rgba(16, 185, 129, 0.06)', angle: 0, speed: 0.002 },
      { xRatio: 0.75, yRatio: 0.7, radiusRatio: 0.4, color: 'rgba(6, 182, 212, 0.06)', angle: Math.PI, speed: 0.0015 },
    ];

    interface Blob {
      x: number;
      y: number;
      radius: number;
      color: string;
      baseX: number;
      baseY: number;
      angle: number;
      speed: number;
      xRatio: number;
      yRatio: number;
      radiusRatio: number;
    }

    const createBlobs = (): Blob[] =>
      blobDefs.map(def => ({
        x: width * def.xRatio,
        y: height * def.yRatio,
        radius: Math.min(width, height) * def.radiusRatio,
        color: def.color,
        baseX: width * def.xRatio,
        baseY: height * def.yRatio,
        angle: def.angle,
        speed: def.speed,
        xRatio: def.xRatio,
        yRatio: def.yRatio,
        radiusRatio: def.radiusRatio,
      }));

    const blobs = createBlobs();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      // Recalculate base positions from ratios to avoid jarring jump
      blobs.forEach(blob => {
        blob.baseX = width * blob.xRatio;
        blob.baseY = height * blob.yRatio;
        blob.radius = Math.min(width, height) * blob.radiusRatio;
        // Snap current position too so there's no lerp gap
        blob.x = blob.baseX;
        blob.y = blob.baseY;
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      blobs.forEach(blob => {
        blob.angle += blob.speed;
        const driftX = Math.cos(blob.angle) * 60;
        const driftY = Math.sin(blob.angle) * 60;

        const dx = mouse.x - blob.x;
        const dy = mouse.y - blob.y;
        const dist = Math.hypot(dx, dy);

        const maxDist = 400;
        let forceX = 0;
        let forceY = 0;
        if (dist > 0 && dist < maxDist) {
          const force = (maxDist - dist) / maxDist;
          forceX = (dx / dist) * force * 20;
          forceY = (dy / dist) * force * 20;
        }

        const targetX = blob.baseX + driftX + forceX;
        const targetY = blob.baseY + driftY + forceY;

        blob.x += (targetX - blob.x) * 0.02;
        blob.y += (targetY - blob.y) * 0.02;

        const gradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.radius);
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
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        willChange: 'transform',
      }}
    />
  );
};
