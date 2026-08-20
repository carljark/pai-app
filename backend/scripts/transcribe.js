const fs = require('fs');
require('dotenv').config({ path: 'backend/.env' });

async function run() {
  const { GoogleGenAI } = require('@google/genai');
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const audioData = fs.readFileSync('correcciones/WhatsApp Ptt 2026-08-20 at 13.06.45.ogg').toString('base64');
  
  const prompt = "Please transcribe this audio and explicitly list all the feedback/corrections the speaker (Eva) mentions about the application.";
  
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-1.5-pro',
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
