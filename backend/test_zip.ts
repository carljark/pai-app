import fs from 'fs';
import AdmZip from 'adm-zip';
const zip = new AdmZip('../Ejemplos proyectos FP y ESO/elp/3A.2_-_Cambio_climtico_3ESO_LOGOS.elp');
const entries = zip.getEntries();
for (const entry of entries) {
    if (entry.entryName.endsWith('contentv3.xml')) {
        const text = entry.getData().toString('utf8');
        const matches = text.match(/<unicode value="([^"]+)">/g);
        if (matches) {
            let extracted = matches.map(m => m.replace(/<unicode value="/, '').replace(/">/, '')).join(' ');
            // now remove HTML entities and internal tags
            extracted = extracted.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/<[^>]+>/g, ' ');
            console.log(extracted.slice(0, 1000));
        }
    }
}
