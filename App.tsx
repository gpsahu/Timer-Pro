
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Settings as SettingsIcon, X, Play, Pause, RotateCcw, Volume2, Bell, Clock, Monitor, Maximize2 } from 'lucide-react';
import { TimerStatus, Settings, TimeState } from './types';
import TimerDisplay from './components/TimerDisplay';
import SettingsModal from './components/SettingsModal';

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
  const intervalAudioRef = useRef<HTMLAudioElement | null>(null);
  const wakeLockRef = useRef<any>(null);

  // Handle hardware back button (via Escape key simulation in wrappers)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showSettings) {
        setShowSettings(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSettings]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(e => console.error(e));
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  useEffect(() => {
    const requestWakeLock = async () => {
      if ('wakeLock' in navigator && settings.keepScreenOn && status === TimerStatus.RUNNING) {
        try {
          wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
        } catch (err) {
          console.error(`${err.name}, ${err.message}`);
        }
      } else {
        if (wakeLockRef.current) {
          wakeLockRef.current.release();
          wakeLockRef.current = null;
        }
      }
    };
    requestWakeLock();
    return () => {
      if (wakeLockRef.current) wakeLockRef.current.release();
    };
  }, [status, settings.keepScreenOn]);

  useEffect(() => {
    if (status === TimerStatus.RUNNING && settings.ambience.enabled && settings.ambience.fileUrl) {
      if (!ambienceAudioRef.current) {
        ambienceAudioRef.current = new Audio(settings.ambience.fileUrl);
        ambienceAudioRef.current.loop = true;
      }
      ambienceAudioRef.current.play().catch(e => console.error("Ambience play error", e));
    } else {
      if (ambienceAudioRef.current) {
        ambienceAudioRef.current.pause();
      }
    }
  }, [status, settings.ambience.enabled, settings.ambience.fileUrl]);

  useEffect(() => {
    let timer: number;
    if (status === TimerStatus.RUNNING && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => {
          const next = prev - 1;
          
          if (settings.interval.enabled && settings.interval.period > 0) {
            const elapsed = initialTime - next;
            if (elapsed > 0 && elapsed % settings.interval.period === 0 && next > 0) {
              if ('vibrate' in navigator) {
                navigator.vibrate([100, 50, 100]);
              }

              if (settings.interval.fileUrl) {
                if (intervalAudioRef.current) {
                  intervalAudioRef.current.currentTime = 0;
                  intervalAudioRef.current.play().catch(e => console.error(e));
                } else {
                  intervalAudioRef.current = new Audio(settings.interval.fileUrl);
                  intervalAudioRef.current.play().catch(e => console.error(e));
                }
              }
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
  }, [status, settings.interval, initialTime]);

  const handleStart = () => {
    setStatus(TimerStatus.RUNNING);
    if (!document.fullscreenElement && window.innerWidth < 768) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };
  
  const handlePause = () => setStatus(TimerStatus.PAUSED);
  const handleReset = () => {
    setStatus(TimerStatus.IDLE);
    setTimeLeft(initialTime);
  };

  return (
    <div className="relative w-screen h-screen bg-[#0a0a0a] overflow-hidden flex flex-col items-center justify-center select-none touch-none pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] px-[env(safe-area-inset-left)]">
      {/* Settings & Fullscreen Toggle */}
      <div className={`absolute top-[calc(1rem+env(safe-area-inset-top))] right-[calc(1rem+env(safe-area-inset-right))] z-50 flex gap-3 transition-all duration-500 ${status === TimerStatus.RUNNING ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <button 
          onClick={toggleFullscreen}
          className="p-3 bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-md border border-white/10 active:scale-90 transition-transform"
        >
          <Maximize2 className="w-5 h-5 text-white/60" />
        </button>
        <button 
          onClick={() => setShowSettings(true)}
          className="p-3 bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-md border border-white/10 active:scale-90 transition-transform"
        >
          <SettingsIcon className="w-6 h-6 text-white/80" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center w-full px-4">
        <TimerDisplay 
          seconds={timeLeft} 
          onAdjust={(s) => { setTimeLeft(s); setInitialTime(s); }} 
          isAdjustable={status === TimerStatus.IDLE}
          isRunning={status === TimerStatus.RUNNING}
        />
      </div>

      <div className={`absolute bottom-[calc(3rem+env(safe-area-inset-bottom))] flex justify-center items-center gap-8 transition-all duration-700 ${status === TimerStatus.RUNNING ? 'opacity-0 translate-y-24 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
        {status !== TimerStatus.RUNNING && (
          <button 
            onClick={handleReset} 
            className="p-4 bg-white/5 rounded-full border border-white/10 text-white/60 active:scale-90 transition-transform"
          >
            <RotateCcw className="w-8 h-8" />
          </button>
        )}
        
        {status === TimerStatus.RUNNING ? (
          <button 
            onClick={handlePause} 
            className="p-6 bg-white rounded-full text-black active:scale-95 transition-transform"
          >
            <Pause className="w-10 h-10 fill-current" />
          </button>
        ) : (
          <button 
            onClick={handleStart} 
            className="p-8 bg-white rounded-full text-black shadow-[0_0_80px_rgba(255,255,255,0.1)] active:scale-95 transition-transform"
          >
            <Play className="w-12 h-12 fill-current ml-1" />
          </button>
        )}
      </div>

      {status === TimerStatus.RUNNING && (
        <div 
          onClick={handlePause} 
          className="absolute inset-0 z-10 bg-transparent" 
          aria-label="Tap to pause"
        />
      )}

      {showSettings && (
        <SettingsModal settings={settings} onSave={setSettings} onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}
