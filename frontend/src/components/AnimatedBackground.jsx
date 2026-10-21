import React, { useEffect, useRef } from 'react';

// Ambient app backdrop: drifting aurora glows, a slowly panning grid and a
// faint "dependency constellation" of nodes that link up when they drift close.
// Purely decorative, so it is hidden from assistive tech and ignores pointer events.
export default function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const LINK_DISTANCE = 150;
    const COLORS = ['45, 212, 191', '129, 140, 248', '56, 189, 248'];
    let width = 0;
    let height = 0;
    let nodes = [];
    let frameId = null;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Density scales with viewport area, capped to keep it cheap
      const count = Math.min(60, Math.round((width * height) / 26000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i += 1) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j += 1) {
          const b = nodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < LINK_DISTANCE) {
            ctx.strokeStyle = `rgba(${a.color}, ${(1 - dist / LINK_DISTANCE) * 0.18})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        ctx.fillStyle = `rgba(${n.color}, 0.55)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = () => {
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = width + 20;
        if (n.x > width + 20) n.x = -20;
        if (n.y < -20) n.y = height + 20;
        if (n.y > height + 20) n.y = -20;
      }
      draw();
      frameId = requestAnimationFrame(step);
    };

    const start = () => {
      if (reduceMotion || frameId !== null) return;
      frameId = requestAnimationFrame(step);
    };
    const stop = () => {
      if (frameId !== null) cancelAnimationFrame(frameId);
      frameId = null;
    };
    // Don't burn CPU in background tabs
    const onVisibility = () => (document.hidden ? stop() : start());

    resize();
    draw();
    start();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <div className="app-bg" aria-hidden="true">
      <div className="app-bg-aurora app-bg-aurora--teal" />
      <div className="app-bg-aurora app-bg-aurora--indigo" />
      <div className="app-bg-aurora app-bg-aurora--violet" />
      <div className="app-bg-grid" />
      <canvas ref={canvasRef} className="app-bg-canvas" />
      <div className="app-bg-vignette" />
    </div>
  );
}
