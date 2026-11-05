import mongoose, { Schema, Document } from 'mongoose';
import { AFINIDADES_TABS } from '../data/niveles';

/** Pareja (o trío) de criterios relacionados y la relación que fundamenta el ámbito. */
export interface VinculoAfinidad {
  /** Ids de criterio por código de materia (`{ biologia_geologia: ['6.2'] }`). */
  criterios: Record<string, string[]>;
  resumen_es: Record<string, string>;
  resumen_ca: Record<string, string>;
  relacion_es: string;
  relacion_ca: string;
}

/** Materia y opción del documento de origen, con el nombre del ámbito desde esa materia. */
export interface FuenteAfinidad {
  materia: string;
  opcion?: number;
  ambito_es: string;
  ambito_ca: string;
}

/**
 * Actividad conjunta de las materias de una ficha. Usa los mismos campos que las actividades del
 * mapa de FP, más los criterios que trabaja de cada materia (`{ matematicas: ['7.1'] }`).
 */
export interface ActividadAfinidad {
  /** Identificador estable (`ESO1-22-A1`). */
  id: string;
  title_es: string;
  title_ca: string;
  motivatingFactor_es: string;
  motivatingFactor_ca: string;
  description_es: string;
  description_ca: string;
  evidence_es: string;
  evidence_ca: string;
  diversitySupport_es: string;
  diversitySupport_ca: string;
  criterios: Record<string, string[]>;
}

/** Ficha de afinidad curricular de la ESO entre dos o tres materias de un curso. */
export interface AfinidadEsoData {
  /** Identificador estable de la ficha (`ESO1-01`). */
  id: string;
  curso: string;
  materias: string[];
  ambito_es: string;
  ambito_ca: string;
  vinculos: VinculoAfinidad[];
  /** Saberes básicos movilizados por código de materia. */
  saberes: Record<string, { es: string[]; ca: string[] }>;
  conceptos_es: string[];
  conceptos_ca: string[];
  fuentes: FuenteAfinidad[];
  /** Actividades conjuntas de ejemplo (por ahora solo en 1.º). */
  actividades?: ActividadAfinidad[];
}

export interface IAfinidadEso extends Document, Omit<AfinidadEsoData, 'id' | 'vinculos' | 'fuentes' | 'actividades'> {
  vinculos: unknown[];
  fuentes: unknown[];
  actividades?: unknown[];
  tab: string;
  order: number;
  code: string;
}

const AfinidadEsoSchema = new Schema<IAfinidadEso>(
  {
    tab: { type: String, required: true, enum: AFINIDADES_TABS as string[], index: true },
    order: { type: Number, required: true, default: 0 },
    code: { type: String, required: true, unique: true },
    curso: { type: String, required: true },
    materias: { type: [String], required: true, index: true },
    ambito_es: { type: String, required: true },
    ambito_ca: { type: String, required: true },
    vinculos: { type: [Schema.Types.Mixed], default: [] },
    saberes: { type: Schema.Types.Mixed, default: {} },
    conceptos_es: { type: [String], default: [] },
    conceptos_ca: { type: [String], default: [] },
    fuentes: { type: [Schema.Types.Mixed], default: [] },
    // Sin valor por defecto: las fichas sin actividades (2.º-4.º) no guardan el campo.
    actividades: { type: [Schema.Types.Mixed], default: undefined }
  },
  { timestamps: true }
);

AfinidadEsoSchema.index({ tab: 1, order: 1 });

export const AfinidadEso = mongoose.model<IAfinidadEso>('AfinidadEso', AfinidadEsoSchema);
