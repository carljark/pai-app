import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { AFINIDADES_TABS, DEFAULT_TIPO_NIVEL, MAPA_TABS, cursoDeTab, NIVELES, NIVEL_IDS, findNivel, nombrePrompt } from '../data/niveles';
import { CFGM_ESTETICA_RAS_DATA } from '../data/ras_cfgm_estetica.data';
import { CFGM_PELUQUERIA_RAS_DATA } from '../data/ras_cfgm_peluqueria.data';
import { CFGS_EDUCACION_INFANTIL_RAS_DATA } from '../data/ras_cfgs_educacion_infantil.data';
import { CFGM_ATENCION_DEPENDENCIA_RAS_DATA } from '../data/ras_cfgm_atencion_dependencia.data';
import { CFGM_GUIA_MEDIO_NATURAL_RAS_DATA } from '../data/ras_cfgm_guia_medio_natural.data';
import { CFGM_CUIDADOS_AUXILIARES_ENFERMERIA_RAS_DATA } from '../data/ras_cfgm_cuidados_auxiliares_enfermeria.data';
import { describeTargetCourse } from '../controllers/project.controller';
import { selectRelevantExamples } from '../services/ai.service';
import { RA } from '../models/RA';
import { MapaModule } from '../models/MapaModule';

const MIGRATIONS_DIR = path.resolve(__dirname, '../migrations');
const migrationSources = fs.readdirSync(MIGRATIONS_DIR).filter(f => f.endsWith('.ts'))
  .map(f => fs.readFileSync(path.join(MIGRATIONS_DIR, f), 'utf-8'));
/** Valores literales de una propiedad (`tab: 'X'`, `tipoNivel: "Y"`) en las migraciones. */
const literalsOf = (prop: string): Set<string> => {
  const regex = new RegExp(`${prop}['"]?:\\s*['"]([A-Z0-9_]+)['"]`, 'g');
  return new Set(migrationSources.flatMap(src => [...src.matchAll(regex)].map(m => m[1] as string)));
};

const modulosDe = (id: string) => findNivel(id)?.cursos.flatMap(c => c.modulos ?? []) ?? [];

describe('Catálogo de niveles: datos para el frontend', () => {
  it('declara las pestañas del mapa con los ids históricos y su orden', () => {
    expect(MAPA_TABS).toEqual([
      'FPB', 'CFGM', 'CFGM_PELUQUERIA', 'CFGM_PELUQUERIA_2', 'CFGS_EDUCACION_INFANTIL', 'CFGS_EDUCACION_INFANTIL_2'
    ]);
  });

  it('conserva la selección inicial y el curso de cada mapa', () => {
    const mapas = NIVELES.flatMap(n => (n.mapas ?? []).map(m => ({ nivel: n.id, ...m })));
    expect(mapas).toEqual([
      { nivel: 'FP_BASICA', tab: 'FPB', moduleCode: '3060', raId: '3060_RA1' },
      { nivel: 'CFGM_ESTETICA', tab: 'CFGM', moduleCode: '0633', raId: '0633_RA1' },
      { nivel: 'CFGM_PELUQUERIA', tab: 'CFGM_PELUQUERIA', curso: '1º', moduleCode: '0845', raId: '0845_RA1' },
      { nivel: 'CFGM_PELUQUERIA', tab: 'CFGM_PELUQUERIA_2', curso: '2º', moduleCode: '0640', raId: '0640_RA1' },
      { nivel: 'CFGS_EDUCACION_INFANTIL', tab: 'CFGS_EDUCACION_INFANTIL', curso: '1º', moduleCode: '0011', raId: '0011_RA1' },
      { nivel: 'CFGS_EDUCACION_INFANTIL', tab: 'CFGS_EDUCACION_INFANTIL_2', curso: '2º', moduleCode: '0013', raId: '0013_RA1' },
      { nivel: 'ESO_ORDINARIA', tab: 'ESO_1', curso: '1º', formato: 'afinidades', moduleCode: 'biologia_geologia', raId: '' },
      { nivel: 'ESO_ORDINARIA', tab: 'ESO_2', curso: '2º', formato: 'afinidades', moduleCode: 'educacion_fisica', raId: '' },
      { nivel: 'ESO_ORDINARIA', tab: 'ESO_3', curso: '3º', formato: 'afinidades', moduleCode: 'biologia_geologia', raId: '' },
      { nivel: 'ESO_ORDINARIA', tab: 'ESO_4', curso: '4º', formato: 'afinidades', moduleCode: 'biologia_geologia', raId: '' }
    ]);
  });

  it('separa las pestañas de afinidades de las de módulos', () => {
    expect(AFINIDADES_TABS).toEqual(['ESO_1', 'ESO_2', 'ESO_3', 'ESO_4']);
    for (const tab of AFINIDADES_TABS) expect(MAPA_TABS).not.toContain(tab);
  });

  it('cursoDeTab devuelve el curso de la pestaña y undefined si no hay', () => {
    expect(cursoDeTab('ESO_3')).toBe('3º');
    expect(cursoDeTab('CFGM_PELUQUERIA_2')).toBe('2º');
    expect(cursoDeTab('FPB')).toBeUndefined();
    expect(cursoDeTab('DESCONOCIDA')).toBeUndefined();
  });

  it('el curso de cada mapa existe en su nivel', () => {
    for (const nivel of NIVELES) {
      for (const mapa of nivel.mapas ?? []) {
        if (mapa.curso) expect(nivel.cursos.map(c => c.curso)).toContain(mapa.curso);
      }
    }
  });

  it('los módulos de los cursos cubren exactamente los RA de cada ciclo, sin repetir', () => {
    const datasets = {
      CFGM_ESTETICA: CFGM_ESTETICA_RAS_DATA,
      CFGM_PELUQUERIA: CFGM_PELUQUERIA_RAS_DATA,
      CFGS_EDUCACION_INFANTIL: CFGS_EDUCACION_INFANTIL_RAS_DATA,
      CFGM_ATENCION_DEPENDENCIA: CFGM_ATENCION_DEPENDENCIA_RAS_DATA,
      CFGM_GUIA_MEDIO_NATURAL: CFGM_GUIA_MEDIO_NATURAL_RAS_DATA,
      CFGM_CUIDADOS_AUXILIARES_ENFERMERIA: CFGM_CUIDADOS_AUXILIARES_ENFERMERIA_RAS_DATA
    };
    for (const [id, ras] of Object.entries(datasets)) {
      const modulos = modulosDe(id);
      expect(new Set(modulos).size).toBe(modulos.length);
      expect([...modulos].sort()).toEqual([...new Set(ras.map(r => r.moduleCode))].sort());
    }
  });

  it('todos los tipoNivel y tab que cargan los datos y migraciones están en el catálogo', () => {
    const datos = [
      ...CFGM_ESTETICA_RAS_DATA, ...CFGM_PELUQUERIA_RAS_DATA, ...CFGS_EDUCACION_INFANTIL_RAS_DATA,
      ...CFGM_ATENCION_DEPENDENCIA_RAS_DATA, ...CFGM_GUIA_MEDIO_NATURAL_RAS_DATA,
      ...CFGM_CUIDADOS_AUXILIARES_ENFERMERIA_RAS_DATA
    ];
    for (const ra of datos) expect(NIVEL_IDS).toContain(ra.tipoNivel);
    for (const tipo of literalsOf('tipoNivel')) expect(NIVEL_IDS).toContain(tipo);
    const tabs = literalsOf('tab');
    expect(tabs.size).toBeGreaterThan(0);
    for (const tab of tabs) expect(MAPA_TABS).toContain(tab);
  });

  it('el nivel por defecto existe en el catálogo', () => {
    expect(findNivel(DEFAULT_TIPO_NIVEL)).toBeDefined();
  });
});

describe('Catálogo de niveles: prompt y palabras clave', () => {
  it('usa nombrePrompt y, si falta, el nombre oficial en el idioma del proyecto', () => {
    const infantil = findNivel('CFGS_EDUCACION_INFANTIL')!;
    expect(nombrePrompt(infantil, 'catalan')).toBe('CFGS Educació Infantil');
    expect(nombrePrompt(infantil)).toBe('CFGS Educación Infantil');
    expect(nombrePrompt(findNivel('ESO_ORDINARIA')!, 'catalan')).toBe('ESO (Educación Secundaria Obligatoria)');
  });

  it('un nivel desconocido se describe como el nivel por defecto', () => {
    expect(describeTargetCourse('NIVEL_INEXISTENTE', '1º')).toBe('1º de FP Básica (Formación Profesional Básica)');
  });

  it('las palabras clave del catálogo priorizan ejemplos de la familia del nivel', () => {
    const examples = [
      { title: 'Taller de cosmética capilar', modules: ['Peluquería'], text: 'x'.repeat(10) },
      { title: 'Rincón de juego simbólico', modules: ['Didáctica de la educación infantil'], text: 'x'.repeat(10) }
    ];
    const [first] = selectRelevantExamples(examples, { tipoNivel: 'CFGS_EDUCACION_INFANTIL' });
    expect(first.title).toBe('Rincón de juego simbólico');
  });
});

describe('Catálogo de niveles: validación de modelos', () => {
  it('RA acepta los niveles del catálogo y rechaza los demás', async () => {
    await expect(new RA({ id: 'x', tipoNivel: 'CFGS_EDUCACION_INFANTIL' }).validate()).resolves.toBeUndefined();
    expect(new RA({ id: 'x' }).get('tipoNivel')).toBe(DEFAULT_TIPO_NIVEL);
    await expect(new RA({ id: 'x', tipoNivel: 'CFGS_INVENTADO' }).validate()).rejects.toThrow(/tipoNivel/);
  });

  it('MapaModule acepta las pestañas del catálogo y rechaza las demás', async () => {
    const base = { order: 1, code: '0011', name_es: 'a', name_ca: 'a', type: 't', color: '#000', icon: 'i' };
    await expect(new MapaModule({ ...base, tab: 'CFGS_EDUCACION_INFANTIL_2' }).validate()).resolves.toBeUndefined();
    await expect(new MapaModule({ ...base, tab: 'CFGS_INVENTADO' }).validate()).rejects.toThrow(/tab/);
  });
});
