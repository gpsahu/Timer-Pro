
import React, { useState, useEffect, useRef } from 'react';
import { Settings as SettingsIcon, Play, Pause, RotateCcw, Maximize2 } from 'lucide-react';
import { TimerStatus, Settings } from './types.ts';
import TimerDisplay from './components/TimerDisplay.tsx';
import SettingsModal from './components/SettingsModal.tsx';

const DEFAULT_SETTINGS: Settings = {
  ambience: {
    enabled: false,
    fileUrl: null,
    fileName: null,
  },
  interval: {
    enabled: false,
    fileUrl: null,
    fileName: null,
    period: 60,
  },
  keepScreenOn: true,
};

export default function App() {
  const [status, setStatus] = useState<TimerStatus>(TimerStatus.IDLE);
  const [timeLeft, setTimeLeft] = useState<number>(300);
  const [initialTime, setInitialTime] = useState<number>(300);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  const ambienceAudioRef = useRef<HTMLAudioElement | null>(null);
  const wakeLockRef = useRef<any>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(e => console.error(e));
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  // Wake Lock API
  useEffect(() => {
    const handleWakeLock = async () => {
      if ('wakeLock' in navigator && settings.keepScreenOn && status === TimerStatus.RUNNING) {
        try {
          wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
        } catch (err) {
          console.warn('Wake lock failed', err);
        }
      } else if (wakeLockRef.current) {
        wakeLockRef.current.release().then(() => {
          wakeLockRef.current = null;
        });
      }
    };
    handleWakeLock();
  }, [status, settings.keepScreenOn]);

  // Ambience Handling
  useEffect(() => {
    if (status === TimerStatus.RUNNING && settings.ambience.enabled && settings.ambience.fileUrl) {
      if (!ambienceAudioRef.current) {
        ambienceAudioRef.current = new Audio(settings.ambience.fileUrl);
        ambienceAudioRef.current.loop = true;
      }
      ambienceAudioRef.current.play().catch(console.error);
    } else {
      ambienceAudioRef.current?.pause();
    }
  }, [status, settings.ambience.enabled, settings.ambience.fileUrl]);

  // Timer Tick
  useEffect(() => {
    let timer: number;
    if (status === TimerStatus.RUNNING && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => {
          const next = prev - 1;
          
          if (settings.interval.enabled && settings.interval.fileUrl && settings.interval.period > 0) {
            const elapsed = initialTime - next;
            if (elapsed > 0 && elapsed % settings.interval.period === 0 && next > 0) {
              const alert = new Audio(settings.interval.fileUrl);
              alert.play().catch(console.error);
            }
          }

          if (next <= 0) {
            setStatus(TimerStatus.IDLE);
            return 0;
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [status, settings.interval, initialTime, timeLeft]);

  const isRunning = status === TimerStatus.RUNNING;

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full bg-[#0a0a0a]">
      
      {/* Settings Icon - Hidden when running */}
      <div className={`absolute top-6 right-6 z-50 transition-all duration-700 ${isRunning ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100 scale-100'}`}>
        <button 
          onClick={() => setShowSettings(true)}
          className="p-4 rounded-2xl glass hover:bg-white/10 active:scale-90 transition-all"
        >
          <SettingsIcon className="w-6 h-6 text-white/70" />
        </button>
      </div>

      {/* Main Display Area */}
      <main className="flex-1 flex items-center justify-center w-full cursor-default">
        <TimerDisplay 
          seconds={timeLeft} 
          onAdjust={(s) => { setTimeLeft(s); setInitialTime(s); }} 
          isAdjustable={status === TimerStatus.IDLE}
          isRunning={isRunning}
        />
      </main>

      {/* Controls Overlay - Hidden when running */}
      <div className={`absolute bottom-16 flex items-center gap-12 transition-all duration-700 ${isRunning ? 'opacity-0 translate-y-16 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
        {status !== TimerStatus.IDLE && (
          <button onClick={() => { setStatus(TimerStatus.IDLE); setTimeLeft(initialTime); }} className="p-4 rounded-full glass hover:bg-white/5 transition-all text-white/30 hover:text-white/60">
            <RotateCcw className="w-8 h-8" />
          </button>
        )}
        
        <button 
          onClick={() => setStatus(TimerStatus.RUNNING)} 
          className="p-10 bg-white rounded-full text-black shadow-2xl hover:scale-105 active:scale-95 transition-all"
        >
          <Play className="w-12 h-12 fill-current ml-1" />
        </button>
      </div>

      {/* Immersive Click-to-Pause Overlay */}
      {isRunning && (
        <div 
          onClick={() => setStatus(TimerStatus.PAUSED)} 
          className="absolute inset-0 z-10 cursor-pointer" 
          aria-label="Pause"
        />
      )}

      {showSettings && (
        <SettingsModal 
          settings={settings} 
          onSave={setSettings} 
          onClose={() => setShowSettings(false)} 
        />
      )}
    </div>
  );
}
