import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PlappSoundService } from './plapp-sound.service';

/** Web Audio de mentira: registra qué nodos se crean y se ponen en marcha. */
class FakeAudioContext {
  static instancias: FakeAudioContext[] = [];
  state = 'suspended';
  currentTime = 1;
  sampleRate = 1000;
  destination = {};
  resume = vi.fn(() => Promise.resolve());
  started: string[] = [];

  constructor() {
    FakeAudioContext.instancias.push(this);
  }

  private nodo(tipo: string) {
    const param = () => ({
      value: 0,
      setValueAtTime: vi.fn(),
      exponentialRampToValueAtTime: vi.fn(),
    });
    const n = {
      type: '',
      buffer: null as unknown,
      frequency: param(),
      gain: param(),
      connect: (destino: unknown) => destino,
      start: () => this.started.push(tipo),
      stop: vi.fn(),
    };
    return n;
  }

  createOscillator = () => this.nodo('oscillator');
  createGain = () => this.nodo('gain');
  createBiquadFilter = () => this.nodo('filter');
  createBufferSource = () => this.nodo('noise');
  createBuffer = (_canales: number, longitud: number) => {
    const datos = new Float32Array(longitud);
    return { getChannelData: () => datos };
  };
}

describe('PlappSoundService', () => {
  const g = globalThis as { AudioContext?: unknown; webkitAudioContext?: unknown };
  const original = g.AudioContext;

  beforeEach(() => {
    FakeAudioContext.instancias = [];
    TestBed.resetTestingModule();
  });

  afterEach(() => {
    g.AudioContext = original;
    delete g.webkitAudioContext;
    vi.restoreAllMocks();
  });

  it('sin Web Audio no hace nada ni lanza errores', () => {
    g.AudioContext = undefined;
    expect(() => TestBed.inject(PlappSoundService).plapp()).not.toThrow();
  });

  it('suena el chasquido, el tono grave y el cierre, reutilizando el contexto', () => {
    g.AudioContext = FakeAudioContext;
    const sonido = TestBed.inject(PlappSoundService);
    sonido.plapp();
    sonido.plapp();
    expect(FakeAudioContext.instancias).toHaveLength(1);
    const ctx = FakeAudioContext.instancias[0]!;
    expect(ctx.resume).toHaveBeenCalled();
    expect(ctx.started.slice(0, 3)).toEqual(['noise', 'oscillator', 'noise']);
  });

  it('usa el prefijo webkit en navegadores antiguos', () => {
    g.AudioContext = undefined;
    g.webkitAudioContext = FakeAudioContext;
    TestBed.inject(PlappSoundService).plapp();
    expect(FakeAudioContext.instancias).toHaveLength(1);
  });

  it('si el navegador falla al reproducir, solo avisa por consola', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    g.AudioContext = class {
      constructor() {
        throw new Error('NotAllowedError');
      }
    };
    TestBed.inject(PlappSoundService).plapp();
    expect(warn).toHaveBeenCalled();
  });
});
