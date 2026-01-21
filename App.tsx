
import React, { useState, useEffect } from 'react';
import GameView from './components/GameView';
import ScienceOverlay from './components/ScienceOverlay';
import StartScreen from './components/StartScreen';
import { GameState, ScienceFact } from './types';
import { fetchScienceFact } from './services/geminiService';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('START');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('cyberops_highscore') || '0');
  });
  const [currentFact, setCurrentFact] = useState<ScienceFact | null>(null);
  const [loadingFact, setLoadingFact] = useState(false);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('cyberops_highscore', score.toString());
    }
  }, [score, highScore]);

  const startGame = () => {
    setScore(0);
    setGameState('PLAYING');
  };

  const handleEnemyDestroyed = async (type: string) => {
    setScore(prev => prev + 100);
    if ((score + 100) % 500 === 0) {
      setGameState('FACT_BREAK');
      setLoadingFact(true);
      const fact = await fetchScienceFact(type);
      setCurrentFact(fact);
      setLoadingFact(false);
    }
  };

  const resumeGame = () => {
    setGameState('PLAYING');
    setCurrentFact(null);
  };

  const handleGameOver = () => {
    setGameState('GAMEOVER');
  };

  return (
    <div className={`relative w-full h-screen overflow-hidden select-none ${gameState === 'GAMEOVER' ? 'glitch-active' : ''}`}>
      
      {gameState === 'START' && <StartScreen onStart={startGame} />}

      {(gameState === 'PLAYING' || gameState === 'FACT_BREAK' || gameState === 'GAMEOVER') && (
        <GameView 
          isActive={gameState === 'PLAYING'} 
          onEnemyDestroyed={handleEnemyDestroyed}
          onGameOver={handleGameOver}
          score={score}
        />
      )}

      {gameState === 'FACT_BREAK' && (
        <ScienceOverlay 
          fact={currentFact} 
          loading={loadingFact} 
          onContinue={resumeGame} 
        />
      )}

      {gameState === 'GAMEOVER' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-[100] bg-red-950/40 backdrop-blur-md" role="alert" aria-label="Mission Failed">
          <div className="text-red-500 mb-4 animate-ping text-4xl">⚠️ CRITICAL FAILURE ⚠️</div>
          <h1 className="text-8xl font-orbitron font-black text-white mb-2 tracking-tighter drop-shadow-[0_0_30px_rgba(255,0,0,0.8)]">TERMINATED</h1>
          <div className="flex gap-8 mb-12">
            <div className="text-center">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Mission Score</div>
              <div className="text-3xl text-cyan-400 font-black">{score}</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Record Intel</div>
              <div className="text-3xl text-amber-500 font-black">{highScore}</div>
            </div>
          </div>
          <button 
            onClick={startGame}
            className="group relative bg-white text-slate-950 px-12 py-5 font-black text-2xl tracking-tighter transition-all hover:scale-110 active:scale-95"
            aria-label="Restart Mission"
          >
            RE-ENGAGE SYSTEM
            <div className="absolute inset-0 border-4 border-red-600 -translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform"></div>
          </button>
        </div>
      )}

      {/* TACTICAL HUD */}
      {gameState !== 'START' && (
        <>
          <div className="absolute top-8 left-8 z-40">
            <div className="glass-morphism px-6 py-3 border-l-4 border-cyan-500">
              <div className="text-[10px] text-cyan-500 font-bold tracking-[0.3em] mb-1">UNIT: APEX-DELTA</div>
              <div className="text-3xl text-white font-orbitron font-black italic">
                {score.toString().padStart(7, '0')}
              </div>
            </div>
          </div>

          <div className="absolute top-8 right-8 z-40 text-right">
            <div className="flex items-center gap-4">
               <div className="text-[10px] text-slate-400 font-bold uppercase">
                {navigator.onLine ? (
                  <span className="text-green-500">Signal: Encrypted</span>
                ) : (
                  <span className="text-amber-500">Signal: Offline Cache</span>
                )}
               </div>
               <div className="w-12 h-1 bg-cyan-500 animate-pulse"></div>
            </div>
            <div className="text-[10px] text-slate-400 font-bold mt-2">HI-SCORE: {highScore.toString().padStart(7, '0')}</div>
          </div>

          <div className="absolute bottom-8 left-8 z-40 opacity-50 hidden md:block">
             <div className="w-32 h-32 border-b-2 border-l-2 border-cyan-500/30"></div>
          </div>
          <div className="absolute bottom-8 right-8 z-40 opacity-50 hidden md:block">
             <div className="w-32 h-32 border-b-2 border-r-2 border-cyan-500/30"></div>
          </div>

          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10">
            <div className="w-1 h-1 bg-cyan-500 rounded-full"></div>
            <div className="absolute w-24 h-24 border border-cyan-500/30 rounded-full animate-pulse"></div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
