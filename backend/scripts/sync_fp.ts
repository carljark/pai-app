import mongoose from 'mongoose';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

const RASchema = new mongoose.Schema({ id: String, module: String, description: String, description_es: String, description_ca: String }, { strict: false });
const RA = mongoose.model('RA', RASchema, 'ras');

async function syncTranslations() {
  await mongoose.connect('mongodb://localhost:27017/pai_db');
  console.log('MongoDB Conectado');

  const ras = await RA.find();
  
  for (let ra of ras) {
    if (!ra.description_es && ra.description) {
      ra.description_es = ra.description;
      await ra.save();
    }
  }

  const rasToTranslate = ras.filter(r => !r.description_ca);
  if (rasToTranslate.length === 0) {
    console.log('Nada que traducir.');
    process.exit(0);
  }

  const payload = rasToTranslate.map(r => ({ _id: r._id.toString(), description: r.description_es }));
  const prompt = `Traduce el siguiente JSON (array de resultados de aprendizaje de FP Básica en español) al CATALÁN. Mantén las claves. \n\n${JSON.stringify(payload)}`;

  let retries = 0;
  while (retries < 3) {
    try {
      const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: { responseMimeType: "application/json" }
      });
      const translatedArray = JSON.parse(response.text);
      
      for (let trans of translatedArray) {
        const raToUpdate = ras.find(r => r._id.toString() === trans._id);
        if (raToUpdate) {
          raToUpdate.description_ca = trans.description;
          await raToUpdate.save();
        }
      }
      console.log(`✅ FP Traducido OK`);
      break;
    } catch (err: any) {
      retries++;
      console.error(`⚠️ Error en traducción FP... reintento.`, err.message);
      await new Promise(r => setTimeout(r, 65000));
    }
  }
  process.exit(0);
}

syncTranslations();
