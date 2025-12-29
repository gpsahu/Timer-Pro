
import React from 'react';

interface TimerDisplayProps {
  seconds: number;
  onAdjust: (newTotalSeconds: number) => void;
  isAdjustable: boolean;
  isRunning: boolean;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ seconds, onAdjust, isAdjustable, isRunning }) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  const adjustPart = (part: 'h' | 'm' | 's', delta: number) => {
    if (!isAdjustable) return;
    
    let newSeconds = seconds;
    if (part === 'h') newSeconds += delta * 3600;
    if (part === 'm') newSeconds += delta * 60;
    if (part === 's') newSeconds += delta;
    
    // Clamp between 0 and 99:59:59
    const clamped = Math.max(0, Math.min(359999, newSeconds));
    onAdjust(clamped);
  };

  // Determine if we should show hours. 
  // We show them if they are > 0 OR if we are in adjustable mode (to allow setting them).
  const showHours = h > 0 || isAdjustable;

  return (
    <div className={`flex flex-col items-center justify-center w-full h-full transition-all duration-700 ${isRunning ? 'scale-100' : 'scale-90'}`}>
      <div 
        className={`flex items-baseline justify-center w-full timer-font font-bold tracking-tighter text-white transition-all duration-700 leading-none
          ${isRunning 
            ? (showHours ? 'text-[22vw]' : 'text-[35vw]') 
            : 'text-[18vw] md:text-[15rem]'
          }`}
      >
        
        {/* Hours */}
        {showHours && (
          <>
            <div className="relative group flex flex-col items-center">
              {isAdjustable && (
                <button 
                  onClick={() => adjustPart('h', 1)}
                  className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-opacity text-white/20 hover:text-white text-4xl"
                >
                  ▲
                </button>
              )}
              <span className="cursor-default select-none">{pad(h)}</span>
              {isAdjustable && (
                <button 
                  onClick={() => adjustPart('h', -1)}
                  className="absolute -bottom-16 opacity-0 group-hover:opacity-100 transition-opacity text-white/20 hover:text-white text-4xl"
                >
                  ▼
                </button>
              )}
            </div>
            <span className={`text-white/20 mx-[1vw] ${isRunning ? 'mb-[2vw]' : 'mb-4'}`}>:</span>
          </>
        )}

        {/* Minutes */}
        <div className="relative group flex flex-col items-center">
          {isAdjustable && (
            <button 
              onClick={() => adjustPart('m', 1)}
              className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-opacity text-white/20 hover:text-white text-4xl"
            >
              ▲
            </button>
          )}
          <span className="cursor-default select-none">{pad(m)}</span>
          {isAdjustable && (
            <button 
              onClick={() => adjustPart('m', -1)}
              className="absolute -bottom-16 opacity-0 group-hover:opacity-100 transition-opacity text-white/20 hover:text-white text-4xl"
            >
              ▼
            </button>
          )}
        </div>

        <span className={`text-white/20 mx-[1vw] ${isRunning ? 'mb-[2vw]' : 'mb-4'}`}>:</span>

        {/* Seconds */}
        <div className="relative group flex flex-col items-center">
          {isAdjustable && (
            <button 
              onClick={() => adjustPart('s', 1)}
              className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-opacity text-white/20 hover:text-white text-4xl"
            >
              ▲
            </button>
          )}
          <span className="cursor-default select-none">{pad(s)}</span>
          {isAdjustable && (
            <button 
              onClick={() => adjustPart('s', -1)}
              className="absolute -bottom-16 opacity-0 group-hover:opacity-100 transition-opacity text-white/20 hover:text-white text-4xl"
            >
              ▼
            </button>
          )}
        </div>
      </div>
      
      {isAdjustable && (
        <div className="text-white/20 text-xs md:text-sm uppercase tracking-[0.4em] mt-12 font-light animate-pulse">
          Tap segments or arrows to adjust
        </div>
      )}
    </div>
  );
};

export default TimerDisplay;
