
import React from 'react';

interface TimerDisplayProps {
  seconds: number;
  onAdjust: (total: number) => void;
  isAdjustable: boolean;
  isRunning: boolean;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ seconds, onAdjust, isAdjustable, isRunning }) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  const adjust = (unit: 'h' | 'm' | 's', delta: number) => {
    if (!isAdjustable) return;
    let newSec = seconds;
    if (unit === 'h') newSec += delta * 3600;
    else if (unit === 'm') newSec += delta * 60;
    else newSec += delta;
    onAdjust(Math.max(0, Math.min(359999, newSec)));
  };

  const Segment = ({ val, type, label }: { val: number, type: 'h' | 'm' | 's', label: string }) => (
    <div className="group relative flex flex-col items-center">
      {isAdjustable && (
        <button 
          onClick={() => adjust(type, 1)}
          className="absolute -top-16 opacity-0 group-hover:opacity-40 hover:!opacity-100 transition-all p-4 text-white"
        >
          <span className="text-2xl md:text-3xl">▲</span>
        </button>
      )}
      <div className="flex flex-col items-center">
        <span className="timer-font font-bold leading-none select-none tracking-tighter">
          {pad(val)}
        </span>
        {isAdjustable && (
          <span className="text-[2vw] md:text-[1vw] uppercase tracking-[0.5em] text-white/20 mt-4 font-medium">
            {label}
          </span>
        )}
      </div>
      {isAdjustable && (
        <button 
          onClick={() => adjust(type, -1)}
          className="absolute -bottom-16 opacity-0 group-hover:opacity-40 hover:!opacity-100 transition-all p-4 text-white"
        >
          <span className="text-2xl md:text-3xl">▼</span>
        </button>
      )}
    </div>
  );

  return (
    <div className={`flex flex-col items-center transition-all duration-1000 ${isRunning ? 'scale-110' : 'scale-100'}`}>
      <div className={`flex items-center gap-2 md:gap-4 text-white transition-all duration-700 
        ${isRunning 
          ? 'text-[30vw] md:text-[22vw]' 
          : 'text-[22vw] md:text-[18vw]'
        }`}>
        {(h > 0 || isAdjustable) && (
          <>
            <Segment val={h} type="h" label="Hours" />
            <span className="opacity-10 mb-[2vw]">:</span>
          </>
        )}
        <Segment val={m} type="m" label="Min" />
        <span className="opacity-10 mb-[2vw]">:</span>
        <Segment val={s} type="s" label="Sec" />
      </div>
    </div>
  );
};

export default TimerDisplay;
