import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(process.cwd(), '.env') });
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const BASE_DIR = path.resolve(process.cwd(), '../Ejemplos proyectos FP y ESO');
const OUTPUT_FILE = path.resolve(process.cwd(), 'src/data/intef_examples.json');

function getFiles(dir: string, extensions: string[]): string[] {
    let results: string[] = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(getFiles(file, extensions));
        } else if (extensions.some(ext => file.endsWith(ext))) {
            results.push(file);
        }
    });
    return results;
}

async function extractTextFromZip(zipPath: string): Promise<string> {
    try {
        const zip = new AdmZip(zipPath);
        const zipEntries = zip.getEntries();
        for (const entry of zipEntries) {
            if (entry.entryName.endsWith('contentv3.xml') || entry.entryName.endsWith('content.xml')) {
                const xmlData = entry.getData().toString('utf8');
                
                // eXeLearning guarda el texto en atributos value="" de nodos unicode o string
                // Para evitar comerse la RAM con regex complejas, buscamos value="...":
                let extracted = '';
                
                // Buscamos value="..." 
                const matches = xmlData.match(/<unicode[^>]*value="([^"]+)"/g) || [];
                if (matches.length > 0) {
                    extracted = matches.map(m => m.replace(/<unicode[^>]*value="/, '').replace(/"$/, '')).join(' ');
                }
                
                // Además buscamos CDATA u otros nodos
                const cdataMatches = xmlData.match(/<!\[CDATA\[(.*?)\]\]>/gs) || [];
                if (cdataMatches.length > 0) {
                    extracted += " " + cdataMatches.map(m => m.replace(/<!\[CDATA\[/, '').replace(/\]\]>/, '')).join(' ');
                }

                const cleanText = extracted
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '"')
                    .replace(/&amp;/g, '&')
                    .replace(/<[^>]+>/g, ' ') // Strip inner HTML tags
                    .replace(/\s+/g, ' ')
                    .trim();
                
                // Tomamos todo el texto sin límite tal y como solicitó el usuario
                return cleanText;
            }
        }
    } catch(e) {
        console.error("  -> AdmZip error en", path.basename(zipPath));
    }
    return '';
}

async function processFiles() {
    const allFiles = getFiles(BASE_DIR, ['.zip', '.elp']);
    console.log(`Encontrados ${allFiles.length} proyectos para analizar de manera inteligente...`);
    
    // Cargar los que ya existen para no re-procesar (optimización temporal)
    let examples: any[] = [];
    try {
        // examples = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
    } catch(e) {}
    
    const existingTitles = new Set(examples.map((e: any) => e.title));

    let count = 1;
    for (const file of allFiles) {
        const filename = path.basename(file);
        console.log(`\n[${count}/${allFiles.length}] Procesando ${filename}...`);
        count++;
        
        try {
            const rawText = await extractTextFromZip(file);
            if (!rawText || rawText.trim().length < 500) {
                console.log(`  -> Saltando ${filename}: No hay contenido texto suficiente.`);
                continue;
            }

            const prompt = `
Eres un experto en diseño instruccional y metodologías activas (ABP, ABR, ApS).
Tienes el texto extraído de un proyecto educativo del INTEF. A veces puede contener texto cortado o palabras sueltas de HTML.
Tu objetivo es ignorar la burocracia, índices o palabras sueltas, y extraer EXCLUSIVAMENTE "la carne", lo que aporta creatividad al aula.
Busca las actividades concretas, los retos, y el trabajo de campo.

- Título del proyecto (si lo encuentras, si no, inventa uno basado en el contenido).
- Las actividades más creativas que se piden a los alumnos.
- Las dinámicas de grupo o metodologías prácticas empleadas.
- El producto final o reto propuesto.

Devuelve tu respuesta en el siguiente formato JSON estricto, sin markdown adicional, sin bloques de código:
{
  "title": "Título del proyecto",
  "description": "Breve frase del objetivo.",
  "content_sample": "Resumen detallado (300-600 chars) destacando SOLO actividades creativas, producto final y rol del alumno. Inspirador."
}

Texto del proyecto (parcial):
${rawText}
            `;
            const response = await ai.models.generateContent({
                model: 'gemini-3.6-flash',
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });
            if (response.text) {
                const jsonResp = JSON.parse(response.text);
                examples.push(jsonResp);
                console.log(`  -> ¡Éxito! Título: ${jsonResp.title}`);
                fs.writeFileSync(OUTPUT_FILE, JSON.stringify(examples, null, 2));
            }
        } catch (error: any) {
            console.error(`  -> ERROR procesando ${filename}:`, error.message);
            // Delay for rate limiting
            await new Promise(r => setTimeout(r, 2000));
        }
    }
    console.log(`\n✅ Finalizado. ${examples.length} proyectos guardados en intef_examples.json`);
}

processFiles();
