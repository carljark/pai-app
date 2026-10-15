import type { Response } from 'express';
import { RA } from '../models/RA';
import { CE } from '../models/CE';
import { Project } from '../models/Project';
import { DEFAULT_TIPO_NIVEL } from '../data/niveles';
import { ESO_ORDINARIA, esoSelection } from '../services/eso-curriculum.service';
import { mapCe, mapRa } from './curriculum.controller';

/** CE sin `tipoNivel`: las antiguas del Programa de Diversificación Curricular. */
const PDC = 'DIVERSIFICACION_CURRICULAR';

/** Módulo (FP) o materia (ESO) con sus nombres en ambos idiomas y los textos con que se guarda. */
export interface FilterModule {
  key: string;
  tipoNivel: string;
  es: string;
  ca: string;
  aliases: string[];
}

/** RA o CE con sus textos en ambos idiomas, su módulo y su orden dentro de él. */
export interface FilterItem extends FilterModule {
  moduleKey: string;
  order: number;
}

export interface FilterIndex {
  modules: FilterModule[];
  items: FilterItem[];
}

const unique = (values: (string | null | undefined)[]): string[] =>
  Array.from(new Set(values.filter((v): v is string => !!v)));

/**
 * Texto comparable (igual que en el historial del frontend): sin tildes, mayúsculas, puntuación ni
 * la numeración inicial («1. ») con la que los proyectos antiguos de FP Básica guardaban los RA.
 */
export const normalizeText = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/^\s*(ra\s*)?\d+\s*[.)-]\s*/, '')
    .replace(/[.,;:()«»"'’·-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const normalizedSet = (values: unknown[]): Set<string> =>
  new Set(values.filter((v): v is string => typeof v === 'string').map(normalizeText));

const numberIn = (value?: string | null): number => Number(/\d+/.exec(value || '')?.[0] ?? 0);

/** Entrada de un RA: los proyectos guardan el nombre del módulo y la descripción en su idioma. */
const raEntry = (r: any): { module: FilterModule; item: FilterItem } => {
  const tipoNivel = r.tipoNivel || DEFAULT_TIPO_NIVEL;
  const es = mapRa(r, 'es');
  const ca = mapRa(r, 'ca');
  const moduleKey = `${tipoNivel}|${r.moduleCode || es.module}`;
  const code = (r.id || '').split('_').pop() || '';
  return {
    module: { key: moduleKey, tipoNivel, es: es.module, ca: ca.module, aliases: unique([es.module, ca.module, r.module]) },
    item: {
      key: `${moduleKey}|${r.id}`, tipoNivel, moduleKey, order: numberIn(code),
      es: `${code}. ${es.description}`, ca: `${code}. ${ca.description}`,
      aliases: unique([es.description, ca.description, r.description]),
    },
  };
};

/** Entrada de una CE de la ESO ordinaria: se guarda como «Materia · CEn. Descripción». */
const esoEntry = (c: any): { module: FilterModule; item: FilterItem } => {
  const moduleKey = `${ESO_ORDINARIA}|${c.subjectCode || c.subject_es}`;
  const ce = `CE${c.ce_num}`;
  return {
    module: { key: moduleKey, tipoNivel: ESO_ORDINARIA, es: c.subject_es, ca: c.subject_ca, aliases: unique([c.subject_es, c.subject_ca]) },
    item: {
      key: `${moduleKey}|${ce}`, tipoNivel: ESO_ORDINARIA, moduleKey, order: c.ce_num || 0,
      es: `${ce}. ${c.description_es}`, ca: `${ce}. ${c.description_ca}`,
      aliases: unique([esoSelection(c.subject_es, c.ce_num, c.description_es), esoSelection(c.subject_ca, c.ce_num, c.description_ca)]),
    },
  };
};

/** Entrada de una CE del PDC: se guarda con la materia y la descripción en su idioma. */
const pdcEntry = (c: any): { module: FilterModule; item: FilterItem } => {
  const tipoNivel = c.tipoNivel || PDC;
  const es = mapCe(c, 'es', '3º');
  const ca = mapCe(c, 'ca', '3º');
  const moduleKey = `${tipoNivel}|${es.subject}`;
  const desc = (lang: typeof es) => (c.ce_id ? `${c.ce_id}. ${lang.description}` : lang.description);
  return {
    module: { key: moduleKey, tipoNivel, es: es.subject, ca: ca.subject, aliases: unique([es.subject, ca.subject, c.subject]) },
    item: {
      key: `${moduleKey}|${c.ce_id || c._id}`, tipoNivel, moduleKey, order: numberIn(c.ce_id),
      es: desc(es), ca: desc(ca), aliases: unique([es.description, ca.description, c.get?.('description'), c.ce_id]),
    },
  };
};

const ceEntry = (c: any) => (c.tipoNivel === ESO_ORDINARIA ? esoEntry(c) : pdcEntry(c));

/** Alias que no son ya, una vez normalizados, la etiqueta en castellano o en catalán. */
const extraAliases = <T extends FilterModule>(entry: T): T => {
  const labels = new Set([normalizeText(entry.es), normalizeText(entry.ca)]);
  return { ...entry, aliases: entry.aliases.filter(a => !labels.has(normalizeText(a))) };
};

/**
 * Índice del currículo para los filtros del historial, limitado a los módulos y RA/CE que usa
 * algún proyecto (`usedModules`/`usedItems` ya normalizados): permite agrupar en una sola opción
 * el mismo módulo o RA guardado en castellano y en catalán. Para aligerar la respuesta, `aliases`
 * solo lleva los textos que no coinciden con `es` o `ca` (el frontend también busca por estos).
 */
export const buildFilterIndex = (entries: { module: FilterModule; item: FilterItem }[], usedModules: Set<string>, usedItems: Set<string>): FilterIndex => {
  const items = entries.map(e => e.item).filter(i => i.aliases.some(a => usedItems.has(normalizeText(a))));
  const itemModules = new Set(items.map(i => i.moduleKey));
  const modules = new Map<string, FilterModule>();
  for (const { module } of entries) {
    const used = itemModules.has(module.key) || module.aliases.some(a => usedModules.has(normalizeText(a)));
    if (used && !modules.has(module.key)) modules.set(module.key, module);
  }
  return { modules: Array.from(modules.values()).map(extraAliases), items: items.map(extraAliases) };
};

export const getFilterIndex = async (_req: any, res: Response) => {
  try {
    const [ras, ces, usedModules, usedItems] = await Promise.all([
      RA.find().select('-criterios_es -criterios_ca').sort({ _id: 1 }).lean(),
      CE.find().sort({ _id: 1 }),
      Project.distinct('modules'),
      Project.distinct('ras'),
    ]);
    const entries = [...ras.map(raEntry), ...ces.map(ceEntry)];
    return res.json(buildFilterIndex(entries, normalizedSet(usedModules), normalizedSet(usedItems)));
  } catch (error) {
    return res.status(500).json({ error: 'No se pudo cargar el índice del currículo' });
  }
};
