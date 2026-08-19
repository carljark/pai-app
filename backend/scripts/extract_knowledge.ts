import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({});

async function extractKnowledge() {
  console.log('Iniciando extracción de conocimiento (RAG)...');
  
  const baseDir = path.join(process.cwd(), '../Proyecto_FPB_PAI/ESO');
  const evalDir = path.join(baseDir, 'Evaluación formativa');
  const rubricasDir = path.join(baseDir, 'Ejemplos Rubricas');
  
  const filesToUpload: string[] = [];
  
  if (fs.existsSync(evalDir)) {
    fs.readdirSync(evalDir).forEach(file => {
      if (file.endsWith('.pdf')) {
        filesToUpload.push(path.join(evalDir, file));
      }
    });
  }
  
  if (fs.existsSync(rubricasDir)) {
    fs.readdirSync(rubricasDir).forEach(file => {
      if (file.endsWith('.pdf')) {
        filesToUpload.push(path.join(rubricasDir, file));
      }
    });
  }

  console.log(`Encontrados ${filesToUpload.length} PDFs para procesar.`);

  try {
    const uploadedFiles = [];
    const tmpDir = path.join(process.cwd(), 'tmp_uploads');
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

    for (const filePath of filesToUpload) {
      const cleanName = path.basename(filePath).replace(/[^a-zA-Z0-9.\-_]/g, "_");
      const tmpPath = path.join(tmpDir, cleanName);
      fs.copyFileSync(filePath, tmpPath);

      console.log(`Subiendo: ${cleanName}...`);
      const uploadResult = await ai.files.upload({
        file: tmpPath,
        mimeType: 'application/pdf',
      });
      uploadedFiles.push(uploadResult);
    }
    
    console.log('Todos los archivos subidos. Analizando...');
    
    const prompt = `Actúa como un experto en pedagogía. 
Analiza detenidamente estos documentos sobre evaluación formativa y ejemplos de rúbricas.
Extrae un "Libro Blanco" o guía maestra (en formato Markdown) que contenga:
1. Las reglas de oro de la evaluación formativa según estos documentos.
2. Cómo deben estructurarse OBLIGATORIAMENTE las rúbricas (qué columnas/filas deben tener, cómo se redactan los niveles de desempeño).
3. 2 Ejemplos breves y clarificadores de rúbricas extraídas de los documentos (en formato tabla Markdown).

Este documento servirá como contexto base para una IA que debe generar rúbricas idénticas a las del centro. Sé conciso, directo y extremadamente riguroso con el formato. Escribe en castellano.`;

    const parts = uploadedFiles.map(f => ({
      fileData: { fileUri: f.uri, mimeType: f.mimeType }
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: [
        ...parts,
        { text: prompt }
      ]
    });
    
    const outputPath = path.join(process.cwd(), 'knowledge_base.md');
    fs.writeFileSync(outputPath, response.text!);
    console.log('✅ Conocimiento extraído y guardado en knowledge_base.md');
    
  } catch (error) {
    console.error('Error durante la extracción:', error);
  }
}

extractKnowledge();
