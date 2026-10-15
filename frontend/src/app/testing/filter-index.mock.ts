import { FilterIndex } from '../features/history/utils/curriculum-resolver';

/** Índice del currículo de prueba: dos módulos del CFGM de Peluquería con sus RA en ES/CA. */
export const LEVEL = 'CFGM_PELUQUERIA';
export const PEINADOS = `${LEVEL}|0845`;
export const ANALISIS = `${LEVEL}|0640`;

export const FILTER_INDEX: FilterIndex = {
  modules: [
    {
      key: PEINADOS,
      tipoNivel: LEVEL,
      es: 'Peinados',
      ca: 'Pentinats',
      aliases: ['Peinados', 'Pentinats'],
    },
    {
      key: ANALISIS,
      tipoNivel: LEVEL,
      es: 'Análisis',
      ca: 'Anàlisi',
      aliases: ['Análisis', 'Anàlisi'],
    },
  ],
  items: [
    {
      key: `${PEINADOS}|RA2`,
      tipoNivel: LEVEL,
      moduleKey: PEINADOS,
      order: 2,
      es: 'RA2. Recoge',
      ca: 'RA2. Recull',
      aliases: ['Recoge', 'Recull'],
    },
    {
      key: `${PEINADOS}|RA1`,
      tipoNivel: LEVEL,
      moduleKey: PEINADOS,
      order: 1,
      es: 'RA1. Peina',
      ca: 'RA1. Pentina',
      aliases: ['Peina', 'Pentina'],
    },
    {
      key: `${ANALISIS}|RA1`,
      tipoNivel: LEVEL,
      moduleKey: ANALISIS,
      order: 1,
      es: 'RA1. Analiza',
      ca: 'RA1. Analitza',
      aliases: ['Analiza', 'Analitza'],
    },
  ],
};
