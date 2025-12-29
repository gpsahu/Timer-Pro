
import React from 'react';
import { X, Volume2, Bell, Monitor, Clock, FileAudio } from 'lucide-react';
import { Settings } from '../types.ts';

interface SettingsModalProps {
  settings: Settings;
  onSave: (settings: Settings) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onSave, onClose }) => {
  const handleFileChange = (type: 'ambience' | 'interval', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onSave({
        ...settings,
        [type]: {
          ...settings[type],
          fileUrl: url,
          fileName: file.name
        }
      });
    }
  };

  const toggleEnabled = (type: 'ambience' | 'interval') => {
    onSave({
      ...settings,
      [type]: {
        ...settings[type],
        enabled: !settings[type].enabled
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-xl">
      <div className="w-full max-w-lg bg-[#111] border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Settings
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-6 h-6 text-white/40" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                  <Volume2 className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white/90">Ambience Sound</h3>
                  <p className="text-xs text-white/40">Plays continuously while running</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.ambience.enabled} 
                  onChange={() => toggleEnabled('ambience')}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
              </label>
            </div>

            {settings.ambience.enabled && (
              <div className="pl-12 space-y-3">
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <FileAudio className="w-4 h-4" />
                  <span className="truncate max-w-[200px]">{settings.ambience.fileName || 'No file selected'}</span>
                </div>
                <label className="inline-block px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-medium cursor-pointer transition-colors">
                  Choose Media
                  <input type="file" accept="audio/*" onChange={(e) => handleFileChange('ambience', e)} className="hidden" />
                </label>
              </div>
            )}
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <Bell className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white/90">Interval Alerts</h3>
                  <p className="text-xs text-white/40">Trigger sound every X period</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.interval.enabled} 
                  onChange={() => toggleEnabled('interval')}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            {settings.interval.enabled && (
              <div className="pl-12 space-y-4">
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <FileAudio className="w-4 h-4" />
                  <span className="truncate max-w-[200px]">{settings.interval.fileName || 'No file selected'}</span>
                </div>
                <div className="flex gap-2 items-center">
                  <label className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-medium cursor-pointer transition-colors">
                    Choose Media
                    <input type="file" accept="audio/*" onChange={(e) => handleFileChange('interval', e)} className="hidden" />
                  </label>
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-1">
                    <Clock className="w-3 h-3 text-white/40 mr-2" />
                    <input 
                      type="number" 
                      value={settings.interval.period}
                      onChange={(e) => onSave({...settings, interval: {...settings.interval, period: parseInt(e.target.value) || 0}})}
                      className="bg-transparent text-sm w-12 text-white focus:outline-none"
                    />
                    <span className="text-[10px] text-white/40 ml-1 uppercase">sec</span>
                  </div>
                </div>
              </div>
            )}
          </section>

          <section className="pt-4 border-t border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <Monitor className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white/90">Keep Screen On</h3>
                  <p className="text-xs text-white/40">Prevent sleep during countdown</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={settings.keepScreenOn} 
                  onChange={() => onSave({...settings, keepScreenOn: !settings.keepScreenOn})}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>
          </section>
        </div>

        <div className="p-6 bg-[#0a0a0a] border-t border-white/5">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-white text-black rounded-2xl font-semibold hover:bg-white/90 transition-colors"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
