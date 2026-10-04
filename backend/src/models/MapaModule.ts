import mongoose, { Schema, Document } from 'mongoose';

export interface IMapaModule extends Document {
  tab: 'FPB' | 'CFGM' | 'CFGM_PELUQUERIA' | 'CFGM_PELUQUERIA_2' | 'CFGS_EDUCACION_INFANTIL' | 'CFGS_EDUCACION_INFANTIL_2';
  order: number;
  code: string;
  name_es: string;
  name_ca: string;
  type: string;
  color: string;
  icon: string;
  learningOutcomes: any[];
}

const MapaModuleSchema = new Schema<IMapaModule>(
  {
    tab: {
      type: String,
      required: true,
      enum: ['FPB', 'CFGM', 'CFGM_PELUQUERIA', 'CFGM_PELUQUERIA_2', 'CFGS_EDUCACION_INFANTIL', 'CFGS_EDUCACION_INFANTIL_2'],
      index: true
    },
    order: { type: Number, required: true, default: 0 },
    code: { type: String, required: true },
    name_es: { type: String, required: true },
    name_ca: { type: String, required: true },
    type: { type: String, required: true },
    color: { type: String, required: true },
    icon: { type: String, required: true },
    learningOutcomes: { type: [Schema.Types.Mixed], default: [] }
  },
  {
    timestamps: true
  }
);

MapaModuleSchema.index({ tab: 1, order: 1 });
MapaModuleSchema.index({ tab: 1, code: 1 }, { unique: true });

export const MapaModule = mongoose.model<IMapaModule>('MapaModule', MapaModuleSchema);
