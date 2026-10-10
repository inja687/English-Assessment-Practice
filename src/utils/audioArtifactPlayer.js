/**
 * Web Audio API Acoustic Artifact Generator
 * Generates genuine in-browser audio samples for Section A:
 * 1. Garbled / Distorted audio
 * 2. Constant background hiss
 * 3. Uniform broadband white noise
 * 4. Muffled / Unclear speech
 * 5. Electrical interference & clicks
 */

class AudioArtifactPlayer {
  constructor() {
    this.audioCtx = null;
    this.activeNodes = [];
    this.isPlaying = false;
    this.currentArtifactType = null;
    this.onEndedCallback = null;
    this.stopTimeout = null;
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  stop() {
    if (this.stopTimeout) {
      clearTimeout(this.stopTimeout);
      this.stopTimeout = null;
    }

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    this.activeNodes.forEach((node) => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch {
        // Ignore already stopped nodes
      }
    });
    this.activeNodes = [];
    this.isPlaying = false;
    this.currentArtifactType = null;

    if (this.onEndedCallback) {
      this.onEndedCallback();
      this.onEndedCallback = null;
    }
  }

  playArtifact(artifactType, speakerText = '', onEnded = null) {
    this.stop();
    const ctx = this.getAudioContext();
    if (!ctx) return false;

    this.isPlaying = true;
    this.currentArtifactType = artifactType;
    this.onEndedCallback = onEnded;

    const duration = 5.0; // Play for 5 seconds

    // Speak prompt text if SpeechSynthesis is supported
    if (window.speechSynthesis && speakerText) {
      try {
        const utterance = new SpeechSynthesisUtterance(speakerText);
        utterance.rate = artifactType === 'unclear' ? 0.8 : 0.95;
        utterance.pitch = artifactType === 'garbled' ? 1.5 : 1.0;
        window.speechSynthesis.speak(utterance);
      } catch {
        // Fallback to purely synthetic acoustic profile
      }
    }

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.2, ctx.currentTime);
    masterGain.connect(ctx.destination);
    this.activeNodes.push(masterGain);

    switch (artifactType) {
      case 'garbled':
        this.createGarbledEffect(ctx, masterGain, duration);
        break;
      case 'hiss':
        this.createHissEffect(ctx, masterGain, duration);
        break;
      case 'white_noise':
        this.createWhiteNoiseEffect(ctx, masterGain, duration);
        break;
      case 'unclear':
        this.createMuffledEffect(ctx, masterGain, duration);
        break;
      case 'interference':
        this.createInterferenceEffect(ctx, masterGain, duration);
        break;
      default:
        this.createWhiteNoiseEffect(ctx, masterGain, duration);
        break;
    }

    this.stopTimeout = setTimeout(() => {
      this.stop();
    }, duration * 1000);

    return true;
  }

  // 1. Garbled: Non-linear waveshaping distortion & ring modulation
  createGarbledEffect(ctx, destination, duration) {
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, ctx.currentTime);

    // LFO modulator for trembling robotic effect
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(35, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(150, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    // Waveshaper distortion
    const distortion = ctx.createWaveShaper();
    const n = 256;
    const curve = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const x = (i * 2) / n - 1;
      curve[i] = ((Math.PI + 50) * x) / (Math.PI + 50 * Math.abs(x));
    }
    distortion.curve = curve;
    distortion.oversample = '4x';

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.12, ctx.currentTime);

    osc.connect(distortion);
    distortion.connect(gain);
    gain.connect(destination);

    osc.start();
    lfo.start();
    osc.stop(ctx.currentTime + duration);
    lfo.stop(ctx.currentTime + duration);
    this.activeNodes.push(osc, lfo, distortion, gain);
  }

  // 2. Hiss: High-pass filtered noise
  createHissEffect(ctx, destination, duration) {
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(4500, ctx.currentTime);
    highpass.Q.setValueAtTime(2.0, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, ctx.currentTime);

    noise.connect(highpass);
    highpass.connect(gain);
    gain.connect(destination);

    noise.start();
    noise.stop(ctx.currentTime + duration);
    this.activeNodes.push(noise, highpass, gain);
  }

  // 3. White Noise: Pure broadband static
  createWhiteNoiseEffect(ctx, destination, duration) {
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.15, ctx.currentTime);

    noise.connect(gain);
    gain.connect(destination);

    noise.start();
    noise.stop(ctx.currentTime + duration);
    this.activeNodes.push(noise, gain);
  }

  // 4. Muffled: Low-pass filter cutting off frequencies above 450Hz
  createMuffledEffect(ctx, destination, duration) {
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, ctx.currentTime);

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(400, ctx.currentTime);
    lowpass.Q.setValueAtTime(3.0, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.18, ctx.currentTime);

    osc.connect(lowpass);
    lowpass.connect(gain);
    gain.connect(destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
    this.activeNodes.push(osc, lowpass, gain);
  }

  // 5. Interference: 60Hz mains hum + intermittent click bursts
  createInterferenceEffect(ctx, destination, duration) {
    // 60Hz hum
    const hum = ctx.createOscillator();
    hum.type = 'sawtooth';
    hum.frequency.setValueAtTime(60, ctx.currentTime);

    const humGain = ctx.createGain();
    humGain.gain.setValueAtTime(0.12, ctx.currentTime);
    hum.connect(humGain);
    humGain.connect(destination);

    hum.start();
    hum.stop(ctx.currentTime + duration);
    this.activeNodes.push(hum, humGain);

    // Burst clicks
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      // Occasional spike click
      data[i] = Math.random() > 0.995 ? (Math.random() * 2 - 1) : 0;
    }
    const clicks = ctx.createBufferSource();
    clicks.buffer = buffer;
    clicks.connect(destination);
    clicks.start();
    clicks.stop(ctx.currentTime + duration);
    this.activeNodes.push(clicks);
  }
}

export const artifactPlayer = new AudioArtifactPlayer();
