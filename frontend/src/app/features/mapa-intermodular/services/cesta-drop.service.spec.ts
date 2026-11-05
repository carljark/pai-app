import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { CestaDropService } from './cesta-drop.service';

function zona(left: number, top: number, width: number, height: number): HTMLElement {
  const el = document.createElement('button');
  el.getBoundingClientRect = () =>
    ({ left, top, width, height, right: left + width, bottom: top + height }) as DOMRect;
  return el;
}

describe('CestaDropService', () => {
  let drop: CestaDropService;

  beforeEach(() => {
    TestBed.resetTestingModule();
    drop = TestBed.inject(CestaDropService);
  });

  it('sin zona registrada, nada cae dentro', () => {
    expect(drop.contains(10, 10)).toBe(false);
  });

  it('comprueba si el punto cae dentro de la cesta', () => {
    drop.registrar(zona(100, 100, 50, 40));
    expect(drop.contains(120, 120)).toBe(true);
    expect(drop.contains(99, 120)).toBe(false);
    expect(drop.contains(120, 141)).toBe(false);
  });

  it('una zona sin tamaño (oculta) no recibe nada', () => {
    drop.registrar(zona(0, 0, 0, 0));
    expect(drop.contains(0, 0)).toBe(false);
  });

  it('sigue la bola arrastrada y si está sobre la cesta', () => {
    drop.registrar(zona(100, 100, 50, 40));
    drop.track({ x: 10, y: 10, color: '#000', badge: 'MAT' });
    expect(drop.ghost()?.badge).toBe('MAT');
    expect(drop.over()).toBe(false);
    drop.track({ x: 120, y: 120, color: '#000', badge: 'MAT' });
    expect(drop.over()).toBe(true);
    drop.track(null);
    expect(drop.ghost()).toBeNull();
    expect(drop.over()).toBe(false);
  });

  it('solo libera la zona que tiene registrada y cuenta las bolas recibidas', () => {
    const a = zona(0, 0, 10, 10);
    drop.registrar(a);
    drop.liberar(zona(0, 0, 10, 10));
    expect(drop.contains(5, 5)).toBe(true);
    drop.liberar(a);
    expect(drop.contains(5, 5)).toBe(false);
    drop.recibir();
    drop.recibir();
    expect(drop.recibidas()).toBe(2);
  });
});
