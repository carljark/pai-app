import mongoose from 'mongoose';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

const CESchema = new mongoose.Schema({
  area: String,
  subject: String,
  ce_id: String,
  description: String,
  criterios: Array
});
const CE = mongoose.model('CE', CESchema);

async function cleanAndTranslate() {
  await mongoose.connect('mongodb://localhost:27017/pai_db');
  console.log('MongoDB Conectado');

  let ces = await CE.find();
  
  // 1. Deduplicar Matemáticas
  const mathSeen = new Set();
  for (let ce of ces) {
    if (ce.subject === 'Matemáticas') {
      if (mathSeen.has(ce.ce_id)) {
        await CE.deleteOne({ _id: ce._id });
        console.log(`🗑️ Eliminado duplicado de matemáticas: ${ce.ce_id}`);
      } else {
        mathSeen.add(ce.ce_id);
      }
    }
  }

  // Refrescar lista después de borrar
  ces = await CE.find();

  // 2. Traducir al castellano agrupando por asignaturas para no saturar la API
  const subjects = [...new Set(ces.map(ce => ce.subject))];
  console.log(`🌍 Iniciando traducción agrupada por asignaturas (${subjects.length})...`);
  
  for (let subj of subjects) {
    const cesOfSubject = ces.filter(ce => ce.subject === subj);
    console.log(`Traduciendo bloque: ${subj} (${cesOfSubject.length} items)...`);
    
    // Solo extraemos id, description y criterios para enviar
    const payload = cesOfSubject.map(c => ({
      _id: c._id.toString(),
      description: c.description,
      criterios: c.criterios
    }));

    const prompt = `Traduce el siguiente JSON (array de competencias y criterios en catalán) al CASTELLANO PERFECTO. 
    Mantén exactamente las mismas claves JSON y IDs. Devuelve solo el JSON válido.
    
    ${JSON.stringify(payload)}`;

    let retries = 0;
    while (retries < 3) {
      try {
        const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        
        const translatedArray = JSON.parse(response.text!);
        
        for (let trans of translatedArray) {
          const ceToUpdate = ces.find(c => c._id.toString() === trans._id);
          if (ceToUpdate) {
            ceToUpdate.description = trans.description;
            ceToUpdate.criterios = trans.criterios;
            await ceToUpdate.save();
          }
        }
        console.log(`✅ ${subj} Traducido OK`);
        // Pausa de 4 segundos para respetar el Free Tier Rate Limit
        await new Promise(r => setTimeout(r, 4000));
        break;
      } catch (err: any) {
        retries++;
        console.log(`⚠️ Error en traducción de ${subj}, reintento ${retries}/3... Detalles: ${err.message}`);
        await new Promise(r => setTimeout(r, 10000));
      }
    }
  }

  console.log('✅ Proceso de limpieza y traducción finalizado.');
  process.exit(0);
}

cleanAndTranslate();
