import fs from 'fs';
import path from 'path';

export const buildContexts = (settings: any) => {
  const schoolContextStr = settings 
    ? `\n\n--- CONTEXTO DEL CENTRO EDUCATIVO ---\nNombre: ${settings.schoolName}\nCiudad: ${settings.schoolCity}\nContexto: ${settings.schoolContext}`
    : '';

  let intefExamplesContext = '';
  try {
    const examplesPath = path.join(process.cwd(), 'src/data/intef_examples.json');
    if (fs.existsSync(examplesPath)) {
      const examples = JSON.parse(fs.readFileSync(examplesPath, 'utf-8'));
      intefExamplesContext = "\n--- EJEMPLOS DEL INTEF ---\n" + JSON.stringify(examples);
    }
  } catch (e) { console.warn("No se cargaron los ejemplos del INTEF"); }

  return { schoolContextStr, intefExamplesContext };
};

export const generateGeminiContent = async (userPrompt: string, systemInstruction: string) => {
  const { GoogleGenAI } = await import('@google/genai');
  const ai = new GoogleGenAI({});
  
  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: userPrompt,
    config: { systemInstruction }
  });
  return response.text;
};
