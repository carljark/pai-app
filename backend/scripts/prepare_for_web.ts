import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';
import TurndownService from 'turndown';

const turndownService = new TurndownService();
const sourceDir = path.join(process.cwd(), '../Ejemplos proyectos FP y ESO');
const outDir = path.join(process.cwd(), 'src/data/raw_projects_txt');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.zip'));

console.log(`Encontrados ${files.length} proyectos SCORM. Extrayendo texto puro...`);

let processedCount = 0;

for (const file of files) {
  try {
    const zipPath = path.join(sourceDir, file);
    const zip = new AdmZip(zipPath);
    const zipEntries = zip.getEntries();
    
    let combinedHtml = '';

    zipEntries.forEach(entry => {
      // Filtrar solo archivos html que no sean menús o assets irrelevantes
      if (!entry.isDirectory && entry.entryName.endsWith('.html')) {
        const htmlContent = entry.getData().toString('utf8');
        combinedHtml += `\n\n--- Archivo: ${entry.entryName} ---\n\n`;
        combinedHtml += htmlContent;
      }
    });

    if (combinedHtml.trim().length > 0) {
      // Convertir HTML a Markdown para limpiarlo de etiquetas
      const markdown = turndownService.turndown(combinedHtml);
      const outFilename = file.replace('.zip', '.txt');
      const outPath = path.join(outDir, outFilename);
      
      fs.writeFileSync(outPath, markdown, 'utf8');
      console.log(`✅ Creado: ${outFilename}`);
      processedCount++;
    } else {
      console.log(`⚠️ Advertencia: No se encontró HTML en ${file}`);
    }

  } catch (error) {
    console.error(`❌ Error procesando ${file}:`, error);
  }
}

console.log(`\n¡Proceso terminado! Se generaron ${processedCount} archivos de texto en:`);
console.log(outDir);
console.log(`\nYa puedes arrastrar estos archivos a la web de Gemini.`);
