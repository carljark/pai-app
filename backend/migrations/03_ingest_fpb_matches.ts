import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import { FpbMatch } from '../src/models/FpbMatch';

const docxMapping: Record<string, { title: string, code: string | null, type: 'coincidencia' | 'actividad_ampliada' | 'relacion_criterios' | 'prompt_coincidencias' }> = {
  "Coincidencias_CS_I_Peluqueria_y_Estetica.docx": { title: "Comunicación y Sociedad I - Peluquería y Estética", code: "3011", type: "coincidencia" },
  "Coincidencias_Cuidados_esteticos_unas.docx": { title: "Cuidados estéticos básicos de uñas", code: "3061", type: "coincidencia" },
  "Coincidencias_Preparacion_entorno_profesional.docx": { title: "Preparación del entorno profesional", code: "3060", type: "coincidencia" },
  "Prompt Coincidencias.docx": { title: "Instrucciones de Coincidencias de Sistema", code: null, type: "prompt_coincidencias" },
  "actividades_ampliadas_preparacion_entorno_profesional_FPB.docx": { title: "Preparación del entorno profesional - Actividades Ampliadas", code: "3060", type: "actividad_ampliada" },
  "relacion_criterios_atencion_cliente_todos_modulos.docx": { title: "Atención al cliente", code: "3005", type: "relacion_criterios" },
  "relacion_criterios_cambios_color_todos_modulos.docx": { title: "Cambios de color del cabello", code: "3065", type: "relacion_criterios" },
  "relacion_criterios_ciencias_aplicadas_II_todos_modulos.docx": { title: "Ciencias aplicadas II", code: "3042", type: "relacion_criterios" },
  "relacion_criterios_ciencias_aplicadas_I_todos_modulos.docx": { title: "Ciencias aplicadas I", code: "3009", type: "relacion_criterios" },
  "relacion_criterios_comunicacion_sociedad_I_todos_modulos.docx": { title: "Comunicación y sociedad I", code: "3011", type: "relacion_criterios" },
  "relacion_criterios_depilacion_todos_modulos.docx": { title: "Depilación mecánica y decoloración del vello superfluo", code: "3062", type: "relacion_criterios" },
  "relacion_criterios_itinerario_empleabilidad_todos_modulos.docx": { title: "Itinerario personal para la empleabilidad", code: "3159", type: "relacion_criterios" },
  "relacion_criterios_lavado_cambios_forma_todos_modulos.docx": { title: "Lavado y cambios de forma del cabello", code: "3064", type: "relacion_criterios" },
  "relacion_criterios_maquillaje_todos_modulos.docx": { title: "Maquillaje", code: "3063", type: "relacion_criterios" }
};

export async function up() {
  const sourceDir = path.join(process.cwd(), '../Plantillas coincidencias FPB');
  if (!fs.existsSync(sourceDir)) {
    console.warn(`Directorio de origen no encontrado: ${sourceDir}`);
    return;
  }

  const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.docx'));
  let insertedCount = 0;

  for (const file of files) {
    const mapping = docxMapping[file];
    if (!mapping) {
      console.warn(`El archivo ${file} no tiene mapeo definido. Saltando.`);
      continue;
    }

    const filePath = path.join(sourceDir, file);
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      const rawText = result.value;

      // Buscar si ya existe en la base de datos
      const existing = await FpbMatch.findOne({ fileName: file });
      if (existing) {
        existing.rawText = rawText;
        existing.title = mapping.title;
        existing.code = mapping.code || undefined;
        existing.type = mapping.type;
        await existing.save();
      } else {
        await new FpbMatch({
          fileName: file,
          title: mapping.title,
          code: mapping.code || undefined,
          rawText,
          type: mapping.type
        }).save();
        insertedCount++;
      }
    } catch (err) {
      console.error(`Error al procesar el archivo ${file}:`, err);
    }
  }

  console.log(`Migración de coincidencias FPB finalizada. Insertados/Actualizados ${files.length} documentos (Nuevos: ${insertedCount}).`);
}
