
import React from 'react';
import { X, Volume2, Bell, Monitor, FileAudio, Trash2 } from 'lucide-react';
import { Settings } from '../types.ts';

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-[#111] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-8 border-b border-white/5">
          <h2 className="text-2xl font-bold">Preferences</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6 text-white/40" />
          </button>
        </div>

        <div className="p-8 space-y-10 max-h-[70vh] overflow-y-auto">
          {/* Ambience */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <div className="p-3 bg-blue-500/10 rounded-2xl"><Volume2 className="text-blue-400" /></div>
                <div><h3 className="font-semibold">Ambience</h3><p className="text-xs text-white/30">Looping background audio</p></div>
              </div>
              <Switch checked={settings.ambience.enabled} onChange={() => onSave({...settings, ambience: {...settings.ambience, enabled: !settings.ambience.enabled}})} />
            </div>
            {settings.ambience.enabled && (
              <div className="pl-14">
                <FilePicker name={settings.ambience.fileName} onUpload={(e) => handleUpload('ambience', e)} onClear={() => onSave({...settings, ambience: {...settings.ambience, fileUrl: null, fileName: null}})} />
              </div>
            )}
          </section>

          {/* Interval */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-2xl"><Bell className="text-emerald-400" /></div>
                <div><h3 className="font-semibold">Interval Alerts</h3><p className="text-xs text-white/30">Recurring chime during countdown</p></div>
              </div>
              <Switch checked={settings.interval.enabled} onChange={() => onSave({...settings, interval: {...settings.interval, enabled: !settings.interval.enabled}})} />
            </div>
            {settings.interval.enabled && (
              <div className="pl-14 space-y-4">
                <FilePicker name={settings.interval.fileName} onUpload={(e) => handleUpload('interval', e)} onClear={() => onSave({...settings, interval: {...settings.interval, fileUrl: null, fileName: null}})} />
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl">
                  <span className="text-xs text-white/30 uppercase tracking-widest font-bold">Every</span>
                  <input type="number" value={settings.interval.period} onChange={(e) => onSave({...settings, interval: {...settings.interval, period: parseInt(e.target.value) || 0}})} className="bg-transparent border-b border-white/20 w-12 text-center outline-none" />
                  <span className="text-xs text-white/30 uppercase tracking-widest font-bold">Seconds</span>
                </div>
              </div>
            )}
          </section>

          {/* Wake Lock */}
          <section className="pt-6 border-t border-white/5 flex items-center justify-between">
            <div className="flex gap-4">
              <div className="p-3 bg-amber-500/10 rounded-2xl"><Monitor className="text-amber-400" /></div>
              <div><h3 className="font-semibold">Stay Awake</h3><p className="text-xs text-white/30">Prevent screen timeout</p></div>
            </div>
            <Switch checked={settings.keepScreenOn} onChange={() => onSave({...settings, keepScreenOn: !settings.keepScreenOn})} />
          </section>
        </div>

        <div className="p-8 bg-[#0d0d0d]">
          <button onClick={onClose} className="w-full py-5 bg-white text-black rounded-[1.5rem] font-bold text-sm uppercase tracking-widest hover:bg-zinc-200 transition-all">
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

const Switch = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
  <button onClick={onChange} className={`relative w-14 h-7 rounded-full transition-colors ${checked ? 'bg-white' : 'bg-white/10'}`}>
    <div className={`absolute top-1 left-1 w-5 h-5 rounded-full transition-all ${checked ? 'translate-x-7 bg-black' : 'translate-x-0 bg-white/40'}`} />
  </button>
);

const FilePicker = ({ name, onUpload, onClear }: any) => (
  <div className="flex items-center gap-2">
    {!name ? (
      <label className="flex-1 px-5 py-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-dashed border-white/10 text-xs font-medium cursor-pointer transition-all flex items-center justify-center gap-3">
        <FileAudio className="w-4 h-4" /> Choose Audio File
        <input type="file" accept="audio/*" onChange={onUpload} className="hidden" />
      </label>
    ) : (
      <div className="flex-1 flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5">
        <span className="text-xs text-white/50 truncate max-w-[150px]">{name}</span>
        <button onClick={onClear} className="text-white/20 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
      </div>
    )}
  </div>
);

export default SettingsModal;
