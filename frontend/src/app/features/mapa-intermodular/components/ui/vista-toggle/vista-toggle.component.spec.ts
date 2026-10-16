import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { LayoutService } from '../../../../../services/layout.service';
import { MapaVistaService } from '../../../services/mapa-vista.service';
import { VistaToggleComponent } from './vista-toggle.component';

describe('VistaToggleComponent', () => {
  const language = signal<'castellano' | 'catalan'>('castellano');

  beforeEach(async () => {
    localStorage.removeItem('pai_mapa_vista');
    language.set('castellano');
    await TestBed.configureTestingModule({
      imports: [VistaToggleComponent],
      providers: [{ provide: LayoutService, useValue: { language } }],
    }).compileComponents();
  });

  function render() {
    const fixture = TestBed.createComponent(VistaToggleComponent);
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll(
      '.vista-toggle__option',
    ) as NodeListOf<HTMLButtonElement>;
    return { fixture, buttons };
  }

  it('ofrece la vista clásica (activa) y el mapa mental con la insignia beta', () => {
    const { buttons } = render();
    expect(buttons[0]!.textContent).toContain('Vista clásica');
    expect(buttons[0]!.getAttribute('aria-pressed')).toBe('true');
    expect(buttons[1]!.textContent).toContain('Mapa mental');
    expect(buttons[1]!.querySelector('.vista-toggle__badge')?.textContent).toContain('beta');
  });

  it('cambia de vista al pulsar', async () => {
    const { fixture, buttons } = render();
    buttons[1]!.click();
    await fixture.whenStable();
    expect(TestBed.inject(MapaVistaService).vista()).toBe('mental');
    expect(buttons[1]!.classList).toContain('vista-toggle__option--active');
    buttons[0]!.click();
    expect(TestBed.inject(MapaVistaService).vista()).toBe('clasica');
  });

  it('se traduce al catalán', () => {
    language.set('catalan');
    const { buttons } = render();
    expect(buttons[0]!.textContent).toContain('Vista clàssica');
  });
});
