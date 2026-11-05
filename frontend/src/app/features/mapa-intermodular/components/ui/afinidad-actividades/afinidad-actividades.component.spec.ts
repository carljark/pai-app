import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';
import { AfinidadActividadesComponent } from './afinidad-actividades.component';
import { AfinidadesEsoFacade } from '../../../services/afinidades-eso.facade';
import { AfinidadesEsoService } from '../../../services/afinidades-eso.service';
import { LayoutService } from '../../../../../services/layout.service';
import { AFINIDADES_1, ACTIVIDAD_BYG_MAT, FICHA_DOS } from '../../../../../testing/afinidades.mock';

describe('AfinidadActividadesComponent', () => {
  let fixture: ComponentFixture<AfinidadActividadesComponent>;
  let layout: { language: ReturnType<typeof signal<'castellano' | 'catalan'>> };
  let el: HTMLElement;

  const text = (sel: string) => el.querySelector(sel)?.textContent?.replace(/\s+/g, ' ').trim();
  const all = (sel: string) =>
    Array.from(el.querySelectorAll(sel)).map((e) => e.textContent?.replace(/\s+/g, ' ').trim());

  const render = (materias: string[]) => {
    fixture.componentRef.setInput('actividades', [ACTIVIDAD_BYG_MAT]);
    fixture.componentRef.setInput('materias', materias);
    fixture.componentRef.setInput('vinculos', FICHA_DOS.vinculos);
    fixture.detectChanges();
  };

  beforeEach(() => {
    layout = { language: signal<'castellano' | 'catalan'>('castellano') };
    TestBed.configureTestingModule({
      imports: [AfinidadActividadesComponent],
      providers: [
        { provide: LayoutService, useValue: layout },
        { provide: AfinidadesEsoService, useValue: { getAfinidades: () => null } },
      ],
    });
    TestBed.inject(AfinidadesEsoFacade).data.set(AFINIDADES_1);
    fixture = TestBed.createComponent(AfinidadActividadesComponent);
    el = fixture.nativeElement;
  });

  it('muestra en castellano el título, los campos y los criterios con la sigla CE', () => {
    render(['BYG', 'MAT']);
    expect(text('.afinidad-actividades__titulo')).toBe('Actividades conjuntas');
    expect(text('.afinidad-actividades__nombre')).toBe('Muestreo del patio');
    expect(text('.afinidad-actividades__idea')).toBe('Idea motivadora: ¿Cuántas plantas hay?');
    expect(text('.afinidad-actividades__desarrollo')).toBe(
      'Desarrollo: Se cuentan y se representan.',
    );
    expect(all('.afinidad-actividades__caja')).toEqual([
      'Producto / Evidencia: Informe',
      'Atención a la diversidad: Plantilla guiada',
    ]);
    expect(all('.afinidad-actividades__materia')).toEqual([
      'Biología y Geología: CE 1.1',
      'Matemáticas: CE 2.1',
    ]);
  });

  it('pone el texto oficial del criterio como título y lo omite si no lo hay', () => {
    render(['BYG', 'MAT']);
    const [byg, mat] = Array.from(el.querySelectorAll('.afinidad-actividades__criterio'));
    expect(byg?.getAttribute('title')).toBe('Texto oficial BYG');
    expect(mat?.hasAttribute('title')).toBe(false);
  });

  it('cambia al catalán de forma reactiva, con la sigla CA', () => {
    render(['MAT', 'BYG']);
    layout.language.set('catalan');
    fixture.detectChanges();
    expect(text('.afinidad-actividades__titulo')).toBe('Activitats conjuntes');
    expect(text('.afinidad-actividades__nombre')).toBe('Mostreig del pati');
    expect(text('.afinidad-actividades__desarrollo')).toBe(
      'Desenvolupament: Es compten i es representen.',
    );
    expect(all('.afinidad-actividades__caja')).toEqual([
      'Producte / Evidència: Informe final',
      'Atenció a la diversitat: Plantilla guiada amb suports',
    ]);
    expect(all('.afinidad-actividades__materia')).toEqual([
      'Matemàtiques: CA 2.1',
      'Biologia i Geologia: CA 1.1',
    ]);
    const byg = el.querySelectorAll('.afinidad-actividades__criterio')[1];
    expect(byg?.getAttribute('title')).toBe('Text oficial BYG');
  });

  it('solo lista las materias de la ficha que cita la actividad', () => {
    render(['TEC', 'MAT']);
    expect(all('.afinidad-actividades__materia')).toEqual(['Matemáticas: CE 2.1']);
  });

  it('sin vínculos con textos no pone título a los criterios', () => {
    fixture.componentRef.setInput('actividades', [ACTIVIDAD_BYG_MAT]);
    fixture.componentRef.setInput('materias', ['BYG']);
    fixture.componentRef.setInput('vinculos', [
      { ...FICHA_DOS.vinculos[0], criteriosTexto: undefined },
    ]);
    fixture.detectChanges();
    expect(el.querySelector('.afinidad-actividades__criterio')?.hasAttribute('title')).toBe(false);
  });
});
