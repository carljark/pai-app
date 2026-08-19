import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';

// Asegurarse de tener la API KEY configurada en el entorno
const ai = new GoogleGenAI({});

async function extractFromPDF(filePath: string, area: string) {
    const fileName = path.basename(filePath);
    console.log(`⏳ Analizando ${fileName}...`);
    
    let retries = 0;
    while (retries < 3) {
        try {
            const fileBytes = fs.readFileSync(filePath);
            
            const prompt = `Analiza este documento PDF oficial que contiene el currículo de una asignatura.
            
            OBJETIVO:
            Extraer TODAS las "Competencias Específicas" (CE) y sus correspondientes "Criterios de Evaluación" vinculados, PERO ÚNICAMENTE los que corresponden a los cursos de 3º y 4º de la ESO.
            
            INSTRUCCIONES DE SALIDA:
            Devuelve la información OBLIGATORIAMENTE en formato JSON puro. Debe ser un array de objetos con esta estructura exacta:
            [
              {
                "area": "${area}",
                "subject": "(El nombre exacto de la asignatura según el documento)",
                "ce_id": "(Identificador corto, ej. CE.1)",
                "description": "(Texto completo de la competencia específica)",
                "criterios": [
                  {
                    "criterio_id": "(ej. 1.1)",
                    "description": "(Texto del criterio de evaluación de 3º o 4º ESO)"
                  }
                ]
              }
            ]
            
            Si no encuentras información explícita para 3º y 4º de la ESO, devuelve un array vacío [].
            NO devuelvas texto conversacional ni bloques de markdown. Solo el array JSON válido.`;

            const response = await ai.models.generateContent({
                model: 'gemini-3.6-flash',
                contents: [
                    {
                        inlineData: {
                            data: fileBytes.toString("base64"),
                            mimeType: "application/pdf"
                        }
                    },
                    prompt
                ],
                config: {
                    responseMimeType: "application/json"
                }
            });

            const jsonStr = response.text || "[]";
            return JSON.parse(jsonStr);
        } catch (err: any) {
            console.error(`⚠️ Error procesando ${fileName} (Intento ${retries + 1}/3):`, err.message);
            retries++;
            if (retries >= 3) {
                console.error(`❌ Fallo definitivo con ${fileName}`);
                return [];
            }
            // Esperar 10 segundos antes de reintentar
            await new Promise(resolve => setTimeout(resolve, 10000));
        }
    }
    return [];
}

async function main() {
    const baseDir = path.resolve(process.cwd(), '../Proyecto_FPB_PAI/ESO');
    
    const folders = [
        { dir: 'Curriculum Area Ciencias y Matemáticas ', area: 'Ámbito Científico y Tecnológico' },
        { dir: 'Curriculum Area Sociedad y Lengua', area: 'Ámbito Sociolingüístico' }
    ];

    let allCompetencies = [];

    for (const folder of folders) {
        const folderPath = path.join(baseDir, folder.dir);
        if (!fs.existsSync(folderPath)) {
            console.log(`No se encontró la carpeta: ${folderPath}`);
            continue;
        }

        const files = fs.readdirSync(folderPath).filter(f => f.toLowerCase().endsWith('.pdf'));
        for (const file of files) {
            const filePath = path.join(folderPath, file);
            const results = await extractFromPDF(filePath, folder.area);
            if (results && results.length > 0) {
                console.log(`✅ Extraídas ${results.length} competencias de ${file}`);
                allCompetencies = allCompetencies.concat(results);
            } else {
                console.log(`⚠️ No se encontraron competencias para 3º/4º en ${file}`);
            }
        }
    }

    const outputPath = path.resolve(process.cwd(), 'ces_eso.json');
    fs.writeFileSync(outputPath, JSON.stringify(allCompetencies, null, 2));
    console.log(`\n🎉 Proceso completado. Datos guardados en: ${outputPath}`);
}

main();
