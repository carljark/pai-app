import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AfinidadProyectoService } from './afinidad-proyecto.service';
import { CurriculumFacade } from '../../curriculum/services/curriculum.facade';
import { CriteriosFacade } from '../../curriculum/services/criterios.facade';
import { LayoutService } from '../../../services/layout.service';
import { loadNivelesMock } from '../../../testing/niveles.mock';
import { FICHA_DOS, NIVEL_AFINIDADES } from '../../../testing/afinidades.mock';

const CES = [
  {
    subjectCode: 'BYG',
    ce_num: 1,
    value: 'Biología · CE1. X',
    criteriosDetalle: [{ id: '1.1', text: 'a' }],
  },
  {
    subjectCode: 'MAT',
    ce_num: 2,
    value: 'Mates · CE2. Y',
    criteriosDetalle: [
      { id: '2.1', text: 'a' },
      { id: '2.2', text: 'b' },
      { id: '2.3', text: 'c' },
    ],
  },
];

describe('AfinidadProyectoService', () => {
  let service: AfinidadProyectoService;
  let curriculum: CurriculumFacade;
  let criterios: CriteriosFacade;
  let http: HttpTestingController;
  let layout: { language: ReturnType<typeof signal<string>>; switchView: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    localStorage.clear();
    layout = { language: signal('catalan'), switchView: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: LayoutService, useValue: layout },
      ],
    });
    loadNivelesMock([NIVEL_AFINIDADES]);
    service = TestBed.inject(AfinidadProyectoService);
    curriculum = TestBed.inject(CurriculumFacade);
    criterios = TestBed.inject(CriteriosFacade);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  const respond = (body: object, curso: string) =>
    http
      .expectOne(`/api/ces?lang=catalan&tipoNivel=ESO_ORDINARIA&curso=${encodeURIComponent(curso)}`)
      .flush(body);

  it('fija nivel y curso, selecciona las CE de la ficha y abre el generador', async () => {
    curriculum.selectedRas.set(['previa']);
    const done = service.crearProyecto(FICHA_DOS, 'MAT', 'ESO_2');
    expect(curriculum.tipoNivel()).toBe('ESO_ORDINARIA');
    expect(curriculum.curso()).toBe('2º');
    respond(CES, '2º');
    await done;

    expect(curriculum.esoCes()).toEqual(CES);
    expect(curriculum.selectedRas()).toEqual(['Mates · CE2. Y', 'Biología · CE1. X']);
    expect(criterios.payload()).toEqual([{ ce: 'Mates · CE2. Y', ids: ['2.1', '2.2'] }]);
    expect(layout.switchView).toHaveBeenCalledWith('generator');
  });

  it('abre el generador aunque fallen las CE y sin pestaña conocida', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const done = service.crearProyecto(FICHA_DOS, 'MAT', 'DESCONOCIDA');
    http
      .expectOne((r) => r.url.startsWith('/api/ces?'))
      .flush('x', { status: 500, statusText: 'Error' });
    await done;

    expect(error).toHaveBeenCalled();
    expect(curriculum.selectedRas()).toEqual([]);
    expect(layout.switchView).toHaveBeenCalledWith('generator');
    error.mockRestore();
  });

  it('mantiene el curso por defecto si la pestaña no fija curso', async () => {
    loadNivelesMock([
      { ...NIVEL_AFINIDADES, mapas: [{ tab: 'SIN_CURSO', moduleCode: 'MAT', raId: '' }] },
    ]);
    const done = service.crearProyecto(FICHA_DOS, 'MAT', 'SIN_CURSO');
    expect(curriculum.tipoNivel()).toBe('ESO_ORDINARIA');
    respond([], curriculum.curso());
    await done;
    expect(curriculum.selectedRas()).toEqual([]);
  });
});
