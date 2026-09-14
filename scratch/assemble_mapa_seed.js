const fs = require('fs');
const path = require('path');

const SEED_INPUT = path.resolve('scratch/seed_baa42bd.ts');
const SEED_TARGET = path.resolve('frontend/src/app/features/mapa-intermodular/data/mapa-intermodular.seed.ts');

console.log('Loading input seed from', SEED_INPUT);
const seedRaw = fs.readFileSync(SEED_INPUT, 'utf8');

const startIdx = seedRaw.indexOf('= [') + 2;
const endIdx = seedRaw.lastIndexOf(']');
const modules = JSON.parse(seedRaw.substring(startIdx, endIdx + 1));

const officialRas = JSON.parse(fs.readFileSync('scratch/official_ras_ca.json', 'utf8'));
const cache = JSON.parse(fs.readFileSync('scratch/translation_cache.json', 'utf8'));
const masterDict = JSON.parse(fs.readFileSync('scratch/master_dictionary.json', 'utf8'));

// Additional vocabulary mappings
Object.assign(masterDict, {
  "importancia": "importància",
  "sanitario": "sanitari", "sanitaria": "sanitària", "sanitarios": "sanitaris", "sanitarias": "sanitàries",
  "acondicionamiento": "condicionament",
  "desmaquillado": "desmaquillatge"
});

const MODULE_NAMES_CA = {
  "3060": "Preparació de l’entorn professional",
  "3061": "Cures estètiques bàsiques d’ungles",
  "3005": "Atenció al client",
  "3065": "Canvis de color del cabell",
  "3042": "Ciències aplicades II",
  "3009": "Ciències aplicades I",
  "3011": "Comunicació i societat I",
  "3012": "Comunicació i societat II",
  "3062": "Depilació mecànica i decoloració del pèl superflu",
  "3159": "Itinerari personal per a l’ocupabilitat",
  "3064": "Rentat i canvis de forma del cabell",
  "3063": "Maquillatge",
  "3067": "Formació en Centres de Treball (FCT)"
};

const PHRASE_REPLACEMENTS = [
  // Curricular connection titles
  [/Conexión curricular:\s*([0-9a-zA-Z\-]+)\s*↔\s*([0-9a-zA-Z\-]+)\s*\(([^)]+)\)/g, (match, p1, p2, p3) => {
    let targetCode = p2.slice(0, 4);
    let modNameCa = MODULE_NAMES_CA[targetCode] || p3;
    return `Connexió curricular: ${p1} ↔ ${p2} (${modNameCa})`;
  }],
  [/Conexión competencial y curricular entre los criterios de evaluación de ([^y]+) y el resto de módulos del ciclo formativo para garantizar una formación integral\./gi, 
   (match, p1) => {
     let modName = p1.trim();
     let modNameCa = modName;
     for (const [code, nameCa] of Object.entries(MODULE_NAMES_CA)) {
       if (modName.toLowerCase().includes(code) || modName.toLowerCase().includes(nameCa.toLowerCase().substring(0, 6))) {
         modNameCa = nameCa;
         break;
       }
     }
     return `Connexió competencial i curricular entre els criteris d'avaluació de ${modNameCa} i la resta de mòduls del cicle formatiu per a garantir una formació integral.`;
   }
  ],

  // Fixed Activity & DUA formula phrases
  [/Reto práctico motivador conectado con situaciones reales del salón y ([^.]+)/gi, "Repte pràctic motivador connectat amb situacions reals del saló i $1"],
  [/Reto práctico aplicable directamente a la profesión y entorno real de ([^.]+)/gi, "Repte pràctic aplicable directament a la professió i entorn real de $1"],
  [/Ficha de trabajo, rúbrica de ejecución y producto demostrativo de ([^.]+)/gi, "Fitxa de treball, rúbrica d'execució i producte demostratiu de $1"],
  [/Rúbrica visual y producto de evaluación formativa\./gi, "Rúbrica visual i producte d'avaluació formativa."],
  [/Rúbrica visual y producto de evaluación formativa/gi, "Rúbrica visual i producte d'avaluació formativa"],
  [/vídeo interno o demostración en clase con rúbrica de acogida\./gi, "Vídeo intern o demostració a classe amb rúbrica d'acollida."],
  [/Medidas DUA con apoyos visuales y lectura fácil\./gi, "Mesures DUA amb suports visuals i lectura fàcil."],
  [/Medidas DUA con lectura fácil y apoyos visuales\./gi, "Mesures DUA amb lectura fàcil i suports visuals."],
  [/Instrucciones visuales, apoyos pautados y trabajo en parejas\./gi, "Instruccions visuals, suports pautats i treball en parelles."],
  [/Instrucciones visuales, apoyos pautados y trabajo en parejas/gi, "Instruccions visuals, suports pautats i treball en parelles"],
  [/Instrucciones visuales paso a paso, modelado previo por el docente, lectura fácil y trabajo en parejas\./gi, "Instruccions visuals pas a pas, modelatge previ pel docent, lectura fàcil i treball en parelles."],
  [/Instrucciones visuales paso a paso, modelado previo del docente, roles cooperativos y lectura fácil\./gi, "Instruccions visuals pas a pas, modelatge previ del docent, rols cooperatius i lectura fàcil."],
  [/Problemas graduados por dificultad, banco de operaciones, apoyo visual y exposición opcional en pareja\./gi, "Problemes graduats per dificultat, banc d'operacions, suport visual i exposició opcional en parella."],
  [/Fuentes seleccionadas, lectura fácil, imágenes, roles, plantilla de cartel y exposición breve en pareja\./gi, "Fonts seleccionades, lectura fàcil, imatges, rols, plantilla de cartell i exposició breu en parella."],

  // Passive criteria formulas
  [/^([a-z]\))\s*Se ha\b/gi, "$1 S'ha"],
  [/^([a-z]\))\s*Se han\b/gi, "$1 S'han"],
  [/\bse ha\b/gi, "s'ha"],
  [/\bse han\b/gi, "s'han"],

  // Section labels inside text
  [/Contexto \/ idea motivadora:/gi, "Context / idea motivadora:"],
  [/Contexto \/ Idea motivadora:/gi, "Context / Idea motivadora:"],
  [/Producto \/ evidencia:/gi, "Producte / evidència:"],
  [/Producto \/ Evidencia:/gi, "Producte / Evidència:"],
  [/Producto final:/gi, "Producte final:"],
  [/Objetivo:/gi, "Objectiu:"],
  [/Desarrollo:/gi, "Desenvolupament:"],
  [/Evaluación:/gi, "Avaluació:"],
  [/Aprendizajes y criterios evaluables:/gi, "Aprenentatges i criteris avaluables:"],
  [/Aprendizajes y Diversidad FPB:/gi, "Aprenentatges i Diversitat FPB:"],
  [/Ayudas \/ pautas DUA:/gi, "Ajudes / pautes DUA:"],

  // Common collocations
  [/\bel alumnado\b/gi, "l'alumnat"],
  [/\balumnado\b/gi, "alumnat"],
  [/\baula-taller\b/gi, "aula taller"],
  [/\baula taller\b/gi, "aula taller"],
  [/\ben el aula-taller\b/gi, "a l'aula taller"],
  [/\ben el aula taller\b/gi, "a l'aula taller"],
  [/\bdel aula-taller\b/gi, "de l'aula taller"],
  [/\bdel aula taller\b/gi, "de l'aula taller"],
  [/\bsalón de peluquería\b/gi, "saló de perruqueria"],
  [/\bsalón de belleza\b/gi, "saló de bellesa"],
  [/\bcuero cabelludo\b/gi, "cuir cabellut"],
  [/\bcuidados estéticos\b/gi, "cures estètiques"],
  [/\bde un solo uso\b/gi, "d'un sol ús"],
  [/\bun solo uso\b/gi, "un sol ús"],
  [/\blectura fácil\b/gi, "lectura fàcil"],
  [/\bapoyos visuales\b/gi, "suports visuals"],
  [/\bapoyo visual\b/gi, "suport visual"],
  [/\bapoyos pautados\b/gi, "suports pautats"],
  [/\binstrucciones visuales\b/gi, "instruccions visuals"],
  [/\btrabajo en parejas\b/gi, "treball en parelles"],
  [/\btrabajo en equipo\b/gi, "treball en equip"],
  [/\btrabajo colaborativo\b/gi, "treball col·laboratiu"],
  [/\bpor parejas\b/gi, "per parelles"],
  [/\ben parejas\b/gi, "en parelles"],
  [/\ben pareja\b/gi, "en parella"],
  [/\bpor equipos\b/gi, "per equips"],
  [/\ben equipo\b/gi, "en equip"],
  [/\broles cooperativos\b/gi, "rols cooperatius"],
  [/\bevaluación formativa\b/gi, "avaluació formativa"],
  [/\brúbrica visual\b/gi, "rúbrica visual"],
  [/\bproducto final\b/gi, "producte final"],
  [/\bsituaciones reales\b/gi, "situacions reals"],
  [/\bsituación de aprendizaje\b/gi, "situació d'aprenentatge"],
  [/\bsituaciones de aprendizaje\b/gi, "situacions d'aprenentatge"],
  [/\bpaso a paso\b/gi, "pas a pas"],
  [/\bficha de trabajo\b/gi, "fitxa de treball"],
  [/\bhoja de trabajo\b/gi, "full de treball"],
  [/\bficha de cliente\b/gi, "fitxa de client"],
  [/\bficha técnica\b/gi, "fitxa tècnica"],
  [/\blista de cotejo\b/gi, "llista de control"],
  [/\bbanco de operaciones\b/gi, "banc d'operacions"],
  [/\bbanco de palabras\b/gi, "banc de paraules"],
  [/\blluvia de ideas\b/gi, "pluja d'idees"],
  [/\bjuego de rol\b/gi, "joc de rol"],
  [/\bjuego de roles\b/gi, "joc de rols"],
  [/\bmarca personal\b/gi, "marca personal"],
  [/\bredes sociales\b/gi, "xarxes socials"],
  [/\bimagen personal y profesional\b/gi, "imatge personal i professional"],
  [/\bimagen personal\b/gi, "imatge personal"],
  [/\bimagen profesional\b/gi, "imatge professional"],
  [/\bprevención de riesgos laborales\b/gi, "prevenció de riscos laborals"],
  [/\bdeontología profesional\b/gi, "deontologia professional"],
  [/\bseguridad e higiene\b/gi, "seguretat i higiene"],
  [/\bhigiene y seguridad\b/gi, "higiene i seguretat"],
  [/\bmedio ambiente\b/gi, "medi ambient"],
  [/\ba través de\b/gi, "a través de"],
  [/\ben función de\b/gi, "en funció de"],
  [/\bteniendo en cuenta\b/gi, "tenint en compte"],
  [/\bantes de\b/gi, "abans de"],
  [/\bdespués de\b/gi, "després de"],
  [/\ben caso de\b/gi, "en cas de"],
  [/\blenguaje inclusivo\b/gi, "llenguatge inclusiu"],
  [/\bprueba de tolerancia\b/gi, "prova de tolerància"]
];

function translateText(text) {
  if (!text || typeof text !== 'string') return text;
  let res = text;

  // Protect idioms
  res = res.replace(/Get ready with me/gi, "__GRWM__");

  // 1. Phrase replacements
  for (const [re, rep] of PHRASE_REPLACEMENTS) {
    res = res.replace(re, rep);
  }

  // 2. Tokenize words and replace
  const tokens = res.split(/([a-zA-ZáéíóúñüÁÉÍÓÚÑÜ]+)/);
  for (let i = 1; i < tokens.length; i += 2) {
    const word = tokens[i];
    const lower = word.toLowerCase();

    let replacement = null;
    if (masterDict[lower]) {
      replacement = masterDict[lower];
    } else {
      // Suffix rules
      if (lower.endsWith("ción")) replacement = lower.slice(0, -4) + "ció";
      else if (lower.endsWith("ciones")) replacement = lower.slice(0, -6) + "cions";
      else if (lower.endsWith("sión")) replacement = lower.slice(0, -4) + "sió";
      else if (lower.endsWith("siones")) replacement = lower.slice(0, -6) + "sions";
      else if (lower.endsWith("dad")) replacement = lower.slice(0, -3) + "tat";
      else if (lower.endsWith("dades")) replacement = lower.slice(0, -5) + "tats";
      else if (lower.endsWith("mente")) replacement = lower.slice(0, -5) + "ment";
      else if (lower.endsWith("miento")) replacement = lower.slice(0, -6) + "ment";
      else if (lower.endsWith("mientos")) replacement = lower.slice(0, -7) + "ments";
      else if (lower.endsWith("aje")) replacement = lower.slice(0, -3) + "atge";
      else if (lower.endsWith("ajes")) replacement = lower.slice(0, -4) + "atges";
      else if (lower.endsWith("ivo")) replacement = lower.slice(0, -3) + "iu";
      else if (lower.endsWith("iva")) replacement = lower.slice(0, -3) + "iva";
      else if (lower.endsWith("ivos")) replacement = lower.slice(0, -4) + "ius";
      else if (lower.endsWith("ivas")) replacement = lower.slice(0, -4) + "ives";
      else if (lower.endsWith("ico")) replacement = lower.slice(0, -3) + "ic";
      else if (lower.endsWith("ica")) replacement = lower.slice(0, -3) + "ica";
      else if (lower.endsWith("icos")) replacement = lower.slice(0, -4) + "ics";
      else if (lower.endsWith("icas")) replacement = lower.slice(0, -4) + "iques";
      else if (lower.endsWith("ales")) replacement = lower.slice(0, -4) + "als";
      else if (lower.endsWith("ares")) replacement = lower.slice(0, -4) + "ars";
      else if (lower.endsWith("entes")) replacement = lower.slice(0, -5) + "ents";
      else if (lower.endsWith("antes")) replacement = lower.slice(0, -5) + "ants";
      else if (lower.endsWith("istas")) replacement = lower.slice(0, -5) + "istes";
      else if (lower.endsWith("ores")) replacement = lower.slice(0, -4) + "ors";
      else if (lower.endsWith("ado")) replacement = lower.slice(0, -3) + "at";
      else if (lower.endsWith("ada")) replacement = lower.slice(0, -3) + "ada";
      else if (lower.endsWith("ados")) replacement = lower.slice(0, -4) + "ats";
      else if (lower.endsWith("adas")) replacement = lower.slice(0, -4) + "ades";
      else if (lower.endsWith("ido")) replacement = lower.slice(0, -3) + "it";
      else if (lower.endsWith("ida")) replacement = lower.slice(0, -3) + "ida";
      else if (lower.endsWith("idos")) replacement = lower.slice(0, -4) + "its";
      else if (lower.endsWith("idas")) replacement = lower.slice(0, -4) + "ides";
      else if (lower.endsWith("ando")) replacement = lower.slice(0, -4) + "ant";
      else if (lower.endsWith("iendo")) replacement = lower.slice(0, -5) + "int";
    }

    if (replacement) {
      if (word === word.toUpperCase() && word.length > 1) {
        replacement = replacement.toUpperCase();
      } else if (word[0] === word[0].toUpperCase()) {
        replacement = replacement[0].toUpperCase() + replacement.slice(1);
      }
      tokens[i] = replacement;
    }
  }
  res = tokens.join('');

  // 3. Orthographic cleanups
  res = res.replace(/__GRWM__/g, "Get ready with me");

  // de + vowel/h -> d'
  res = res.replace(/\bde\s+([aeiouhAEIOUHÀÈÉÍÒÓÚàèéíòóú])/g, "d'$1");
  res = res.replace(/\bDe\s+([aeiouhAEIOUHÀÈÉÍÒÓÚàèéíòóú])/g, "D'$1");
  // a + el -> al
  res = res.replace(/\ba\s+el\b/g, "al");
  res = res.replace(/\bA\s+el\b/g, "Al");
  // a + els -> als
  res = res.replace(/\ba\s+els\b/g, "als");
  res = res.replace(/\bA\s+els\b/g, "Als");
  // de + el -> del
  res = res.replace(/\bde\s+el\b/g, "del");
  res = res.replace(/\bDe\s+el\b/g, "Del");
  // de + els -> dels
  res = res.replace(/\bde\s+els\b/g, "dels");
  res = res.replace(/\bDe\s+els\b/g, "Dels");
  // d'els -> dels
  res = res.replace(/\bd'els\b/g, "dels");
  res = res.replace(/\bD'els\b/g, "Dels");
  // d'el -> del
  res = res.replace(/\bd'el\b/g, "del");
  res = res.replace(/\bD'el\b/g, "Del");
  // per + el -> pel
  res = res.replace(/\bper\s+el\b/g, "pel");
  res = res.replace(/\bPer\s+el\b/g, "Pel");
  // per + els -> pels
  res = res.replace(/\bper\s+els\b/g, "pels");
  res = res.replace(/\bPer\s+els\b/g, "Pels");
  // el/la + vowel/h -> l'
  res = res.replace(/\bel\s+([aeiouhAEIOUHÀÈÉÍÒÓÚàèéíòóú])/g, "l'$1");
  res = res.replace(/\bEl\s+([aeiouhAEIOUHÀÈÉÍÒÓÚàèéíòóú])/g, "L'$1");
  res = res.replace(/\bla\s+([aeiouAEIOUÀÈÉÍÒÓÚàèéíòóú])/g, "l'$1");
  res = res.replace(/\bLa\s+([aeiouAEIOUÀÈÉÍÒÓÚàèéíòóú])/g, "L'$1");
  // se + vowel/h -> s'
  res = res.replace(/\bse\s+([aeiouhAEIOUHÀÈÉÍÒÓÚàèéíòóú])/g, "s'$1");
  res = res.replace(/\bSe\s+([aeiouhAEIOUHÀÈÉÍÒÓÚàèéíòóú])/g, "S'$1");
  // Fix double spaces
  res = res.replace(/\s+/g, ' ').trim();

  return res;
}

console.log('Processing modules, learning outcomes, connections, and activities from seed_baa42bd...');
const actCache = new Map();
let totalRAs = 0;
let totalCriteria = 0;
let totalConnections = 0;
let totalActivities = 0;

modules.forEach(m => {
  if (MODULE_NAMES_CA[m.code]) {
    m.name_ca = MODULE_NAMES_CA[m.code];
  }

  m.learningOutcomes.forEach(ra => {
    totalRAs++;
    const raKey = `${m.code}_${ra.code}`;
    if (officialRas[raKey]) {
      ra.text_ca = officialRas[raKey];
    } else {
      ra.text_ca = translateText(ra.text_es);
    }

    if (ra.criteria_es && Array.isArray(ra.criteria_es)) {
      ra.criteria_ca = ra.criteria_es.map(crit => {
        totalCriteria++;
        if (cache.criteria && cache.criteria[crit]) {
          return cache.criteria[crit];
        }
        return translateText(crit);
      });
    }

    if (ra.connections && Array.isArray(ra.connections)) {
      ra.connections.forEach(c => {
        totalConnections++;
        const targetRaKey = `${c.targetModuleCode}_${c.targetRaCode}`;
        if (officialRas[targetRaKey]) {
          c.targetRaText_ca = officialRas[targetRaKey];
        } else if (c.targetRaText_es) {
          c.targetRaText_ca = translateText(c.targetRaText_es);
        }

        if (MODULE_NAMES_CA[c.targetModuleCode]) {
          c.targetModuleName_ca = MODULE_NAMES_CA[c.targetModuleCode];
        }

        const connKey = `${c.title_es}|||${c.justification_es}`;
        if (cache.connections && cache.connections[connKey]) {
          c.title_ca = cache.connections[connKey].title_ca;
          c.justification_ca = cache.connections[connKey].justification_ca;
        } else {
          c.title_ca = translateText(c.title_es);
          c.justification_ca = translateText(c.justification_es);
        }

        if (c.relatedCriteria && Array.isArray(c.relatedCriteria)) {
          c.relatedCriteria.forEach(rc => {
            if (MODULE_NAMES_CA[rc.moduleCode]) {
              rc.moduleName_ca = MODULE_NAMES_CA[rc.moduleCode];
            }
          });
        }

        if (c.activities && Array.isArray(c.activities)) {
          c.activities.forEach(a => {
            totalActivities++;
            if (actCache.has(a.id)) {
              const cached = actCache.get(a.id);
              a.title_ca = cached.title_ca;
              a.motivatingFactor_ca = cached.motivatingFactor_ca;
              a.description_ca = cached.description_ca;
              a.evidence_ca = cached.evidence_ca;
              a.diversitySupport_ca = cached.diversitySupport_ca;
            } else {
              a.title_ca = translateText(a.title_es);
              a.motivatingFactor_ca = a.motivatingFactor_es ? translateText(a.motivatingFactor_es) : "";
              a.description_ca = translateText(a.description_es);
              a.evidence_ca = translateText(a.evidence_es);
              a.diversitySupport_ca = translateText(a.diversitySupport_es);
              actCache.set(a.id, {
                title_ca: a.title_ca,
                motivatingFactor_ca: a.motivatingFactor_ca,
                description_ca: a.description_ca,
                evidence_ca: a.evidence_ca,
                diversitySupport_ca: a.diversitySupport_ca
              });
            }
          });
        }
      });
    }
  });
});

console.log(`Summary of updated elements:
- Modules: ${modules.length}
- Learning Outcomes (RAs): ${totalRAs}
- Criteria: ${totalCriteria}
- Connections: ${totalConnections}
- Activity instances: ${totalActivities} (Unique: ${actCache.size})
`);

const outputTs = `import { FPBModule } from '../models/mapa-intermodular.model';

/**
 * Seed data oficial con los 11 módulos de FPB Peluquería y Estética,
 * criterios de evaluación implicados, criterios relacionados de otros módulos,
 * justificaciones pedagógicas y actividades prácticas desarrolladas.
 */
export const FPB_MODULES_SEED: FPBModule[] = ${JSON.stringify(modules, null, 2)};
`;

fs.writeFileSync(SEED_TARGET, outputTs, 'utf8');
console.log('Successfully written updated seed to', SEED_TARGET);
