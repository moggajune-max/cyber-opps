
import React from 'react';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-50 text-center px-4 bg-slate-950/40">
      <div className="mb-8 relative">
         <i className="fa-solid fa-crosshairs text-[12rem] text-cyan-500/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></i>
         <i className="fa-solid fa-jet-fighter text-8xl text-cyan-400 drop-shadow-[0_0_25px_rgba(34,211,238,0.6)] animate-pulse"></i>
      </div>
      
      <div className="flex items-center gap-4 mb-2">
        <div className="h-px w-12 bg-cyan-500/50"></div>
        <span className="text-cyan-500 font-bold tracking-[0.3em] text-sm">STRATEGIC DEFENSE UNIT</span>
        <div className="h-px w-12 bg-cyan-500/50"></div>
      </div>

      <h1 className="text-6xl md:text-8xl font-orbitron font-bold mb-4 text-white tracking-tighter">
        CYBER<span className="text-cyan-500">OPS</span>
      </h1>
      <p className="text-lg md:text-xl text-slate-400 max-w-xl mb-12 font-medium tracking-wide uppercase italic">
        "Victory favors the technologically superior."
      </p>
      
      <button 
        onClick={onStart}
        className="group relative px-16 py-6 bg-cyan-600 hover:bg-cyan-500 text-slate-950 rounded-sm font-orbitron text-2xl font-black transition-all transform hover:skew-x-2 shadow-[0_0_30px_rgba(8,145,178,0.4)]"
      >
        <span className="relative z-10 flex items-center gap-4">
          ENGAGE TARGETS <i className="fa-solid fa-gun"></i>
        </span>
        <div className="absolute inset-0 border-2 border-white/30 translate-x-1 translate-y-1"></div>
      </button>

      <div className="mt-20 flex gap-12 text-slate-500">
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-bold">STATUS</span>
          <span className="text-green-500 text-xs">ONLINE</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-bold">ENCRYPTION</span>
          <span className="text-cyan-500 text-xs">AES-256</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-bold">REGISTRY</span>
          <span className="text-slate-400 text-xs">S.T.E.M. UNIT</span>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
