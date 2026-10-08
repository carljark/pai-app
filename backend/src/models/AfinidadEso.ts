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
  /** `documento` (IES Cap de Llevant) o `ampliacion` (propuesta nueva). */
  origen: 'documento' | 'ampliacion';
  fuentes: FuenteAfinidad[];
}

export interface IAfinidadEso extends Document, Omit<AfinidadEsoData, 'id' | 'vinculos' | 'fuentes'> {
  vinculos: unknown[];
  fuentes: unknown[];
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
    origen: { type: String, enum: ['documento', 'ampliacion'], required: true },
    fuentes: { type: [Schema.Types.Mixed], default: [] }
  },
  { timestamps: true }
);

AfinidadEsoSchema.index({ tab: 1, order: 1 });

export const AfinidadEso = mongoose.model<IAfinidadEso>('AfinidadEso', AfinidadEsoSchema);
