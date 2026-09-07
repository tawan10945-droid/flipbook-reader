// Realistic Paper Turn Sound & Haptics Engine via Web Audio API

class SoundService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Read mute preference from localStorage
    const saved = localStorage.getItem('flipbook_sound_muted');
    if (saved !== null) {
      this.isMuted = saved === 'true';
    }
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('flipbook_sound_muted', String(this.isMuted));
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public playPageTurn() {
    // Provide haptic feedback if available (e.g. mobile Safari / Chrome)
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(12);
      } catch {
        // Ignore haptic errors
      }
    }

    if (this.isMuted) return;

    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const duration = 0.22; // 220ms page flip swoosh

      // 1. White Noise Buffer for paper rustle
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // Pink-ish noise curve
        output[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 0.5);
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      // 2. Bandpass Filter simulating paper texture friction
      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(1400, now);
      bandpass.frequency.exponentialRampToValueAtTime(500, now + duration);
      bandpass.Q.setValueAtTime(1.8, now);

      // 3. Lowpass filter for warm acoustic paper feel
      const lowpass = this.ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(3200, now);
      lowpass.frequency.exponentialRampToValueAtTime(1200, now + duration);

      // 4. Volume Envelope (Quick attack, gentle natural decay)
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      // Connect nodes
      whiteNoise.connect(bandpass);
      bandpass.connect(lowpass);
      lowpass.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + duration);
    } catch (err) {
      console.warn('Audio playback error:', err);
    }
  }
}

export const soundService = new SoundService();
