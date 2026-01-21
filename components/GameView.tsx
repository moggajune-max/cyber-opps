
import React, { useRef, useEffect } from 'react';
import { Player, Projectile, Enemy } from '../types';

interface GameViewProps {
  isActive: boolean;
  onEnemyDestroyed: (type: string) => void;
  onGameOver: () => void;
  score: number;
}

const ENEMY_TYPES = [
  { name: 'X-1 Recon Drone', type: 'recon', color: '#22d3ee', points: 150, icon: 'fa-microchip' },
  { name: 'EMP Sentry Bot', type: 'heavy', color: '#ef4444', points: 200, icon: 'fa-bolt' },
  { name: 'Stealth Predator', type: 'stealth', color: '#a855f7', points: 300, icon: 'fa-eye-slash' },
  { name: 'Tactical Walker', type: 'interceptor', color: '#f59e0b', points: 250, icon: 'fa-robot' },
];

const GameView: React.FC<GameViewProps> = ({ isActive, onEnemyDestroyed, onGameOver, score }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef<Player>({
    x: window.innerWidth / 2,
    y: window.innerHeight - 150,
    width: 90,
    height: 70,
    speed: 15,
    color: '#06b6d4',
    targetX: window.innerWidth / 2,
    health: 100
  });
  
  const projectilesRef = useRef<Projectile[]>([]);
  const enemiesRef = useRef<Enemy[]>([]);
  const particlesRef = useRef<any[]>([]);
  const screenShakeRef = useRef(0);
  const lastShotTime = useRef<number>(0);
  const lastSpawnTime = useRef<number>(0);
  const animationFrameId = useRef<number>(0);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const createParticles = (x: number, y: number, color: string) => {
    for (let i = 0; i < 20; i++) {
      particlesRef.current.push({
        x, y,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12,
        life: 1.0,
        size: Math.random() * 4 + 2,
        color
      });
    }
  };

  const spawnEnemy = () => {
    const type = ENEMY_TYPES[Math.floor(Math.random() * ENEMY_TYPES.length)];
    const size = 70;
    enemiesRef.current.push({
      x: Math.random() * (window.innerWidth - size),
      y: -size,
      width: size,
      height: size,
      speed: 4 + Math.min(score / 3500, 6),
      color: type.color,
      type: type.type as any,
      hp: 1,
      maxHp: 1,
      points: type.points,
      name: type.name
    });
  };

  const fireProjectile = () => {
    const now = Date.now();
    if (now - lastShotTime.current > 100) {
      // Twin fire
      const p = playerRef.current;
      const positions = [p.x + 10, p.x + p.width - 15];
      positions.forEach(posX => {
        projectilesRef.current.push({
          x: posX,
          y: p.y + 10,
          width: 4,
          height: 30,
          speed: 25,
          color: '#fbbf24',
          active: true
        });
      });
      screenShakeRef.current = Math.min(screenShakeRef.current + 3, 10);
      lastShotTime.current = now;
    }
  };

  const update = () => {
    if (!isActive) return;

    screenShakeRef.current *= 0.85;

    // Movement with inertia
    const dx = playerRef.current.targetX - playerRef.current.x - playerRef.current.width / 2;
    playerRef.current.x += dx * 0.12;

    const now = Date.now();
    const spawnRate = Math.max(1000 - (score / 20), 400);
    if (now - lastSpawnTime.current > spawnRate) {
      spawnEnemy();
      lastSpawnTime.current = now;
    }

    projectilesRef.current.forEach(p => {
      p.y -= p.speed;
      if (p.y < -100) p.active = false;
    });
    projectilesRef.current = projectilesRef.current.filter(p => p.active);

    particlesRef.current.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      p.life -= 0.03;
    });
    particlesRef.current = particlesRef.current.filter(p => p.life > 0);

    enemiesRef.current.forEach(e => {
      e.y += e.speed;
      if (
        e.x < playerRef.current.x + playerRef.current.width &&
        e.x + e.width > playerRef.current.x &&
        e.y < playerRef.current.y + playerRef.current.height &&
        e.y + e.height > playerRef.current.y
      ) {
        onGameOver();
      }
      if (e.y > window.innerHeight) e.hp = -1;
      projectilesRef.current.forEach(p => {
        if (
          p.x < e.x + e.width && p.x + p.width > e.x &&
          p.y < e.y + e.height && p.y + p.height > e.y
        ) {
          e.hp -= 1; p.active = false;
          if (e.hp <= 0) {
            screenShakeRef.current = 20;
            createParticles(e.x + e.width/2, e.y + e.height/2, e.color);
            onEnemyDestroyed(e.name);
          }
        }
      });
    });
    enemiesRef.current = enemiesRef.current.filter(e => e.hp > 0);
  };

  const draw = (ctx: CanvasRenderingContext2D) => {
    const shakeX = (Math.random() - 0.5) * screenShakeRef.current;
    const shakeY = (Math.random() - 0.5) * screenShakeRef.current;

    ctx.save();
    ctx.translate(shakeX, shakeY);
    ctx.clearRect(-200, -200, ctx.canvas.width + 400, ctx.canvas.height + 400);

    // Particles (Debris)
    particlesRef.current.forEach(p => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 10; ctx.shadowColor = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
      ctx.fill();
    });
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;

    // Player (Tactical Interceptor)
    const p = playerRef.current;
    const tilt = (p.targetX - (p.x + p.width/2)) * 0.02;
    
    ctx.save();
    ctx.translate(p.x + p.width/2, p.y + p.height/2);
    ctx.rotate(tilt * (Math.PI/180) * 15);
    ctx.translate(-(p.x + p.width/2), -(p.y + p.height/2));

    // Shadow/Glow
    ctx.shadowBlur = 25; ctx.shadowColor = 'rgba(6, 182, 212, 0.5)';
    ctx.fillStyle = '#0891b2';
    // Main Body
    ctx.fillRect(p.x + 35, p.y + 10, 20, p.height - 20);
    // Angular Wings
    ctx.fillStyle = '#0ea5e9';
    ctx.beginPath();
    ctx.moveTo(p.x, p.y + p.height - 10);
    ctx.lineTo(p.x + p.width/2, p.y);
    ctx.lineTo(p.x + p.width, p.y + p.height - 10);
    ctx.fill();
    // Detail Lines
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1;
    ctx.strokeRect(p.x + 40, p.y + 20, 10, 30);
    ctx.restore();
    ctx.shadowBlur = 0;

    // Projectiles (Glow Tracers)
    projectilesRef.current.forEach(proj => {
      ctx.fillStyle = '#fff';
      ctx.shadowBlur = 15; ctx.shadowColor = proj.color;
      ctx.fillRect(proj.x, proj.y, proj.width, proj.height);
      // Streak effect
      ctx.globalAlpha = 0.3;
      ctx.fillRect(proj.x, proj.y + 30, proj.width, 50);
      ctx.globalAlpha = 1;
    });
    ctx.shadowBlur = 0;

    // Enemies (War Machines)
    enemiesRef.current.forEach(e => {
      ctx.save();
      ctx.shadowBlur = 20; ctx.shadowColor = e.color;
      ctx.fillStyle = e.color;
      
      // Modern Military Shape
      ctx.beginPath();
      ctx.moveTo(e.x + 20, e.y);
      ctx.lineTo(e.x + e.width - 20, e.y);
      ctx.lineTo(e.x + e.width, e.y + e.height);
      ctx.lineTo(e.x, e.y + e.height);
      ctx.closePath();
      ctx.fill();

      // Warning symbols
      ctx.fillStyle = 'white';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('TARGET', e.x + e.width/2, e.y + e.height/2);
      
      ctx.restore();
    });

    ctx.restore();
  };

  const loop = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        update();
        draw(ctx);
      }
    }
    animationFrameId.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    animationFrameId.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId.current);
  }, [isActive]);

  const handleMouseMove = (e: React.MouseEvent) => {
    playerRef.current.targetX = e.clientX;
    fireProjectile();
  };

  return (
    <canvas 
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onClick={fireProjectile}
      className="cursor-none w-full h-full relative z-20"
    />
  );
};

export default GameView;
