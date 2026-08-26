import { RA } from '../src/models/RA';
import fs from 'fs';
import path from 'path';

export async function up() {
  const anexoText = fs.readFileSync(path.join(process.cwd(), 'migrations', 'data', 'anexo8.txt'), 'utf-8');
  
  // Extract all RAs and their criteria using a better regex/parsing
  const rawSections = anexoText.split(/<p><strong>(Módulo profesional:.*?|Duración:.*?|3\. Enseñanzas.*?)<\/strong><\/p>/g);
  
  // We actually just need to parse sequentially
  const paragraphs = anexoText.split('</p><p>');
  
  let currentRaText = '';
  let currentCriteria = [];
  let inCriteriaBlock = false;
  
  const extracted = [];
  
  for (let p of paragraphs) {
    p = p.replace(/<[^>]+>/g, '').trim();
    if (!p) continue;
    
    // RA looks like: "1. Muestra una imagen personal y profesional adecuada..."
    if (p.match(/^[0-9]+\.\s+[A-Z]/) && p.length > 20) {
      if (currentRaText) {
        extracted.push({ text: currentRaText, criterios: currentCriteria });
      }
      currentRaText = p.replace(/^[0-9]+\.\s+/, '').trim();
      currentCriteria = [];
      inCriteriaBlock = false;
    } 
    else if (p.toLowerCase().includes('criterios de evaluación:')) {
      inCriteriaBlock = true;
    }
    else if (inCriteriaBlock && p.match(/^[a-z]\)/)) {
      currentCriteria.push(p);
    }
    else if (inCriteriaBlock && !p.match(/^[a-z]\)/) && p.length > 0) {
      if (p.includes('Duración:') || p.includes('Contenidos:')) {
        inCriteriaBlock = false;
      }
    }
  }
  if (currentRaText) {
    extracted.push({ text: currentRaText, criterios: currentCriteria });
  }

  // Criterios específicos para el Proyecto Intermodular (que no están en este anexo)
  const proyectoIntermodularCriteria = {
    "Busca información en internet sobre empresas «tipo» del sector": [
      "a) Se han definido las características de las empresas tipo del sector.",
      "b) Se han buscado empresas del sector con herramientas de internet.",
      "c) Se han contrastado los servicios o productos que ofrecen.",
      "d) Se ha elaborado un mapa de empresas tipo del sector."
    ],
    "Selecciona un servicio o producto de una empresa del sector relacionándolo con su contribución a los ODS": [
      "a) Se ha descrito el servicio o producto seleccionado.",
      "b) Se han analizado los ODS a los que puede contribuir la empresa.",
      "c) Se ha justificado la vinculación del servicio con los ODS."
    ],
    "Hace una propuesta de una empresa tipo «spin-off» indicando los aspectos diferenciales": [
      "a) Se han descrito las características principales de una empresa spin-off.",
      "b) Se han identificado las diferencias con la empresa de referencia.",
      "c) Se ha elaborado un dossier detallado con la propuesta."
    ],
    "Relaciona cada unidad de una empresa tipo con la prevención de riesgos profesionales": [
      "a) Se han identificado los riesgos profesionales por cada unidad de la empresa.",
      "b) Se han determinado los equipos de protección individual necesarios.",
      "c) Se han establecido los sistemas de protección general."
    ],
    "Transmite información con claridad de manera ordenada y estructurada": [
      "a) Se ha comunicado la información de forma clara.",
      "b) Se han utilizado herramientas adecuadas para la estructuración de la información."
    ]
  };

  // Update DB
  const ras = await RA.find();
  let updatedCount = 0;
  
  for (const ra of ras) {
    let matched = false;
    
    // Check if it's the intermodular project
    for (const [key, criteria] of Object.entries(proyectoIntermodularCriteria)) {
      if (ra.description_es.includes(key)) {
        ra.set('criterios_es', criteria);
        ra.set('criterios_ca', criteria); // Fallback for cat
        matched = true;
        break;
      }
    }
    
    if (!matched) {
      // Find in extracted
      const bestMatch = extracted.find(e => {
        // match start of description (first 30 chars)
        const prefix = e.text.substring(0, 30);
        return ra.description_es.includes(prefix) && e.criterios.length > 0;
      });
      
      if (bestMatch) {
        ra.set('criterios_es', bestMatch.criterios);
        ra.set('criterios_ca', bestMatch.criterios); // Assuming no translation for now, but at least AI has them
        matched = true;
      }
    }
    
    if (matched) {
      await ra.save();
      updatedCount++;
    }
  }
  
  console.log(`Se han actualizado ${updatedCount} RAs con sus criterios de evaluación correspondientes.`);
}
