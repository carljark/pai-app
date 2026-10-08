import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';
import { AfinidadCardComponent } from './afinidad-card.component';
import { AfinidadesEsoFacade } from '../../../services/afinidades-eso.facade';
import { AfinidadesEsoService } from '../../../services/afinidades-eso.service';
import { LayoutService } from '../../../../../services/layout.service';
import { AfinidadEso } from '../../../models/afinidad-eso.model';
import { AFINIDADES_1, FICHA_DOS, FICHA_TRES } from '../../../../../testing/afinidades.mock';

describe('AfinidadCardComponent', () => {
  let fixture: ComponentFixture<AfinidadCardComponent>;
  let layout: { language: ReturnType<typeof signal<'castellano' | 'catalan'>> };
  let el: HTMLElement;

  const render = (afinidad: AfinidadEso, materia: string) => {
    fixture.componentRef.setInput('afinidad', afinidad);
    fixture.componentRef.setInput('materia', materia);
    fixture.detectChanges();
  };
  const text = (sel: string) => el.querySelector(sel)?.textContent?.replace(/\s+/g, ' ').trim();
  const materiasOrden = () =>
    Array.from(el.querySelectorAll('.afinidad-card__materia')).map((e) => e.textContent?.trim());

  beforeEach(() => {
    layout = { language: signal<'castellano' | 'catalan'>('castellano') };
    TestBed.configureTestingModule({
      imports: [AfinidadCardComponent],
      providers: [
        { provide: LayoutService, useValue: layout },
        {
          provide: AfinidadesEsoService,
          useValue: {
            getAfinidades: () => {
              throw new Error('HTTP');
            },
          },
        },
      ],
    });
    TestBed.inject(AfinidadesEsoFacade).data.set(AFINIDADES_1);
    fixture = TestBed.createComponent(AfinidadCardComponent);
    el = fixture.nativeElement;
  });

  it('renderiza una ficha de dos materias con la consultada primero', () => {
    render(FICHA_DOS, 'MAT');
    expect(materiasOrden()).toEqual(['Matemáticas', 'Biología y Geología']);
    expect(el.querySelectorAll('.afinidad-card__th').length).toBe(3);
    expect(text('.afinidad-card__curso')).toBe('1º ESO');
    expect(text('.afinidad-card__origen')).toBe('Documento del centro');
    expect(text('.afinidad-card__td--relacion')).toBe('Relación científica');
    expect(text('.afinidad-card__subtitulo')).toBe('Saberes básicos movilizados');
    expect(text('.afinidad-card__saber')).toContain('Matemáticas: .');
    expect(el.querySelectorAll('.afinidad-card__concepto').length).toBe(2);
  });

  it('renderiza una ficha de tres materias y respeta el orden', () => {
    render(FICHA_TRES, 'TEC');
    expect(materiasOrden()).toEqual(['Tecnología', 'Biología y Geología', 'Matemáticas']);
    expect(el.querySelectorAll('.afinidad-card__th').length).toBe(4);
    expect(text('.afinidad-card__origen')).toBe('Ampliación');
    expect(el.querySelector('.afinidad-card__origen--ampliacion')).toBeTruthy();
  });

  it('si la materia no está en la ficha, no la antepone', () => {
    render(FICHA_DOS, 'EF');
    expect(materiasOrden()).toEqual(['Biología y Geología', 'Matemáticas']);
  });

  it('usa el ámbito de la fuente de la materia consultada', () => {
    render(FICHA_TRES, 'MAT');
    expect(text('.afinidad-card__ambito')).toContain('Ámbito desde MAT');
    expect(text('.afinidad-card__opcion')).toBe('Opción 1');
    fixture.componentRef.setInput('materia', 'TEC');
    fixture.detectChanges();
    expect(text('.afinidad-card__ambito')).toContain('Ámbito desde TEC');
    expect(el.querySelector('.afinidad-card__opcion')).toBeNull();
  });

  it('usa el ámbito de la ficha si la materia no tiene fuente', () => {
    render(FICHA_TRES, 'BYG');
    expect(text('.afinidad-card__ambito')).toContain('Ámbito de la ficha');
    layout.language.set('catalan');
    fixture.detectChanges();
    expect(text('.afinidad-card__ambito')).toContain('Àmbit de la fitxa');
  });

  it('muestra los textos en catalán', () => {
    layout.language.set('catalan');
    render(FICHA_DOS, 'BYG');
    expect(text('.afinidad-card__ambito')).toContain('Àmbit proposat: Àmbit de BYG');
    expect(text('.afinidad-card__opcion')).toBe('Opció 2');
    expect(text('.afinidad-card__origen')).toBe('Document del centre');
    expect(materiasOrden()).toEqual(['Biologia i Geologia', 'Matemàtiques']);
    expect(text('.afinidad-card__td--relacion')).toBe('Relació científica');
    expect(text('.afinidad-card__resumen')).toBe('Resum BYG');
    expect(text('.afinidad-card__saber')).toContain('Biologia i Geologia: Saber CA A; Saber CA B.');
    expect(text('.afinidad-card__subtitulo')).toBe('Sabers bàsics mobilitzats');
    expect(text('.afinidad-card__concepto')).toBe('Energia');
    expect(el.querySelector('.afinidad-card__origen')?.getAttribute('title')).toContain('document');
  });

  it('muestra el texto oficial del criterio al hacer clic en el summary', () => {
    render(FICHA_DOS, 'BYG');
    const details = el.querySelector('details') as HTMLDetailsElement;
    const summary = details.querySelector('summary') as HTMLElement;
    expect(summary.textContent?.trim()).toBe('CE 1.1');
    expect(text('.afinidad-card__criterio-texto')).toBe('Texto oficial BYG');
    summary.click();
    fixture.detectChanges();
    expect(details.open).toBe(true);
    layout.language.set('catalan');
    fixture.detectChanges();
    expect(text('.afinidad-card__criterio-texto')).toBe('Text oficial BYG');
  });

  it('sin criteriosTexto usa los ids con texto vacío', () => {
    render(FICHA_DOS, 'MAT');
    const ids = Array.from(el.querySelectorAll('summary')).map((s) => s.textContent?.trim());
    expect(ids).toEqual(['CE 2.1', 'CE 2.2', 'CE 1.1']);
    const textos = Array.from(el.querySelectorAll('.afinidad-card__criterio-texto')).map((p) =>
      p.textContent?.trim(),
    );
    expect(textos).toEqual(['', '', 'Texto oficial BYG']);
  });

  it('sin criterios ni resumen de una materia no rompe la ficha', () => {
    const sinNada: AfinidadEso = {
      ...FICHA_DOS,
      vinculos: [{ ...FICHA_DOS.vinculos[0]!, criterios: {}, criteriosTexto: undefined as any }],
    };
    render(sinNada, 'BYG');
    expect(el.querySelectorAll('details').length).toBe(0);
    const sinResumen: AfinidadEso = {
      ...FICHA_DOS,
      vinculos: [{ ...FICHA_DOS.vinculos[0]!, resumen_es: {} }],
    };
    render(sinResumen, 'BYG');
    expect(text('.afinidad-card__resumen')).toBe('');
  });

  it('una materia sin saberes muestra su línea vacía', () => {
    render(FICHA_DOS, 'MAT');
    const sabers = Array.from(el.querySelectorAll('.afinidad-card__saber')).map((p) =>
      p.textContent?.replace(/\s+/g, ' ').trim(),
    );
    expect(sabers).toEqual(['Matemáticas: .', 'Biología y Geología: Saber A; Saber B.']);
  });
});
