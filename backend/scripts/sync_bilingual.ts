import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

const CESchema = new mongoose.Schema({
  area: String,
  subject: String,
  ce_id: String,
  description: String,
  description_es: String,
  description_ca: String,
  criterios: Array,
  criterios_es: Array,
  criterios_ca: Array
});
const CE = mongoose.model('CE', CESchema);

async function syncTranslations() {
  await mongoose.connect('mongodb://localhost:27017/pai_db');
  console.log('MongoDB Conectado');

  // 1. Cargar el JSON original (que está en catalán puro)
  const rawData = fs.readFileSync(path.join(process.cwd(), 'ces_eso.json'), 'utf-8');
  const originalCes = JSON.parse(rawData);

  const ces = await CE.find();

  // 2. Para cada CE en la DB, asegurarnos de que description_ca es el original
  for (let ce of ces) {
    // Buscar el original usando ce_id y area/subject
    // (Ojo que fusionamos matemáticas, así que buscamos "Matemàtiques" o similar)
    const original = originalCes.find((c: any) => c.ce_id === ce.ce_id && (c.subject === ce.subject || c.subject.includes('Matemàtiques')));
    
    if (original) {
      ce.description_ca = original.description;
      ce.criterios_ca = original.criterios;
    } else {
      // Fallback a lo que haya en description
      ce.description_ca = ce.description;
      ce.criterios_ca = ce.criterios;
    }
    
    // Si la descripción actual no está explícitamente en español, la marcamos para traducir
    // Sabemos que matemáticas está en catalán. 
    if (ce.subject === 'Matemáticas' || !ce.description_es) {
      // Necesita traducción
    } else {
      ce.description_es = ce.description;
      ce.criterios_es = ce.criterios;
    }
    await ce.save();
  }

  // 3. Traducir lo que falte
  const subjects = [...new Set(ces.map(ce => ce.subject))];
  for (let subj of subjects) {
    const cesToTranslate = ces.filter(ce => ce.subject === subj && !ce.description_es);
    if (cesToTranslate.length === 0) continue;

    console.log(`Traduciendo bloque: ${subj} (${cesToTranslate.length} items)...`);
    
    const payload = cesToTranslate.map(c => ({
      _id: c._id.toString(),
      description: c.description_ca,
      criterios: c.criterios_ca
    }));

    const prompt = `Traduce el siguiente JSON (array de competencias en catalán) al CASTELLANO. Mantén las claves. \n\n${JSON.stringify(payload)}`;

    let retries = 0;
    while (retries < 5) {
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
            ceToUpdate.description_es = trans.description;
            ceToUpdate.criterios_es = trans.criterios;
            await ceToUpdate.save();
          }
        }
        console.log(`✅ ${subj} Traducido OK`);
        await new Promise(r => setTimeout(r, 20000)); // 20 seg de pausa
        break;
      } catch (err: any) {
        retries++;
        console.error(`⚠️ Error en traducción de ${subj}... reintento ${retries}/5. Detalle:`, err.message || err);
        await new Promise(r => setTimeout(r, 65000)); // Esperar más de un minuto por si es rate limit (429)
      }
    }
  }

  console.log('✅ Base de datos totalmente bilingüe (ESO).');
  process.exit(0);
}

syncTranslations();
