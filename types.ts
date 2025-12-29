
export enum TimerStatus {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
}

export interface SoundConfig {
  enabled: boolean;
  fileUrl: string | null;
  fileName: string | null;
}

export interface Settings {
  ambience: SoundConfig;
  interval: SoundConfig & { period: number }; // period in seconds
  keepScreenOn: boolean;
}

export interface TimeState {
  hours: number;
  minutes: number;
  seconds: number;
}
