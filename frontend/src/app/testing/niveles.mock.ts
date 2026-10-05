import { TestBed } from '@angular/core/testing';
import { NivelEducativo, NivelesService } from '../services/niveles.service';

/** Copia del catálogo del backend (`backend/src/data/niveles.ts`) para las specs. */
export const NIVELES_MOCK: NivelEducativo[] = [
  {
    id: 'FP_BASICA',
    etapa: 'FPB',
    nombre_es: 'CFGB Peluquería y Estética',
    nombre_ca: 'CFGB Perruqueria i Estètica',
    unidad: 'RA',
    cursos: [{ curso: '1º' }, { curso: '2º' }],
    mapas: [{ tab: 'FPB', moduleCode: '3060', raId: '3060_RA1' }],
  },
  {
    id: 'CFGM_ESTETICA',
    etapa: 'CFGM',
    nombre_es: 'CFGM Estética y Belleza',
    nombre_ca: 'CFGM Estètica i Bellesa',
    unidad: 'RA',
    cursos: [
      {
        curso: '1º',
        modulos: ['0633', '0635', '0636', '0638', '0640', '0641', '1664', '1709', '0156'],
      },
    ],
    mapas: [{ tab: 'CFGM', moduleCode: '0633', raId: '0633_RA1' }],
  },
  {
    id: 'CFGM_PELUQUERIA',
    etapa: 'CFGM',
    nombre_es: 'CFGM Peluquería y Cosmética Capilar',
    nombre_ca: 'CFGM Perruqueria i Cosmètica Capil·lar',
    unidad: 'RA',
    cursos: [
      { curso: '1º', modulos: ['0845', '0842', '0844', '0846', '0849', '1664', '1709', '0156'] },
      { curso: '2º', modulos: ['0640', '0643', '0843', '0848', '0636', '1708', '1710', '1713'] },
    ],
    mapas: [
      { tab: 'CFGM_PELUQUERIA', curso: '1º', moduleCode: '0845', raId: '0845_RA1' },
      { tab: 'CFGM_PELUQUERIA_2', curso: '2º', moduleCode: '0640', raId: '0640_RA1' },
    ],
  },
  {
    id: 'CFGS_EDUCACION_INFANTIL',
    etapa: 'CFGS',
    nombre_es: 'CFGS Educación Infantil',
    nombre_ca: 'CFGS Educació Infantil',
    unidad: 'RA',
    cursos: [
      { curso: '1º', modulos: ['0011', '0012', '0014', '0015', '1665', '1709'] },
      {
        curso: '2º',
        modulos: ['0013', '0016', '0017', '0018', '0020', '0019', '0179', '1708', '1710'],
      },
    ],
    mapas: [
      { tab: 'CFGS_EDUCACION_INFANTIL', curso: '1º', moduleCode: '0011', raId: '0011_RA1' },
      { tab: 'CFGS_EDUCACION_INFANTIL_2', curso: '2º', moduleCode: '0013', raId: '0013_RA1' },
    ],
  },
  {
    id: 'ESO_ORDINARIA',
    etapa: 'ESO',
    nombre_es: 'ESO',
    nombre_ca: 'ESO',
    unidad: 'CE',
    cursos: [
      { curso: '1º', edad: '12-13 años' },
      { curso: '2º', edad: '13-14 años' },
      { curso: '3º', edad: '14-15 años' },
      { curso: '4º', edad: '15-16 años' },
    ],
  },
  {
    id: 'DIVERSIFICACION_CURRICULAR',
    etapa: 'ESO',
    nombre_es: 'ESO (PDC)',
    nombre_ca: 'ESO (PDC)',
    unidad: 'CE',
    cursos: [{ curso: '3º' }, { curso: '4º' }],
  },
];

/** Nivel que solo existe en el catálogo: debe aparecer en todas las vistas sin tocarlas. */
export const NIVEL_FICTICIO: NivelEducativo = {
  id: 'CFGS_FICTICIO',
  etapa: 'CFGS',
  nombre_es: 'CFGS Animación Ficticia',
  nombre_ca: 'CFGS Animació Fictícia',
  unidad: 'RA',
  cursos: [{ curso: '1º' }, { curso: '2º' }],
};

/** Carga el catálogo de prueba en el `NivelesService` del TestBed actual. */
export function loadNivelesMock(niveles: NivelEducativo[] = NIVELES_MOCK): NivelesService {
  const service = TestBed.inject(NivelesService);
  service.niveles.set(niveles);
  return service;
}
