class AudioSynthesizer {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playTone(freq: number, durationMs: number, type: OscillatorType = 'sine') {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + durationMs / 1000);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + durationMs / 1000);
    } catch {
      // Audio might be blocked by autoplay policies
    }
  }

  public playDit() {
    this.playTone(750, 70, 'sine');
  }

  public playDah() {
    this.playTone(750, 210, 'sine');
  }

  public playKintsugiSpark() {
    this.playTone(1200, 150, 'triangle');
  }

  public playConsensusCommit() {
    this.playTone(440, 90, 'sine');
    setTimeout(() => this.playTone(880, 160, 'sine'), 100);
  }
}

export const audioSynth = new AudioSynthesizer();
