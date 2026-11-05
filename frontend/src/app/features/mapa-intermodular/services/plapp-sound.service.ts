import { Injectable } from '@angular/core';

type AudioContextCtor = new () => AudioContext;

/** Constructor de Web Audio del navegador, o `null` si no lo hay (jsdom, navegadores antiguos). */
function audioContextCtor(): AudioContextCtor | null {
  const g = globalThis as {
    AudioContext?: AudioContextCtor;
    webkitAudioContext?: AudioContextCtor;
  };
  return g.AudioContext ?? g.webkitAudioContext ?? null;
}

/**
 * Sonido «PLAPP» al meter una bola en la cesta, sintetizado con Web Audio (sin archivos):
 * un chasquido corto («PL»), un tono grave que cae de 170 a 55 Hz («A») y un cierre seco («PP»).
 */
@Injectable({ providedIn: 'root' })
export class PlappSoundService {
  private ctx: AudioContext | null = null;

  plapp(): void {
    try {
      const ctx = this.contexto();
      if (!ctx) return;
      const t = ctx.currentTime;
      this.chasquido(ctx, t, 0.035, 0.5);
      this.tono(ctx, t);
      this.chasquido(ctx, t + 0.17, 0.02, 0.25);
    } catch (err) {
      console.warn('No se ha podido reproducir el sonido de la cesta', err);
    }
  }

  private contexto(): AudioContext | null {
    if (!this.ctx) {
      const Ctor = audioContextCtor();
      if (!Ctor) return null;
      this.ctx = new Ctor();
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    return this.ctx;
  }

  /** Tono grave con caída de frecuencia y envolvente percusiva. */
  private tono(ctx: AudioContext, t: number): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(170, t);
    osc.frequency.exponentialRampToValueAtTime(55, t + 0.2);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.7, t + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.24);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.26);
  }

  /** Ráfaga de ruido filtrado muy corta, como una consonante oclusiva. */
  private chasquido(ctx: AudioContext, t: number, duracion: number, volumen: number): void {
    const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * duracion), ctx.sampleRate);
    const datos = buffer.getChannelData(0);
    for (let i = 0; i < datos.length; i++)
      datos[i] = (Math.random() * 2 - 1) * (1 - i / datos.length);
    const fuente = ctx.createBufferSource();
    const filtro = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    fuente.buffer = buffer;
    filtro.type = 'lowpass';
    filtro.frequency.value = 1200;
    gain.gain.value = volumen;
    fuente.connect(filtro).connect(gain).connect(ctx.destination);
    fuente.start(t);
  }
}
