const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('curriculums/anexo8.txt', 'utf8');
const $ = cheerio.load(html);

const results = [];
let currentModule = null;
let currentRA = null;
let inCriteria = false;
let currentCriteriaList = [];

// The document seems to have <p><strong>Módulo profesional: ...</strong></p>
// <p>Resultados de aprendizaje y criterios de evaluación.</p>
// <p>1. Busca información...</p>
// <p>Criterios de evaluación:</p>
// <p>a) ...</p>

const elements = $('body').children();

for (let i = 0; i < elements.length; i++) {
    const el = elements.eq(i);
    const text = el.text().trim();
    
    if (text.startsWith('Módulo profesional:')) {
        currentModule = text.replace('Módulo profesional:', '').trim();
    } 
    else if (text.match(/^[0-9]+\.\s/)) {
        // Posible RA
        if (currentRA) {
            results.push({ module: currentModule, ra: currentRA, criterios: currentCriteriaList });
        }
        currentRA = text;
        currentCriteriaList = [];
        inCriteria = false;
    }
    else if (text.toLowerCase() === 'criterios de evaluación:') {
        inCriteria = true;
    }
    else if (inCriteria && text.match(/^[a-z]\)/)) {
        currentCriteriaList.push(text);
    }
    else if (inCriteria && !text.match(/^[a-z]\)/) && text.length > 0) {
        // If it's a short text or doesn't match, maybe the criteria block ended
        // But some letters could be multiple paragraphs?
        if (text.startsWith('Duración:') || text.startsWith('Contenidos:')) {
            inCriteria = false;
        }
    }
}
if (currentRA) {
    results.push({ module: currentModule, ra: currentRA, criterios: currentCriteriaList });
}

fs.writeFileSync('extract.json', JSON.stringify(results, null, 2));
console.log('Extracted ' + results.length + ' RAs');
