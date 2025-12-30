
import React from 'react';
import { X, Volume2, Bell, Monitor, FileAudio, Trash2 } from 'lucide-react';
import { Settings } from '../types';

interface SettingsModalProps {
  settings: Settings;
  onSave: (s: Settings) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onSave, onClose }) => {
  const handleUpload = (type: 'ambience' | 'interval', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSave({
        ...settings,
        [type]: { ...settings[type], fileUrl: URL.createObjectURL(file), fileName: file.name }
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-[#111] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between p-8 border-b border-white/5 flex-shrink-0">
          <h2 className="text-xl font-bold tracking-tight uppercase">Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors active:scale-90">
            <X className="w-6 h-6 text-white/40" />
          </button>
        </div>

        <div className="p-8 space-y-10 overflow-y-auto custom-scrollbar">
          {/* Ambience Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <div className="p-3 bg-blue-500/10 rounded-2xl"><Volume2 className="w-5 h-5 text-blue-400" /></div>
                <div><h3 className="font-semibold text-sm uppercase tracking-wider">Ambience</h3><p className="text-[10px] text-white/30">Background soundscape</p></div>
              </div>
              <Switch checked={settings.ambience.enabled} onChange={() => onSave({...settings, ambience: {...settings.ambience, enabled: !settings.ambience.enabled}})} />
            </div>
            {settings.ambience.enabled && (
              <div className="pl-14">
                <FilePicker name={settings.ambience.fileName} onUpload={(e) => handleUpload('ambience', e)} onClear={() => onSave({...settings, ambience: {...settings.ambience, fileUrl: null, fileName: null}})} />
              </div>
            )}
          </section>

          {/* Interval Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-2xl"><Bell className="w-5 h-5 text-emerald-400" /></div>
                <div><h3 className="font-semibold text-sm uppercase tracking-wider">Interval Alerts</h3><p className="text-[10px] text-white/30">Periodic notification sound</p></div>
              </div>
              <Switch checked={settings.interval.enabled} onChange={() => onSave({...settings, interval: {...settings.interval, enabled: !settings.interval.enabled}})} />
            </div>
            {settings.interval.enabled && (
              <div className="pl-14 space-y-4">
                <FilePicker name={settings.interval.fileName} onUpload={(e) => handleUpload('interval', e)} onClear={() => onSave({...settings, interval: {...settings.interval, fileUrl: null, fileName: null}})} />
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">Every</span>
                  <input 
                    type="number" 
                    value={settings.interval.period} 
                    onChange={(e) => onSave({...settings, interval: {...settings.interval, period: Math.max(1, parseInt(e.target.value) || 0)}})} 
                    className="bg-transparent border-b border-white/20 w-12 text-center text-sm font-mono outline-none focus:border-emerald-500 transition-colors" 
                  />
                  <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">Seconds</span>
                </div>
              </div>
            )}
          </section>

          {/* Wake Lock Section */}
          <section className="pt-6 border-t border-white/5 flex items-center justify-between">
            <div className="flex gap-4">
              <div className="p-3 bg-amber-500/10 rounded-2xl"><Monitor className="w-5 h-5 text-amber-400" /></div>
              <div><h3 className="font-semibold text-sm uppercase tracking-wider">Stay Awake</h3><p className="text-[10px] text-white/30">Prevent display timeout</p></div>
            </div>
            <Switch checked={settings.keepScreenOn} onChange={() => onSave({...settings, keepScreenOn: !settings.keepScreenOn})} />
          </section>
        </div>

        <div className="p-8 bg-[#0d0d0d] border-t border-white/5 flex-shrink-0">
          <button 
            onClick={onClose} 
            className="w-full py-5 bg-white text-black rounded-[1.5rem] font-bold text-xs uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all active:scale-[0.98]"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const Switch = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
  <button 
    onClick={onChange} 
    className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${checked ? 'bg-white' : 'bg-white/10'}`}
  >
    <div className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-all duration-300 ${checked ? 'translate-x-6 bg-black' : 'translate-x-0 bg-white/40'}`} />
  </button>
);

const FilePicker = ({ name, onUpload, onClear }: any) => (
  <div className="flex items-center gap-2">
    {!name ? (
      <label className="flex-1 px-5 py-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-dashed border-white/10 text-[10px] uppercase tracking-widest font-bold cursor-pointer transition-all flex items-center justify-center gap-3">
        <FileAudio className="w-4 h-4" /> Pick Audio
        <input type="file" accept="audio/*" onChange={onUpload} className="hidden" />
      </label>
    ) : (
      <div className="flex-1 flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5 overflow-hidden">
        <span className="text-[10px] text-white/50 truncate max-w-[200px] font-mono">{name}</span>
        <button onClick={onClear} className="text-white/20 hover:text-red-400 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    )}
  </div>
);

export default SettingsModal;
