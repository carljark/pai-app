import { TipoNivel } from '../../curriculum/utils/curriculum-grouping';

export type MapaTab =
  | 'FPB'
  | 'CFGM'
  | 'CFGM_PELUQUERIA'
  | 'CFGM_PELUQUERIA_2'
  | 'CFGS_EDUCACION_INFANTIL'
  | 'CFGS_EDUCACION_INFANTIL_2';

/** Configuración de cada pestaña del mapa: nombre, nivel y curso del generador y selección inicial. */
export interface MapaTabConfig {
  id: MapaTab;
  label_es: string;
  label_ca: string;
  tipoNivel: TipoNivel;
  /** Curso que se fija en el generador al crear un proyecto; `null` si el ciclo no se divide. */
  curso: '1º' | '2º' | null;
  defaultSelection: { moduleCode: string; raId: string };
}

export const MAPA_TABS: readonly MapaTabConfig[] = [
  {
    id: 'FPB',
    label_es: 'CFGB Peluquería y Estética',
    label_ca: 'CFGB Perruqueria i Estètica',
    tipoNivel: 'FP_BASICA',
    curso: null,
    defaultSelection: { moduleCode: '3060', raId: '3060_RA1' },
  },
  {
    id: 'CFGM',
    label_es: 'CFGM Estética y Belleza',
    label_ca: 'CFGM Estètica i Bellesa',
    tipoNivel: 'CFGM_ESTETICA',
    curso: null,
    defaultSelection: { moduleCode: '0633', raId: '0633_RA1' },
  },
  {
    id: 'CFGM_PELUQUERIA',
    label_es: 'CFGM Peluquería y Cosmética Capilar 1º',
    label_ca: 'CFGM Perruqueria i Cosmètica Capil·lar 1r',
    tipoNivel: 'CFGM_PELUQUERIA',
    curso: '1º',
    defaultSelection: { moduleCode: '0845', raId: '0845_RA1' },
  },
  {
    id: 'CFGM_PELUQUERIA_2',
    label_es: 'CFGM Peluquería y Cosmética Capilar 2º',
    label_ca: 'CFGM Perruqueria i Cosmètica Capil·lar 2n',
    tipoNivel: 'CFGM_PELUQUERIA',
    curso: '2º',
    defaultSelection: { moduleCode: '0640', raId: '0640_RA1' },
  },
  {
    id: 'CFGS_EDUCACION_INFANTIL',
    label_es: 'CFGS Educación Infantil 1º',
    label_ca: 'CFGS Educació Infantil 1r',
    tipoNivel: 'CFGS_EDUCACION_INFANTIL',
    curso: '1º',
    defaultSelection: { moduleCode: '0011', raId: '0011_RA1' },
  },
  {
    id: 'CFGS_EDUCACION_INFANTIL_2',
    label_es: 'CFGS Educación Infantil 2º',
    label_ca: 'CFGS Educació Infantil 2n',
    tipoNivel: 'CFGS_EDUCACION_INFANTIL',
    curso: '2º',
    defaultSelection: { moduleCode: '0013', raId: '0013_RA1' },
  },
];

export function mapaTabConfig(tab: MapaTab): MapaTabConfig {
  return MAPA_TABS.find((t) => t.id === tab) ?? MAPA_TABS[0];
}

/** Nombre de la pestaña (ciclo y curso) en el idioma activo. */
export function mapaTabLabel(tab: MapaTab, isCa: boolean): string {
  const config = mapaTabConfig(tab);
  return isCa ? config.label_ca : config.label_es;
}
