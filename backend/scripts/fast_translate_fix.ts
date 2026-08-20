import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

async function run() {
  const rawData = fs.readFileSync(path.join(process.cwd(), 'backend', 'ces_eso.json'), 'utf-8');
  const ces = JSON.parse(rawData);

  // Filter out Matemàtiques A and B before translating to save tokens and avoid duplicates
  const filtered = ces.filter((c: any) => c.subject !== 'Matemàtiques A' && c.subject !== 'Matemàtiques B');

  console.log('Translating ' + filtered.length + ' items...');
  const prompt = `Traduce el siguiente JSON (array de competencias en catalán) al CASTELLANO. Devuelve SOLO el JSON válido.
Mantén EXACTAMENTE el mismo orden del array. Traduce 'description' y 'description' dentro de 'criterios'.\n\n${JSON.stringify(filtered)}`;
  
  const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
  });
  
  const translated = JSON.parse(response.text!);
  
  for (let i = 0; i < filtered.length; i++) {
    filtered[i].description_ca = filtered[i].description;
    filtered[i].criterios_ca = filtered[i].criterios;
    
    // Direct index matching
    filtered[i].description_es = translated[i].description;
    filtered[i].criterios_es = translated[i].criterios;
  }

  fs.writeFileSync(path.join(process.cwd(), 'backend', 'ces_eso_bilingual.json'), JSON.stringify(filtered, null, 2));
  console.log('Saved to ces_eso_bilingual.json');
}
run();
