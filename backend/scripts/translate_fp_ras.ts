import mongoose from 'mongoose';
import { RA } from '../src/models/RA';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({});

async function run() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27018/pai_db');
  console.log('MongoDB Conectado');

  const ras = await RA.find();
  console.log(`Encontrados ${ras.length} RAs para traducir...`);

  // Extraemos datos simples para pasar a Gemini
  const dataToTranslate = ras.map(ra => ({
    id: ra._id.toString(),
    module: ra.module,
    description: ra.description
  }));

  const prompt = `Traduce el siguiente JSON (array de Resultados de Aprendizaje en catalán) al CASTELLANO. 
Devuelve SOLO el JSON válido.
Traduce los campos 'module' y 'description'.
Las traducciones de 'module' sugeridas son (usa tu mejor criterio):
- Preparació de l'entorn professional -> Preparación del entorno profesional
- Cures estètiques bàsiques de mans i ungles -> Cuidados estéticos básicos de manos y uñas
- Depil·lació mecànica i decoloració mecànica del borrissol superflu -> Depilación mecánica y decoloración mecánica del vello superfluo
- Maquillatge -> Maquillaje
- Rentat i canvis de forma del cabell -> Lavado y cambios de forma del cabello
- Canvi de color del cabell -> Cambio de color del cabello
- Atenció al client -> Atención al cliente
- Comunicació i societat I -> Comunicación y sociedad I
- Comunicació i societat II -> Comunicación y sociedad II
- Ciències aplicades I -> Ciencias aplicadas I
- Ciències aplicades II -> Ciencias aplicadas II
- Itinerari per l'ocupabilitat -> Itinerario para la empleabilidad

JSON Original:
${JSON.stringify(dataToTranslate)}`;

  console.log('Enviando a Gemini...');
  const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
  });
  
  const translated = JSON.parse(response.text!);
  
  for (let t of translated) {
    await RA.findByIdAndUpdate(t.id, {
      description_es: t.description,
      module_es: t.module // Asumiremos que el frontend o backend usa esto, luego lo arreglaremos.
    });
  }

  console.log('RAs actualizados en castellano en la Base de Datos.');
  process.exit(0);
}
run();
