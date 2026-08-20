import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

async function run() {
  const rawData = fs.readFileSync(path.join(process.cwd(), 'backend', 'ces_eso.json'), 'utf-8');
  const ces = JSON.parse(rawData);

  console.log('Translating 65 items...');
  const prompt = `Traduce el siguiente JSON (array de competencias en catalán) al CASTELLANO. Devuelve SOLO el JSON válido.
Mantén las mismas claves (area, subject, ce_id, description, criterios). Traduce los valores de 'description' y 'description' dentro de 'criterios'.\n\n${JSON.stringify(ces)}`;
  
  const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
  });
  
  const translated = JSON.parse(response.text!);
  
  for (let i = 0; i < ces.length; i++) {
    ces[i].description_ca = ces[i].description;
    ces[i].criterios_ca = ces[i].criterios;
    
    // Find matching by subject and ce_id to be perfectly safe
    const match = translated.find((t: any) => t.subject === ces[i].subject && t.ce_id === ces[i].ce_id);
    if (match) {
        ces[i].description_es = match.description;
        ces[i].criterios_es = match.criterios;
    }
  }

  fs.writeFileSync(path.join(process.cwd(), 'backend', 'ces_eso_bilingual.json'), JSON.stringify(ces, null, 2));
  console.log('Saved to ces_eso_bilingual.json');
}
run();
