import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: 'backend/.env' });
import { GoogleGenAI } from '@google/genai';

async function run() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const audioData = fs.readFileSync('correcciones/WhatsApp Ptt 2026-08-20 at 13.06.45.ogg').toString('base64');
  
  const prompt = "Escucha este audio y lista EXACTAMENTE cuáles son las correcciones o mejoras que pide Eva para la aplicación.";
  
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: [
            { text: prompt },
            { inlineData: { mimeType: 'audio/ogg', data: audioData } }
        ]
    });
    console.log(response.text);
  } catch (err) {
    console.error(err);
  }
}
run();
