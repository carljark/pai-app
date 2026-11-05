import { signal } from '@angular/core';
import { TestBed, type ComponentFixture } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LayoutService } from '../../../../../services/layout.service';
import { CestaBotonComponent } from './cesta-boton.component';

describe('CestaBotonComponent', () => {
  const language = signal<'castellano' | 'catalan'>('castellano');
  let fixture: ComponentFixture<CestaBotonComponent>;
  let button: () => HTMLButtonElement;

  beforeEach(() => {
    language.set('castellano');
    TestBed.configureTestingModule({
      imports: [CestaBotonComponent],
      providers: [{ provide: LayoutService, useValue: { language } }],
    });
    fixture = TestBed.createComponent(CestaBotonComponent);
    fixture.componentRef.setInput('enCesta', false);
    fixture.detectChanges();
    button = () => fixture.nativeElement.querySelector('button');
  });

  it('muestra «Añadir a la cesta» en los dos idiomas y avisa al pulsarlo', () => {
    const anadir = vi.fn();
    fixture.componentInstance.anadir.subscribe(anadir);
    expect(button().textContent?.trim()).toBe('Añadir a la cesta');
    expect(button().className).toBe('btn-secondary cesta-boton');
    button().click();
    expect(anadir).toHaveBeenCalledTimes(1);
    language.set('catalan');
    fixture.detectChanges();
    expect(button().textContent?.trim()).toBe('Afegeix a la cistella');
  });

  it('cuando ya está en la cesta lo indica y se desactiva', () => {
    fixture.componentRef.setInput('enCesta', true);
    fixture.detectChanges();
    expect(button().textContent?.trim()).toBe('En la cesta ✓');
    expect(button().disabled).toBe(true);
    language.set('catalan');
    fixture.detectChanges();
    expect(button().textContent?.trim()).toBe('A la cistella ✓');
  });

  it('adopta el aspecto de los botones del mapa de FP', () => {
    fixture.componentRef.setInput('aspecto', 'mapa-sm');
    fixture.detectChanges();
    expect(button().classList).toContain('mapa-btn-action--sm');
  });
});
