import {
  AfinidadEso,
  AfinidadesCurso,
} from '../features/mapa-intermodular/models/afinidad-eso.model';
import { NivelEducativo } from '../services/niveles.service';

/** Ficha de dos materias (documento del centro) con una sola fuente. */
export const FICHA_DOS: AfinidadEso = {
  id: 'f2',
  curso: '1º',
  materias: ['BYG', 'MAT'],
  ambito_es: 'Ámbito científico',
  ambito_ca: 'Àmbit científic',
  vinculos: [
    {
      criterios: { BYG: ['1.1'], MAT: ['2.1', '2.2'] },
      criteriosTexto: {
        BYG: [{ id: '1.1', text_es: 'Texto oficial BYG', text_ca: 'Text oficial BYG' }],
      },
      resumen_es: { BYG: 'Resumen BYG', MAT: 'Resumen MAT' },
      resumen_ca: { BYG: 'Resum BYG', MAT: 'Resum MAT' },
      relacion_es: 'Relación científica',
      relacion_ca: 'Relació científica',
    },
  ],
  saberes: { BYG: { es: ['Saber A', 'Saber B'], ca: ['Saber CA A', 'Saber CA B'] } },
  conceptos_es: ['Energía', 'Medida'],
  conceptos_ca: ['Energia', 'Mesura'],
  origen: 'documento',
  fuentes: [{ materia: 'BYG', opcion: 2, ambito_es: 'Ámbito de BYG', ambito_ca: 'Àmbit de BYG' }],
};

/** Ficha de tres materias (ampliación) con dos fuentes de ámbito distinto. */
export const FICHA_TRES: AfinidadEso = {
  id: 'f3',
  curso: '1º',
  materias: ['BYG', 'MAT', 'TEC'],
  ambito_es: 'Ámbito de la ficha',
  ambito_ca: 'Àmbit de la fitxa',
  vinculos: [
    {
      criterios: { BYG: ['1.1'], MAT: ['2.1'], TEC: ['3.1'] },
      criteriosTexto: {
        BYG: [{ id: '1.1', text_es: 'Oficial BYG 3', text_ca: 'Oficial BYG 3 ca' }],
        MAT: [{ id: '2.1', text_es: 'Oficial MAT 3', text_ca: 'Oficial MAT 3 ca' }],
        TEC: [{ id: '3.1', text_es: 'Oficial TEC 3', text_ca: 'Oficial TEC 3 ca' }],
      },
      resumen_es: { BYG: 'R BYG', MAT: 'R MAT', TEC: 'R TEC' },
      resumen_ca: { BYG: 'R BYG ca', MAT: 'R MAT ca', TEC: 'R TEC ca' },
      relacion_es: 'Relación tres',
      relacion_ca: 'Relació tres',
    },
  ],
  saberes: {
    BYG: { es: ['S1'], ca: ['S1 ca'] },
    MAT: { es: ['S2'], ca: ['S2 ca'] },
    TEC: { es: ['S3'], ca: ['S3 ca'] },
  },
  conceptos_es: ['Sistema'],
  conceptos_ca: ['Sistema ca'],
  origen: 'ampliacion',
  fuentes: [
    { materia: 'MAT', opcion: 1, ambito_es: 'Ámbito desde MAT', ambito_ca: 'Àmbit des de MAT' },
    { materia: 'TEC', ambito_es: 'Ámbito desde TEC', ambito_ca: 'Àmbit des de TEC' },
  ],
};

export const AFINIDADES_1: AfinidadesCurso = {
  curso: '1º',
  materias: [
    {
      code: 'BYG',
      name_es: 'Biología y Geología',
      name_ca: 'Biologia i Geologia',
      tipo: 'troncal',
      total: 2,
    },
    { code: 'MAT', name_es: 'Matemáticas', name_ca: 'Matemàtiques', tipo: 'troncal', total: 2 },
    { code: 'TEC', name_es: 'Tecnología', name_ca: 'Tecnologia', tipo: 'troncal', total: 1 },
    {
      code: 'EF',
      name_es: 'Educación Física',
      name_ca: 'Educació Física',
      tipo: 'troncal',
      total: 0,
    },
  ],
  afinidades: [FICHA_DOS, FICHA_TRES],
};

export const AFINIDADES_2: AfinidadesCurso = {
  curso: '2º',
  materias: [
    {
      code: 'FYQ',
      name_es: 'Física y Química',
      name_ca: 'Física i Química',
      tipo: 'troncal',
      total: 0,
    },
  ],
  afinidades: [],
};

/** Nivel de ESO con dos mapas de afinidades (1º y 2º). */
export const NIVEL_AFINIDADES: NivelEducativo = {
  id: 'ESO_ORDINARIA',
  etapa: 'ESO',
  nombre_es: 'ESO',
  nombre_ca: 'ESO',
  unidad: 'CE',
  cursos: [{ curso: '1º' }, { curso: '2º' }],
  mapas: [
    { tab: 'ESO_1', curso: '1º', formato: 'afinidades', moduleCode: 'MAT', raId: '' },
    { tab: 'ESO_2', curso: '2º', formato: 'afinidades', moduleCode: 'NOEXISTE', raId: '' },
  ],
};
