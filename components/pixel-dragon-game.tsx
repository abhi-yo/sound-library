'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { playSound } from '@/lib/lazy-sounds';

const PixelReloadIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    className={className}
    fill="currentColor"
    style={{ shapeRendering: 'crispEdges' }}
  >
    <g transform="translate(0, 1)">
      <rect x="8" y="2" width="4" height="2" />
      <rect x="12" y="0" width="4" height="6" />
      <rect x="16" y="2" width="2" height="2" />
      <rect x="6" y="4" width="2" height="2" />
      <rect x="4" y="6" width="2" height="4" />
      <rect x="2" y="10" width="2" height="4" />
      <rect x="4" y="14" width="2" height="4" />
      <rect x="6" y="18" width="2" height="2" />
      <rect x="8" y="20" width="8" height="2" />
      <rect x="16" y="18" width="2" height="2" />
      <rect x="18" y="14" width="2" height="4" />
      <rect x="20" y="10" width="2" height="4" />
    </g>
  </svg>
);

const PixelPlayIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    className={className}
    fill="currentColor"
    style={{ shapeRendering: 'crispEdges' }}
  >
    <rect x="7" y="5" width="2" height="15" />
    <rect x="9" y="6" width="2" height="13" />
    <rect x="11" y="7" width="2" height="11" />
    <rect x="13" y="8" width="2" height="9" />
    <rect x="15" y="9" width="2" height="7" />
    <rect x="17" y="10" width="2" height="5" />
    <rect x="19" y="11" width="2" height="3" />
    <rect x="21" y="12" width="1" height="1" />
  </svg>
);

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  rot?: number;
  vrot?: number;
}

interface JumpOrb {
  x: number;
  y: number;
  radius: number;
  activated: boolean;
}

interface Obstacle {
  x: number;
  width: number;
  height: number;
  type: 'spike' | 'double-spike' | 'block';
}

export function PixelDragonGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [isFocused, setIsFocused] = useState(false);

  const gameStateRef = useRef<'idle' | 'playing' | 'gameover'>('idle');
  gameStateRef.current = gameState;

  const isFocusedRef = useRef(false);
  isFocusedRef.current = isFocused;

  const scoreRef = useRef(0);
  const highScoreRef = useRef(0);
  const isHoldingJumpRef = useRef(false);

  // Particles & Floating Sparks
  const particlesRef = useRef<Particle[]>([]);

  // Internal physics & Geometry Dash state
  const stateRef = useRef({
    x: 48,
    y: 0,
    vy: 0,
    rotation: 0,
    isGrounded: true,
    coyoteTimer: 0,
    jumpBuffer: 0,
    obstacles: [] as Obstacle[],
    jumpOrbs: [] as JumpOrb[],
    speed: 4.6,
    frame: 0,
    nextObstacleDist: 260,
    screenShake: 0,
    deathTimer: 0,
  });

  const performJump = useCallback((boost = 0) => {
    const s = stateRef.current;
    s.vy = -8.8 - boost;
    s.isGrounded = false;
    s.coyoteTimer = 0;
    playSound(boost > 0 ? 'jump-boing' : 'tap');

    // Geometry Dash Jump particles
    for (let i = 0; i < 6; i++) {
      const angle = Math.PI * 0.5 + (Math.random() - 0.5) * 1.2;
      const spd = 1.5 + Math.random() * 2.5;
      particlesRef.current.push({
        x: s.x + 10 + (Math.random() - 0.5) * 8,
        y: 150 + s.y,
        vx: -Math.cos(angle) * spd - 1.5,
        vy: -Math.sin(angle) * spd,
        size: 3,
        alpha: 0.85,
        color: '#ff3700',
      });
    }
  }, []);

  const triggerJump = useCallback(() => {
    setIsFocused(true);

    // 1. If IDLE or GAMEOVER: Instant Start/Respawn
    if (gameStateRef.current === 'idle' || gameStateRef.current === 'gameover') {
      gameStateRef.current = 'playing';
      setGameState('playing');
      scoreRef.current = 0;
      setScore(0);
      stateRef.current.y = 0;
      stateRef.current.vy = 0;
      stateRef.current.rotation = 0;
      stateRef.current.isGrounded = true;
      stateRef.current.coyoteTimer = 0;
      stateRef.current.jumpBuffer = 0;
      stateRef.current.deathTimer = 0;
      stateRef.current.obstacles = [];
      stateRef.current.jumpOrbs = [];
      stateRef.current.speed = 4.6;
      stateRef.current.nextObstacleDist = 260;
      particlesRef.current = [];
      performJump(0);
      return;
    }

    // 2. If PLAYING: Jump or hit mid-air Jump Ring Orb
    const s = stateRef.current;
    const cubeCx = s.x + 11;
    const cubeCy = 150 - 11 + s.y;

    // Check if near any floating yellow Jump Ring Orb
    let hitOrb = false;
    for (const orb of s.jumpOrbs) {
      if (!orb.activated && Math.hypot(cubeCx - orb.x, cubeCy - orb.y) < orb.radius + 18) {
        orb.activated = true;
        hitOrb = true;
        performJump(1.2);
        scoreRef.current += 25;
        setScore(Math.floor(scoreRef.current));
        break;
      }
    }

    if (!hitOrb) {
      if (s.isGrounded || s.coyoteTimer > 0) {
        performJump(0);
      } else {
        // Buffer jump input
        s.jumpBuffer = 8;
      }
    }
  }, [performJump]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        const isTarget =
          containerRef.current &&
          (containerRef.current.contains(document.activeElement) ||
            containerRef.current.matches(':hover') ||
            isFocusedRef.current);

        if (isTarget) {
          e.preventDefault();
          isHoldingJumpRef.current = true;
          triggerJump();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        isHoldingJumpRef.current = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [triggerJump]);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let isVisible = false;
    let observer: IntersectionObserver | null = null;
    const W = 360;
    const H = 200;
    const groundY = 150;
    const cubeSize = 22;

    const render = () => {
      if (!isVisible) {
        animId = 0;
        return;
      }
      animId = requestAnimationFrame(render);
      const s = stateRef.current;
      s.frame++;

      if (canvas.width !== W || canvas.height !== H) {
        canvas.width = W;
        canvas.height = H;
      }

      ctx.clearRect(0, 0, W, H);

      // Screen Shake
      ctx.save();
      if (s.screenShake > 0) {
        const sx = (Math.random() - 0.5) * s.screenShake;
        const sy = (Math.random() - 0.5) * s.screenShake;
        ctx.translate(sx, sy);
        s.screenShake *= 0.8;
        if (s.screenShake < 0.4) s.screenShake = 0;
      }

      // ── 1. GEOMETRY DASH OBSIDIAN BACKGROUND ──
      ctx.fillStyle = '#060608';
      ctx.fillRect(0, 0, W, H);

      // Subtle scrolling vertical background pillars (Parallax)
      const bgOffset = (s.frame * s.speed * 0.25) % 48;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;
      for (let x = -bgOffset; x < W + 48; x += 48) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, groundY);
        ctx.stroke();
      }

      // Ambient Horizon Glow above baseline
      const glow = ctx.createLinearGradient(0, groundY - 30, 0, groundY);
      glow.addColorStop(0, 'rgba(255, 55, 0, 0)');
      glow.addColorStop(1, 'rgba(255, 55, 0, 0.12)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, groundY - 30, W, 30);

      // ── 2. SCROLLING GEOMETRY DASH FLOOR GRID ──
      const floorTile = 22;
      const floorOffset = (s.frame * s.speed) % floorTile;

      ctx.fillStyle = '#0b0b0e';
      ctx.fillRect(0, groundY, W, H - groundY);

      // Floor Checkered Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = -floorOffset; x < W + floorTile; x += floorTile) {
        ctx.beginPath();
        ctx.moveTo(x, groundY);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = groundY + floorTile; y < H; y += floorTile) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Glowing Electric Vermilion Top Rail
      ctx.fillStyle = '#ff3700';
      ctx.fillRect(0, groundY - 2, W, 2);

      // ── 3. UPDATE PARTICLES ──
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25;
        p.alpha -= 0.028;
        if (p.rot !== undefined && p.vrot !== undefined) p.rot += p.vrot;

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        if (p.rot) ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }

      // ── 4. GAMEPLAY LOOP ──
      if (gameStateRef.current === 'playing') {
        scoreRef.current += 0.16;
        const curScore = Math.floor(scoreRef.current);
        setScore(curScore);

        // Smooth speed scaling
        s.speed = 4.6 + Math.min(scoreRef.current, 600) * 0.0025;

        // Auto-Hop when holding space or mouse
        if (isHoldingJumpRef.current && s.isGrounded) {
          performJump(0);
        }

        // Jump buffer processing
        if (s.jumpBuffer > 0) {
          s.jumpBuffer--;
          if (s.isGrounded) {
            s.jumpBuffer = 0;
            performJump(0);
          }
        }

        // Coyote timer
        if (s.isGrounded) {
          s.coyoteTimer = 6;
        } else if (s.coyoteTimer > 0) {
          s.coyoteTimer--;
        }

        // Gravity & Vertical motion
        s.y += s.vy;
        s.vy += 0.48;

        // In air: Continuous Geometry Dash Cube Rotation
        if (!s.isGrounded) {
          s.rotation += 8.5; // Smooth iconic GD air spin
        }

        // Ground collision
        if (s.y >= 0) {
          s.y = 0;
          s.vy = 0;
          s.isGrounded = true;
          // Snap rotation cleanly to flat 90-degree angle on landing
          s.rotation = Math.round(s.rotation / 90) * 90;
        }

        // Spawn Obstacles & Jump Orbs
        s.nextObstacleDist -= s.speed;
        if (s.nextObstacleDist <= 0) {
          const rand = Math.random();
          let type: Obstacle['type'] = 'spike';

          if (scoreRef.current > 160 && rand > 0.6) {
            type = 'double-spike';
          } else if (scoreRef.current > 80 && rand > 0.35) {
            type = 'block';
          }

          const obsWidth = type === 'spike' ? 16 : type === 'double-spike' ? 30 : 28;
          const obsHeight = type === 'spike' ? 17 : type === 'double-spike' ? 17 : 16;

          s.obstacles.push({
            x: W + 10,
            width: obsWidth,
            height: obsHeight,
            type,
          });

          // Floating Yellow Jump Ring Orb
          if (Math.random() > 0.45) {
            s.jumpOrbs.push({
              x: W + 10 + (type === 'block' ? 14 : 45),
              y: groundY - (type === 'block' ? 44 : 50),
              radius: 9,
              activated: false,
            });
          }

          const baseGap = 250 - Math.min(scoreRef.current, 500) * 0.08;
          s.nextObstacleDist = Math.floor(baseGap + Math.random() * 80);
        }

        // Move Jump Orbs
        for (let i = s.jumpOrbs.length - 1; i >= 0; i--) {
          const orb = s.jumpOrbs[i];
          orb.x -= s.speed;
          if (orb.x < -30) s.jumpOrbs.splice(i, 1);
        }

        // Move Obstacles & Check Collisions
        const cubeLeft = s.x + 3;
        const cubeRight = s.x + cubeSize - 3;
        const cubeBottom = groundY + s.y;
        const cubeTop = groundY - cubeSize + s.y + 3;

        for (let i = s.obstacles.length - 1; i >= 0; i--) {
          const obs = s.obstacles[i];
          obs.x -= s.speed;

          let crashed = false;

          if (obs.type === 'block') {
            const blockLeft = obs.x + 2;
            const blockRight = obs.x + obs.width - 2;
            const blockTop = groundY - obs.height;

            // Landing on top of block
            if (
              cubeRight > blockLeft &&
              cubeLeft < blockRight &&
              s.vy >= 0 &&
              s.y <= -obs.height + 4 &&
              s.y >= -obs.height - 8
            ) {
              s.y = -obs.height;
              s.vy = 0;
              s.isGrounded = true;
              s.rotation = Math.round(s.rotation / 90) * 90;
            } else if (
              cubeRight > blockLeft &&
              cubeLeft < blockRight &&
              cubeBottom > blockTop + 3 &&
              cubeTop < groundY
            ) {
              crashed = true;
            }
          } else if (obs.type === 'spike') {
            // True Triangular Slope Collision
            const spikeBaseLeft = obs.x + 3;
            const spikeBaseRight = obs.x + obs.width - 3;
            const spikeCenterX = obs.x + obs.width / 2;

            if (cubeRight > spikeBaseLeft && cubeLeft < spikeBaseRight) {
              const checkX = Math.max(cubeLeft, Math.min(cubeRight, spikeCenterX));
              const dist = Math.abs(checkX - spikeCenterX);
              const slope = Math.max(0, 1 - (dist / (obs.width / 2)) * 1.15);
              const spikeSurfaceY = groundY - (obs.height - 2) * slope;

              if (cubeBottom >= spikeSurfaceY) crashed = true;
            }
          } else if (obs.type === 'double-spike') {
            const halfW = obs.width / 2;
            for (let k = 0; k < 2; k++) {
              const spikeBaseLeft = obs.x + k * halfW + 2;
              const spikeBaseRight = obs.x + (k + 1) * halfW - 2;
              const spikeCenterX = obs.x + k * halfW + halfW / 2;

              if (cubeRight > spikeBaseLeft && cubeLeft < spikeBaseRight) {
                const checkX = Math.max(cubeLeft, Math.min(cubeRight, spikeCenterX));
                const dist = Math.abs(checkX - spikeCenterX);
                const slope = Math.max(0, 1 - (dist / (halfW / 2)) * 1.15);
                const spikeSurfaceY = groundY - (obs.height - 2) * slope;

                if (cubeBottom >= spikeSurfaceY) {
                  crashed = true;
                  break;
                }
              }
            }
          }

          if (crashed) {
            gameStateRef.current = 'gameover';
            setGameState('gameover');
            s.screenShake = 10;
            playSound('error');

            if (scoreRef.current > highScoreRef.current) {
              highScoreRef.current = Math.floor(scoreRef.current);
              setHighScore(highScoreRef.current);
            }

            // Geometry Dash Square Shard Shatter Burst
            for (let k = 0; k < 18; k++) {
              const angle = Math.random() * Math.PI * 2;
              const spd = 2 + Math.random() * 4.5;
              particlesRef.current.push({
                x: s.x + cubeSize / 2,
                y: groundY - cubeSize / 2 + s.y,
                vx: Math.cos(angle) * spd,
                vy: Math.sin(angle) * spd - 2,
                size: Math.random() > 0.5 ? 4 : 2.5,
                alpha: 1.0,
                color: Math.random() > 0.3 ? '#ff3700' : '#ffffff',
                rot: Math.random() * Math.PI,
                vrot: (Math.random() - 0.5) * 0.3,
              });
            }
          }

          if (obs.x + obs.width < -30) {
            s.obstacles.splice(i, 1);
          }
        }
      }

      // ── 5. DRAW JUMP RING ORBS ──
      s.jumpOrbs.forEach((orb) => {
        const ox = Math.round(orb.x);
        const oy = Math.round(orb.y);
        const pulse = Math.sin(s.frame * 0.15) * 2;

        // Outer Yellow Ring
        ctx.strokeStyle = orb.activated ? 'rgba(255, 200, 0, 0.3)' : '#ffbb00';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ox, oy, orb.radius + (orb.activated ? 0 : pulse), 0, Math.PI * 2);
        ctx.stroke();

        // Inner glowing core
        ctx.fillStyle = orb.activated ? 'rgba(255, 255, 255, 0.4)' : '#ffffff';
        ctx.beginPath();
        ctx.arc(ox, oy, 3.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // ── 6. DRAW OBSTACLES (Classic Geometry Dash Neon Spikes) ──
      s.obstacles.forEach((obs) => {
        const ox = Math.round(obs.x);
        const oy = groundY;

        if (obs.type === 'spike') {
          // Sharp Neon Spike
          ctx.fillStyle = '#ff3700';
          ctx.beginPath();
          ctx.moveTo(ox, oy);
          ctx.lineTo(ox + obs.width / 2, oy - obs.height);
          ctx.lineTo(ox + obs.width, oy);
          ctx.closePath();
          ctx.fill();

          // Highlight edge
          ctx.fillStyle = '#ff6633';
          ctx.beginPath();
          ctx.moveTo(ox + 2, oy);
          ctx.lineTo(ox + obs.width / 2, oy - obs.height + 2);
          ctx.lineTo(ox + obs.width / 2, oy);
          ctx.closePath();
          ctx.fill();
        } else if (obs.type === 'double-spike') {
          const halfW = obs.width / 2;
          for (let k = 0; k < 2; k++) {
            const kx = ox + k * halfW;
            ctx.fillStyle = '#ff3700';
            ctx.beginPath();
            ctx.moveTo(kx, oy);
            ctx.lineTo(kx + halfW / 2, oy - obs.height);
            ctx.lineTo(kx + halfW, oy);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#ff6633';
            ctx.beginPath();
            ctx.moveTo(kx + 2, oy);
            ctx.lineTo(kx + halfW / 2, oy - obs.height + 2);
            ctx.lineTo(kx + halfW / 2, oy);
            ctx.closePath();
            ctx.fill();
          }
        } else {
          // Geometry Dash Tech Block
          ctx.fillStyle = '#141418';
          ctx.fillRect(ox, oy - obs.height, obs.width, obs.height);
          ctx.strokeStyle = '#282834';
          ctx.lineWidth = 1;
          ctx.strokeRect(ox, oy - obs.height, obs.width, obs.height);

          // Top active vermilion rail
          ctx.fillStyle = '#ff3700';
          ctx.fillRect(ox, oy - obs.height, obs.width, 2);
        }
      });

      // ── 7. DRAW GEOMETRY DASH CUBE ──
      if (gameStateRef.current !== 'gameover') {
        const cx = s.x + cubeSize / 2;
        const cy = groundY - cubeSize / 2 + s.y;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate((s.rotation * Math.PI) / 180);

        // Outer Neon Vermilion Cube
        ctx.fillStyle = '#ff3700';
        ctx.fillRect(-cubeSize / 2, -cubeSize / 2, cubeSize, cubeSize);

        // Inner Black Border
        ctx.fillStyle = '#050508';
        ctx.fillRect(-cubeSize / 2 + 2.5, -cubeSize / 2 + 2.5, cubeSize - 5, cubeSize - 5);

        // Inner Face Vermilion Plate
        ctx.fillStyle = '#ff3700';
        ctx.fillRect(-cubeSize / 2 + 4.5, -cubeSize / 2 + 4.5, cubeSize - 9, cubeSize - 9);

        // Iconic Geometry Dash Square Eyes
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-cubeSize / 2 + 6, -cubeSize / 2 + 6.5, 3, 3);
        ctx.fillRect(-cubeSize / 2 + 13, -cubeSize / 2 + 6.5, 3, 3);

        ctx.restore();
      }

      ctx.restore();
    };

    const container = containerRef.current;
    if (container && typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          isVisible = entry.isIntersecting;
          if (isVisible && animId === 0) {
            animId = requestAnimationFrame(render);
          }
        }
      }, { threshold: 0.05 });
      observer.observe(container);
    } else {
      isVisible = true;
      render();
    }

    return () => {
      if (observer) {
        try { observer.disconnect(); } catch {}
      }
      if (animId) cancelAnimationFrame(animId);
    };
  }, [performJump]);

  return (
    <div
      ref={containerRef}
      onMouseDown={() => {
        isHoldingJumpRef.current = true;
        triggerJump();
      }}
      onMouseUp={() => {
        isHoldingJumpRef.current = false;
      }}
      onTouchStart={() => {
        isHoldingJumpRef.current = true;
        triggerJump();
      }}
      onTouchEnd={() => {
        isHoldingJumpRef.current = false;
      }}
      onFocus={() => setIsFocused(true)}
      onBlur={() => {
        setIsFocused(false);
        isHoldingJumpRef.current = false;
      }}
      role="button"
      tabIndex={0}
      aria-label="Geometry Dash Mini Game"
      className="relative w-full max-w-[380px] h-[185px] sm:h-[200px] rounded-[18px] bg-[#08080a] border border-white/[0.08] hover:border-white/20 shadow-2xl overflow-hidden cursor-pointer select-none outline-none focus:outline-none focus:ring-0 group transition-all duration-200"
    >
      {/* ── MINIMAL SCORE HUD (TOP RIGHT ONLY, NO CLUTTER) ── */}
      <div className="absolute top-2.5 right-3.5 z-10 flex items-center gap-2 pointer-events-none font-mono select-none text-[11px]">
        {highScore > 0 && (
          <span className="text-white/30 text-[10px] tracking-wider font-semibold">
            HI {String(highScore).padStart(5, '0')}
          </span>
        )}
        <span className="px-2 py-0.5 rounded-[5px] bg-black/70 border border-white/10 text-white font-bold tracking-wider shadow-sm">
          {String(score).padStart(5, '0')}
        </span>
      </div>

      {/* ── CANVAS ── */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-none"
        style={{ imageRendering: 'pixelated' }}
      />

      {/* ── IDLE / UNFOCUSED OVERLAY (NO TEXT, SLEEK PIXEL PLAY ICON) ── */}
      {(!isFocused || gameState === 'idle') && gameState !== 'gameover' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center backdrop-blur-[2px] bg-black/35 transition-all duration-200 pointer-events-none">
          <div className="flex items-center justify-center w-11 h-11 rounded-full bg-black/75 border border-white/15 text-white/85 shadow-2xl backdrop-blur-sm group-hover:border-[#ff3700]/70 group-hover:text-[#ff3700] group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,55,0,0.35)] transition-all duration-200">
            <PixelPlayIcon className="w-5 h-5 ml-0.5" />
          </div>
        </div>
      )}

      {/* ── GAMEOVER INSTANT RETRY (ACTUAL RELOAD ICON, NO BORDER, NO BLUR, NO TEXT) ── */}
      {gameState === 'gameover' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              triggerJump();
            }}
            title="Restart"
            aria-label="Restart"
            className="pointer-events-auto p-3 text-white/80 hover:text-[#ff3700] hover:scale-125 active:scale-90 transition-all duration-150 cursor-pointer drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
          >
            <PixelReloadIcon className="w-8 h-8 sm:w-10 sm:h-10" />
          </button>
        </div>
      )}
    </div>
  );
}

export default PixelDragonGame;
