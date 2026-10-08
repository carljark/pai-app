import { TestBed } from '@angular/core/testing';
import { Subject, of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AfinidadesEsoFacade } from './afinidades-eso.facade';
import { AfinidadesEsoService } from './afinidades-eso.service';
import { AfinidadesCurso } from '../models/afinidad-eso.model';
import { AFINIDADES_1, AFINIDADES_2 } from '../../../testing/afinidades.mock';

describe('AfinidadesEsoFacade', () => {
  let facade: AfinidadesEsoFacade;
  let getAfinidades: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    getAfinidades = vi.fn((tab: string) => of(tab === 'ESO_2' ? AFINIDADES_2 : AFINIDADES_1));
    TestBed.configureTestingModule({
      providers: [{ provide: AfinidadesEsoService, useValue: { getAfinidades } }],
    });
    facade = TestBed.inject(AfinidadesEsoFacade);
  });

  it('carga el curso y selecciona la materia inicial', async () => {
    await facade.load('ESO_1', 'MAT');
    expect(facade.data()).toEqual(AFINIDADES_1);
    expect(facade.selectedMateria()).toBe('MAT');
    expect(facade.materias().length).toBe(4);
    expect(facade.totalFichas()).toBe(2);
    expect(facade.isLoading()).toBe(false);
    expect(facade.hasError()).toBe(false);
  });

  it('usa la primera materia si la inicial no existe', async () => {
    await facade.load('ESO_1', 'NOEXISTE');
    expect(facade.selectedMateria()).toBe('BYG');
  });

  it('deja la selección vacía si el curso no tiene materias', async () => {
    getAfinidades.mockReturnValue(of({ curso: '1º', materias: [], afinidades: [] }));
    await facade.load('ESO_X', 'MAT');
    expect(facade.selectedMateria()).toBe('');
    expect(facade.fichas()).toEqual([]);
    expect(facade.totalFichas()).toBe(0);
  });

  it('reutiliza la caché sin nueva petición y reaplica la materia inicial', async () => {
    await facade.load('ESO_1', 'MAT');
    await facade.load('ESO_1', 'TEC');
    expect(getAfinidades).toHaveBeenCalledTimes(1);
    expect(facade.selectedMateria()).toBe('TEC');
  });

  it('marca el error y lo registra en consola', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    getAfinidades.mockReturnValue(throwError(() => new Error('fallo')));
    await facade.load('ESO_1', 'MAT');
    expect(facade.hasError()).toBe(true);
    expect(facade.isLoading()).toBe(false);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('limpia el error en una carga posterior correcta', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    getAfinidades.mockReturnValueOnce(throwError(() => new Error('fallo')));
    await facade.load('ESO_1', 'MAT');
    await facade.load('ESO_1', 'MAT');
    expect(facade.hasError()).toBe(false);
    expect(facade.data()).toEqual(AFINIDADES_1);
    spy.mockRestore();
  });

  it('una respuesta tardía de una pestaña anterior no pisa la actual', async () => {
    const lenta = new Subject<AfinidadesCurso>();
    getAfinidades.mockImplementation((tab: string) => (tab === 'ESO_1' ? lenta : of(AFINIDADES_2)));
    const primera = facade.load('ESO_1', 'MAT');
    await facade.load('ESO_2', 'FYQ');
    expect(facade.data()).toEqual(AFINIDADES_2);

    lenta.next(AFINIDADES_1);
    lenta.complete();
    await primera;

    expect(facade.data()).toEqual(AFINIDADES_2);
    expect(facade.selectedMateria()).toBe('FYQ');
  });

  it('filtra las fichas por la materia seleccionada', async () => {
    await facade.load('ESO_1', 'BYG');
    expect(facade.fichas().map((f) => f.id)).toEqual(['f2', 'f3']);
    facade.selectMateria('TEC');
    expect(facade.fichas().map((f) => f.id)).toEqual(['f3']);
    facade.selectMateria('EF');
    expect(facade.fichas()).toEqual([]);
  });

  it('devuelve el nombre de la materia en ES/CA o su código si es desconocida', async () => {
    await facade.load('ESO_1', 'BYG');
    expect(facade.materiaName('MAT', false)).toBe('Matemáticas');
    expect(facade.materiaName('MAT', true)).toBe('Matemàtiques');
    expect(facade.materiaName('XYZ', true)).toBe('XYZ');
  });

  it('sin datos cargados los computed devuelven valores vacíos', () => {
    expect(facade.materias()).toEqual([]);
    expect(facade.fichas()).toEqual([]);
    expect(facade.totalFichas()).toBe(0);
    expect(facade.materiaName('MAT', false)).toBe('MAT');
  });
});
