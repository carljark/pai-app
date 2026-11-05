import { signal } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LayoutService } from '../../../services/layout.service';
import {
  AFINIDADES_1,
  FICHA_DOS,
  FICHA_TRES,
  NIVEL_AFINIDADES,
} from '../../../testing/afinidades.mock';
import { mindmapModules } from '../../../testing/mindmap.mock';
import { NIVELES_MOCK, loadNivelesMock } from '../../../testing/niveles.mock';
import { AfinidadProyectoService } from './afinidad-proyecto.service';
import { AfinidadesEsoFacade } from './afinidades-eso.facade';
import { CestaDropService } from './cesta-drop.service';
import { CestaFacade } from './cesta.facade';
import { MapaIntermodularFacade } from './mapa-intermodular.facade';
import { MapaProyectoService } from './mapa-proyecto.service';
import { PlappSoundService } from './plapp-sound.service';

describe('CestaFacade', () => {
  const language = signal<'castellano' | 'catalan'>('castellano');
  const plapp = vi.fn();
  const crearDesdeCriterios = vi.fn().mockResolvedValue(undefined);
  const crearDesdeReferencias = vi.fn();
  let cesta: CestaFacade;
  let mapa: MapaIntermodularFacade;

  beforeEach(() => {
    sessionStorage.clear();
    language.set('castellano');
    vi.clearAllMocks();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: LayoutService, useValue: { language } },
        { provide: PlappSoundService, useValue: { plapp } },
        { provide: AfinidadProyectoService, useValue: { crearDesdeCriterios } },
        { provide: MapaProyectoService, useValue: { crearDesdeReferencias } },
      ],
    });
    loadNivelesMock([...NIVELES_MOCK, NIVEL_AFINIDADES]);
    TestBed.inject(AfinidadesEsoFacade).data.set(AFINIDADES_1);
    mapa = TestBed.inject(MapaIntermodularFacade);
    mapa.modules.set(mindmapModules());
    cesta = TestBed.inject(CestaFacade);
  });

  afterEach(() => sessionStorage.clear());

  describe('ESO', () => {
    beforeEach(() => mapa.activeTab.set('ESO_1'));

    it('una materia arrastrada entra sin criterios, suena y hace la animación', () => {
      cesta.meterUnidad('MAT');
      expect(cesta.esEso()).toBe(true);
      expect(cesta.grupos()).toEqual([{ unidad: 'MAT', claves: [], arrastrada: true }]);
      expect(cesta.totalClaves()).toBe(0);
      expect(plapp).toHaveBeenCalledTimes(1);
      expect(TestBed.inject(CestaDropService).recibidas()).toBe(1);
    });

    it('dos materias arrastradas aportan los criterios de sus fichas comunes', () => {
      cesta.meterUnidad('MAT');
      cesta.meterUnidad('TEC');
      expect(cesta.grupos()).toEqual([
        { unidad: 'MAT', claves: ['2.1'], arrastrada: true },
        { unidad: 'TEC', claves: ['3.1'], arrastrada: true },
      ]);
    });

    it('el botón de la ficha añade sus criterios exactos y lo indica', () => {
      expect(cesta.fichaEnCesta(FICHA_DOS)).toBe(false);
      cesta.anadirFicha(FICHA_DOS);
      expect(cesta.fichaEnCesta(FICHA_DOS)).toBe(true);
      expect(cesta.fichaEnCesta(FICHA_TRES)).toBe(false);
      expect(cesta.totalClaves()).toBe(3);
    });

    it('ficha y materias arrastradas se combinan sin repetir', () => {
      cesta.anadirFicha(FICHA_DOS);
      cesta.meterUnidad('TEC');
      expect(cesta.grupos().map((g) => [g.unidad, g.claves])).toEqual([
        ['TEC', ['3.1']],
        ['BYG', ['1.1']],
        ['MAT', ['2.1', '2.2']],
      ]);
    });

    it('nombra materias y criterios en el idioma activo', () => {
      expect(cesta.nombre('MAT')).toBe('Matemáticas');
      expect(cesta.etiqueta('1.1')).toBe('CE 1.1');
      language.set('catalan');
      expect(cesta.nombre('MAT')).toBe('Matemàtiques');
      expect(cesta.etiqueta('1.1')).toBe('CA 1.1');
    });

    it('quitar, vaciar y crear el proyecto con los criterios de la cesta', () => {
      cesta.anadirFicha(FICHA_DOS);
      cesta.meterUnidad('TEC');
      cesta.quitarClave('MAT', '2.2');
      cesta.quitarUnidad('BYG');
      cesta.crearProyecto();
      expect(crearDesdeCriterios).toHaveBeenCalledWith(
        [
          ['TEC', ['3.1']],
          ['MAT', ['2.1']],
        ],
        'ESO_1',
      );
      cesta.vaciar();
      expect(cesta.grupos()).toEqual([]);
    });

    it('una cesta por pestaña', () => {
      cesta.meterUnidad('MAT');
      mapa.activeTab.set('ESO_2');
      expect(cesta.grupos()).toEqual([]);
      mapa.activeTab.set('ESO_1');
      expect(cesta.grupos()).toHaveLength(1);
    });
  });

  describe('FP', () => {
    beforeEach(() => mapa.activeTab.set('FPB'));

    it('dos módulos arrastrados aportan los RA de sus conexiones', () => {
      cesta.meterUnidad('0001');
      cesta.meterUnidad('0002');
      expect(cesta.esEso()).toBe(false);
      expect(cesta.grupos().map((g) => [g.unidad, g.claves])).toEqual([
        ['0001', ['RA1', 'RA2']],
        ['0002', ['RA1', 'RA2']],
      ]);
      expect(cesta.etiqueta('RA1')).toBe('RA1');
    });

    it('nombra los módulos con su código, o solo el código si no está en el mapa', () => {
      expect(cesta.nombre('0001')).toBe('0001 · Análisis clínico');
      language.set('catalan');
      expect(cesta.nombre('0001')).toBe('0001 · Anàlisi clínica');
      expect(cesta.nombre('0009')).toBe('0009');
    });

    it('sin RA activo, los botones de conexión no añaden nada', () => {
      const conexion = mindmapModules()[0]!.learningOutcomes[0]!.connections[0]!;
      cesta.anadirConexion(conexion);
      expect(cesta.grupos()).toEqual([]);
      expect(cesta.conexionEnCesta(conexion)).toBe(false);
    });

    it('el botón de una conexión añade sus dos RA; el del RA, todas sus conexiones', () => {
      mapa.selectRa('0001_RA2');
      const conexion = mapa.selectedRa()!.connections[0]!;
      cesta.anadirConexion(conexion);
      expect(cesta.conexionEnCesta(conexion)).toBe(true);
      expect(cesta.grupos().map((g) => [g.unidad, g.claves])).toEqual([
        ['0001', ['RA2']],
        ['0002', ['RA1']],
      ]);
      mapa.selectRa('0001_RA1');
      expect(cesta.conexionEnCesta()).toBe(false);
      cesta.anadirConexion();
      expect(cesta.conexionEnCesta()).toBe(true);
      expect(cesta.grupos()[0]!.claves).toEqual(['RA1', 'RA2']);
    });

    it('crea el proyecto con los RA de la cesta', () => {
      cesta.meterUnidad('0001');
      cesta.meterUnidad('0002');
      cesta.crearProyecto();
      const refs = crearDesdeReferencias.mock.calls[0]![0] as { raCode: string }[];
      expect(refs.map((r) => r.raCode)).toEqual(['RA1', 'RA2', 'RA1']);
    });
  });
});
