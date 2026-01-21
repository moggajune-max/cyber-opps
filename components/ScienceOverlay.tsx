
import React from 'react';
import { ScienceFact } from '../types';

interface ScienceOverlayProps {
  fact: ScienceFact | null;
  loading: boolean;
  onContinue: () => void;
}

const ScienceOverlay: React.FC<ScienceOverlayProps> = ({ fact, loading, onContinue }) => {
  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl">
      <div className="max-w-2xl w-full glass-morphism border-2 border-cyan-500/30 overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.2)]">
        {/* Header Bar */}
        <div className="bg-cyan-500/10 p-3 border-b border-cyan-500/30 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-500 animate-pulse"></div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-cyan-500 uppercase">S.T.E.M. INTELLIGENCE DECRYPTED</span>
          </div>
          <span className="text-[10px] font-bold text-slate-500">REF: ALPHA-9-TACTICAL</span>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="flex flex-col items-center py-16">
              <div className="grid grid-cols-3 gap-1 mb-6">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="w-3 h-3 bg-cyan-500/40 animate-pulse" style={{ animationDelay: `${i * 100}ms` }}></div>
                ))}
              </div>
              <h2 className="text-sm font-bold tracking-widest text-cyan-500 animate-pulse">SYNCHRONIZING TACTICAL DATA...</h2>
            </div>
          ) : fact ? (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-4xl font-orbitron font-black text-white mb-1 uppercase tracking-tighter">
                    {fact.topic}
                  </h2>
                  <div className="flex gap-4">
                     <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">CATEGORY: {fact.category}</span>
                     <span className={`text-[10px] font-bold uppercase tracking-widest ${
                       fact.threatLevel === 'Extreme' ? 'text-red-500' : 'text-orange-500'
                     }`}>THREAT: {fact.threatLevel}</span>
                  </div>
                </div>
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded flex items-center justify-center text-3xl">
                  {fact.funEmoji}
                </div>
              </div>
              
              <div className="bg-slate-900/50 p-6 border-l-4 border-cyan-500 mb-10 relative">
                <i className="fa-solid fa-quote-left absolute -top-3 left-2 text-cyan-500/30 text-4xl"></i>
                <p className="text-lg text-slate-300 leading-relaxed font-medium italic">
                  {fact.fact}
                </p>
              </div>
              
              <button 
                onClick={onContinue}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 py-5 font-black text-xl hover:skew-x-1 transition-all flex items-center justify-center gap-3 group"
              >
                RETURN TO COMBAT 
                <i className="fa-solid fa-chevron-right group-hover:translate-x-2 transition-transform"></i>
              </button>
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-red-500 font-bold">SIGNAL INTERRUPTED</p>
              <button onClick={onContinue} className="mt-4 text-cyan-400 underline">Manual Bypass</button>
            </div>
          )}
        </div>
        
        {/* Decorative Bits */}
        <div className="flex border-t border-cyan-500/20">
          <div className="flex-1 h-1 bg-cyan-900/30"></div>
          <div className="w-20 h-1 bg-cyan-500 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default ScienceOverlay;
