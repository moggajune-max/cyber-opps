
export interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  color: string;
}

export interface Player extends GameObject {
  targetX: number;
  health: number;
}

export interface Projectile extends GameObject {
  active: boolean;
}

export interface Enemy extends GameObject {
  type: 'recon' | 'heavy' | 'stealth' | 'interceptor';
  hp: number;
  maxHp: number;
  points: number;
  name: string;
}

export interface ScienceFact {
  topic: string;
  fact: string;
  category: 'Tactical Hardware' | 'Future Warfare' | 'Aerodynamics' | 'Digital Encryption';
  funEmoji: string;
  threatLevel: 'Low' | 'Medium' | 'High' | 'Extreme';
}

export type GameState = 'START' | 'PLAYING' | 'FACT_BREAK' | 'GAMEOVER';
