const fs = require('fs');
const path = require('path');
const { CFGM_PELUQUERIA_RAS_DATA } = require('../backend/src/data/ras_cfgm_peluqueria.data.ts');

const DIR = path.resolve('add_mid_grades/Grado medio peluqueria/Mapa GM Peluqueria');

// 1. Build lookup maps for all RAs and Criteria from official curriculum
const ceMap = new Map();
const raMap = new Map();

for (const r of CFGM_PELUQUERIA_RAS_DATA) {
  const raNum = r.id.replace(/\D/g, '');
  const raKey = `${r.moduleCode}-RA${raNum}`;
  raMap.set(raKey, {
    id: `${r.moduleCode}_RA${raNum}`,
    code: `RA${raNum}`,
    text_es: r.description_es || r.description,
    text_ca: r.description_ca || r.description,
    moduleCode: r.moduleCode,
    moduleName_es: r.module_es,
    moduleName_ca: r.module_ca
  });

  const ces_es = r.criterios_es || r.criterios || [];
  const ces_ca = r.criterios_ca || r.criterios || [];

  for (let i = 0; i < ces_es.length; i++) {
    const text_es = ces_es[i];
    const text_ca = ces_ca[i] || text_es;
    const letterMatch = text_es.match(/^([a-z])[\)\.]/i);
    if (letterMatch) {
      const letter = letterMatch[1].toLowerCase();
      const fullCe = `${r.moduleCode}-${raNum}${letter}`;
      ceMap.set(fullCe, {
        code: fullCe,
        letter,
        raNum,
        raCode: `RA${raNum}`,
        moduleCode: r.moduleCode,
        moduleName_es: r.module_es,
        moduleName_ca: r.module_ca,
        text_es,
        text_ca
      });
    }
  }
}

function normalizeCeCode(code) {
  if (!code) return code;
  if (code.startsWith('1710-')) {
    const m = code.match(/^1710-([1-5])(\d+)$/);
    if (m) {
      const ra = m[1];
      const num = parseInt(m[2], 10);
      if (ra === '4') {
        if (num <= 7) {
          const letters = 'abcdefg';
          return `1710-4${letters[num - 1]}`;
        } else if (num === 8 || num === 9) {
          return '1710-4h';
        } else if (num === 10) {
          return '1710-4i';
        }
      }
      const letters = 'abcdefghijklmnopqrstuvwxyz';
      return `1710-${ra}${letters[num - 1]}`;
    }
  }
  return code;
}

// 2. Parser function for activities in a markdown file
function parseActivitiesFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const ceSections = content.split(/\n### CE \d+\.\s+/);
  const activitiesByCe = new Map(); // ceCode -> array of activities

  for (let i = 1; i < ceSections.length; i++) {
    const sec = ceSections[i];
    const lines = sec.split('\n');
    const headerLine = lines[0].trim();
    const ownCeMatch = headerLine.match(/^([0-9]{4}-[0-9]+[a-z0-9]*)/);
    if (!ownCeMatch) continue;
    const rawCeCode = ownCeMatch[1];
    const ownCeCode = normalizeCeCode(rawCeCode);

    const actChunks = sec.split(/\n#### (?:Actividad|Activitat) \d+\.\s+/);
    const acts = [];
    for (let j = 1; j < actChunks.length; j++) {
      const actSec = actChunks[j];
      const actLines = actSec.split('\n');
      const title = actLines[0].trim();

      const getField = (prefix) => {
        const regex = new RegExp(`^-\\s*\\*\\*${prefix}:\\*\\*\\s*(.*)$`, 'i');
        const line = actLines.find(l => regex.test(l.trim()));
        if (!line) return '';
        return line.match(regex)[1].trim();
      };

      const extCes = [];
      const extMatch = actSec.match(/-\s*\*\*(?:CE externos combinados|CE externs combinats):\*\*([\s\S]*?)(?=\n-\s*\*\*)/i);
      if (extMatch) {
        const extLines = extMatch[1].split('\n').map(l => l.trim()).filter(l => l.startsWith('-'));
        for (const el of extLines) {
          const ceM = el.match(/\*\*([0-9]{4}-[0-9]+[a-z])/);
          if (ceM) extCes.push(ceM[1]);
        }
      }

      acts.push({
        ownCeCode,
        title,
        motivatingFactor: getField('(?:Contexto \\/ idea motivadora|Context \\/ idea motivadora)'),
        ownCeEvaluated: getField('(?:CE propio evaluado|CE propi avaluat)'),
        extCes,
        methodology: getField('(?:Metodología activa|Metodologia activa)'),
        description: getField('(?:Desarrollo práctico|Desenvolupament pràctic)'),
        evidence: getField('(?:Producto \\/ evidencia|Producte \\/ evidència)'),
        learnings: getField('(?:Aprendizajes y criterios evaluables|Aprenentatges i criteris avaluables)'),
        evaluation: getField('(?:Evaluación|Avaluació)'),
        diversitySupport: getField('(?:Ayudas \\/ pautas DUA|Ajudes \\/ pautes DUA)')
      });
    }
    activitiesByCe.set(ownCeCode, acts);
  }
  return activitiesByCe;
}

// 3. Competence Type Resolver
function getRelationType(targetModCode) {
  if (targetModCode === '0156') return 'comunicacion';
  if (targetModCode === '1664') return 'digital';
  if (targetModCode === '1709' || targetModCode === '1710') return 'empleabilidad';
  if (targetModCode === '1708') return 'sostenibilidad';
  if (targetModCode === '0643') return 'cliente';
  return 'tecnica';
}

// 4. Module metadata
const MODULE_METADATA_1 = [
  { code: '0842', name_es: 'Peinados y recogidos', name_ca: 'Pentinats i recollits', type: 'especifico', color: '#fb923c', icon: 'sparkles' },
  { code: '0845', name_es: 'Técnicas de corte del cabello', name_ca: 'Tècniques de tall de cabells', type: 'especifico', color: '#f87171', icon: 'scissors' },
  { code: '0844', name_es: 'Cosmética para peluquería', name_ca: 'Cosmètica per a perruqueria', type: 'especifico', color: '#c084fc', icon: 'flask-conical' },
  { code: '0846', name_es: 'Cambios de forma permanente del cabello', name_ca: 'Canvis de forma permanent del cabell', type: 'especifico', color: '#f472b6', icon: 'waves' },
  { code: '0849', name_es: 'Análisis capilar', name_ca: 'Anàlisi capil·lar', type: 'especifico', color: '#38bdf8', icon: 'microscope' },
  { code: '1664', name_es: 'Digitalización aplicada a los sectores productivos', name_ca: 'Digitalització aplicada als sectors productius', type: 'comun', color: '#4ade80', icon: 'binary' },
  { code: '1709', name_es: 'Itinerario personal para la empleabilidad I', name_ca: 'Itinerari personal per a l’ocupabilitat I', type: 'comun', color: '#fbbf24', icon: 'briefcase' },
  { code: '0156', name_es: 'Inglés profesional', name_ca: 'Anglès professional', type: 'comun', color: '#60a5fa', icon: 'languages' }
];

const MODULE_METADATA_2 = [
  { code: '0640', name_es: 'Imagen corporal y hábitos saludables', name_ca: 'Imatge corporal i hàbits saludables', type: 'especifico', color: '#34d399', icon: 'heart-pulse' },
  { code: '0643', name_es: 'Marketing y venta en imagen personal', name_ca: 'Màrqueting i venda en imatge personal', type: 'especifico', color: '#a78bfa', icon: 'badge-percent' },
  { code: '0843', name_es: 'Coloración capilar', name_ca: 'Coloració capil·lar', type: 'especifico', color: '#f43f5e', icon: 'palette' },
  { code: '0848', name_es: 'Peluquería y estilismo masculino', name_ca: 'Perruqueria i estilisme masculí', type: 'especifico', color: '#3b82f6', icon: 'user-check' },
  { code: '0636', name_es: 'Estética de manos y pies', name_ca: 'Estètica de mans i peus', type: 'especifico', color: '#ec4899', icon: 'hand' },
  { code: '1708', name_es: 'Sostenibilidad aplicada al sistema productivo', name_ca: 'Sostenibilitat aplicada al sistema productiu', type: 'comun', color: '#10b981', icon: 'leaf' },
  { code: '1710', name_es: 'Itinerario personal para la empleabilidad II', name_ca: 'Itinerari personal per a l’ocupabilitat II', type: 'comun', color: '#f59e0b', icon: 'briefcase' },
  { code: '1713', name_es: 'Proyecto intermodular', name_ca: 'Projecte intermodular', type: 'transversal', color: '#8b5cf6', icon: 'folder-kanban' }
];

const FILE_MAP = {
  '0842': { es: 'mapa_intermodular_0842_peinados_recogidos_actividades_desarrolladas_ES.md', ca: 'mapa_intermodular_0842_pentinats_recollits_activitats_desenvolupades_CA.md' },
  '0845': { es: 'mapa_intermodular_0845_tecnicas_corte_cabello_actividades_desarrolladas_ES.md', ca: 'mapa_intermodular_0845_tecniques_tall_cabells_activitats_desenvolupades_CA.md' },
  '0844': { es: 'mapa_intermodular_0844_cosmetica_peluqueria_actividades_desarrolladas_ES.md', ca: 'mapa_intermodular_0844_cosmetica_perruqueria_activitats_desenvolupades_CA.md' },
  '0846': { es: 'mapa_intermodular_0846_cambios_forma_permanente_actividades_desarrolladas_ES.md', ca: 'mapa_intermodular_0846_canvis_forma_permanent_activitats_desenvolupades_CA.md' },
  '0849': { es: 'mapa_intermodular_0849_analisis_capilar_actividades_desarrolladas_ES.md', ca: 'mapa_intermodular_0849_analisi_capillar_activitats_desenvolupades_CA.md' },
  '1664': { es: 'mapa_intermodular_1664_digitalizacion_sectores_productivos_actividades_desarrolladas_ES.md', ca: 'mapa_intermodular_1664_digitalitzacio_sectors_productius_activitats_desenvolupades_CA.md' },
  '1709': { es: 'mapa_intermodular_1709_itinerario_empleabilidad_I_actividades_desarrolladas_ES.md', ca: 'mapa_intermodular_1709_itinerari_ocupabilitat_I_activitats_desenvolupades_CA.md' },
  '0156': { es: 'mapa_intermodular_0156_ingles_profesional_actividades_desarrolladas_ES.md', ca: 'mapa_intermodular_0156_angles_professional_activitats_desenvolupades_CA.md' },
  '0640': { es: 'mapa_intermodular_0640_imagen_corporal_habitos_saludables_actividades_desarrolladas_ES.md', ca: 'mapa_intermodular_0640_imatge_corporal_habits_saludables_activitats_desenvolupades_CA.md' },
  '0643': { es: 'mapa_intermodular_0643_marketing_venta_imagen_personal_actividades_desarrolladas_ES.md', ca: 'mapa_intermodular_0643_marqueting_venda_imatge_personal_activitats_desenvolupades_CA.md' },
  '0843': { es: 'mapa_intermodular_0843_coloracion_capilar_actividades_desarrolladas_ES.md', ca: 'mapa_intermodular_0843_coloracio_capillar_activitats_desenvolupades_CA.md' },
  '0848': { es: 'mapa_intermodular_0848_peluqueria_estilismo_masculino_actividades_desarrolladas_ES.md', ca: 'mapa_intermodular_0848_perruqueria_estilisme_masculi_activitats_desenvolupades_CA.md' },
  '0636': { es: 'mapa_intermodular_0636_estetica_manos_pies_actividades_desarrolladas_ES.md', ca: 'mapa_intermodular_0636_estetica_mans_peus_activitats_desenvolupades_CA.md' },
  '1708': { es: 'mapa_intermodular_1708_sostenibilidad_sistema_productivo_actividades_desarrolladas_ES.md', ca: 'mapa_intermodular_1708_sostenibilitat_sistema_productiu_activitats_desenvolupades_CA.md' },
  '1710': { es: 'mapa_intermodular_1710_itinerario_empleabilidad_II_actividades_desarrolladas_ES.md', ca: 'mapa_intermodular_1710_itinerari_ocupabilitat_II_activitats_desenvolupades_CA.md' },
  '1713': { es: 'mapa_intermodular_1713_proyecto_intermodular_actividades_desarrolladas_ES.md', ca: 'mapa_intermodular_1713_projecte_intermodular_activitats_desenvolupades_CA.md' }
};

// 5. Build Course Dataset
function buildCourseDataset(moduleMetaList) {
  const resultModules = [];

  for (const meta of moduleMetaList) {
    const modCode = meta.code;
    const fileInfo = FILE_MAP[modCode];
    if (!fileInfo) throw new Error(`No file mapping for module ${modCode}`);

    const actsEsByCe = parseActivitiesFile(path.join(DIR, fileInfo.es));
    const actsCaByCe = parseActivitiesFile(path.join(DIR, fileInfo.ca));

    // Get module RAs from curriculum
    const curricRas = CFGM_PELUQUERIA_RAS_DATA.filter(r => r.moduleCode === modCode);
    const learningOutcomes = [];

    for (const r of curricRas) {
      const raNum = r.id.replace(/\D/g, '');
      const raId = `${modCode}_RA${raNum}`;
      const raCode = `RA${raNum}`;
      const text_es = r.description_es || r.description;
      const text_ca = r.description_ca || r.description;
      const criteria_es = r.criterios_es || r.criterios || [];
      const criteria_ca = r.criterios_ca || r.criterios || [];

      // Determine connections for this RA
      const connections = [];
      const totalCesInRa = criteria_es.length;
      // If <= 5 CEs, split the 4 activities into 2 connections (acts 1-2 and acts 3-4) to guarantee >= 6 connections per RA
      const splitConnections = totalCesInRa <= 5;

      for (let i = 0; i < criteria_es.length; i++) {
        const critText = criteria_es[i];
        const letterMatch = critText.match(/^([a-z])[\)\.]/i);
        if (!letterMatch) continue;
        const letter = letterMatch[1].toLowerCase();
        const ceCode = `${modCode}-${raNum}${letter}`;

        const actsEs = actsEsByCe.get(ceCode) || [];
        const actsCa = actsCaByCe.get(ceCode) || [];

        if (actsEs.length === 0) {
          console.warn(`Warning: No activities found for ${ceCode}`);
          continue;
        }

        const groups = splitConnections
          ? [
              { actsIndices: [0, 1], connSuffix: 'a' },
              { actsIndices: [2, 3], connSuffix: 'b' }
            ]
          : [
              { actsIndices: [0, 1, 2, 3], connSuffix: '' }
            ];

        for (const grp of groups) {
          const selectedActsEs = grp.actsIndices.map(idx => actsEs[idx]).filter(Boolean);
          const selectedActsCa = grp.actsIndices.map(idx => actsCa[idx]).filter(Boolean);

          if (selectedActsEs.length === 0) continue;

          // Primary external CE
          const primaryExtCe = selectedActsEs[0].extCes[0];
          const primaryLookup = ceMap.get(primaryExtCe);
          const targetModuleCode = primaryLookup ? primaryLookup.moduleCode : (primaryExtCe ? primaryExtCe.split('-')[0] : '0000');
          const targetModuleName_es = primaryLookup ? primaryLookup.moduleName_es : '';
          const targetModuleName_ca = primaryLookup ? primaryLookup.moduleName_ca : '';
          const targetRaCode = primaryLookup ? primaryLookup.raCode : 'RA1';
          const targetRaLookup = raMap.get(`${targetModuleCode}-${targetRaCode}`);
          const targetRaText_es = targetRaLookup ? targetRaLookup.text_es : (primaryLookup ? primaryLookup.text_es : '');
          const targetRaText_ca = targetRaLookup ? targetRaLookup.text_ca : (primaryLookup ? primaryLookup.text_ca : '');

          // Collect all related external criteria from these activities
          const relatedCriteria = [];
          const seenExtCes = new Set();
          const relatedModNames_es = new Set();
          const relatedModNames_ca = new Set();

          for (const a of selectedActsEs) {
            for (const ext of a.extCes) {
              if (!seenExtCes.has(ext)) {
                seenExtCes.add(ext);
                const info = ceMap.get(ext);
                if (info) {
                  relatedModNames_es.add(info.moduleName_es);
                  relatedModNames_ca.add(info.moduleName_ca);
                  relatedCriteria.push({
                    moduleCode: info.moduleCode,
                    moduleName_es: info.moduleName_es,
                    moduleName_ca: info.moduleName_ca,
                    criteria: `${info.code}. ${info.text_es}`,
                    criteria_es: `${info.code}. ${info.text_es}`,
                    criteria_ca: `${info.code}. ${info.text_ca}`
                  });
                }
              }
            }
          }

          const modsStr_es = Array.from(relatedModNames_es).join(', ');
          const modsStr_ca = Array.from(relatedModNames_ca).join(', ');

          const relationType = getRelationType(targetModuleCode);

          // Build mapped activities
          const mappedActivities = [];
          for (let k = 0; k < selectedActsEs.length; k++) {
            const e = selectedActsEs[k];
            const c = selectedActsCa[k] || e;
            const globalActIdx = grp.actsIndices[k] + 1;

            mappedActivities.push({
              id: `act_${ceCode.replace('-', '_')}_${globalActIdx}`,
              title_es: e.title,
              title_ca: c.title,
              motivatingFactor_es: e.motivatingFactor,
              motivatingFactor_ca: c.motivatingFactor,
              description_es: e.description,
              description_ca: c.description,
              evidence_es: e.evidence,
              evidence_ca: c.evidence,
              diversitySupport_es: e.diversitySupport,
              diversitySupport_ca: c.diversitySupport,
              justification_es: `Metodología: ${e.methodology} | Evaluación: ${e.evaluation}`,
              justification_ca: `Metodologia: ${c.methodology} | Avaluació: ${c.evaluation}`
            });
          }

          const connTitle_es = `Conexión curricular: ${ceCode} ↔ ${primaryExtCe} (${targetModuleName_es})`;
          const connTitle_ca = `Connexió curricular: ${ceCode} ↔ ${primaryExtCe} (${targetModuleName_ca})`;

          const justification_es = `Esta combinación vincula el criterio **${ceCode}** con ${modsStr_es} mediante situaciones de salón y metodologías activas (retos, talleres guiados, resolución de incidencias y evidencias profesionales evaluables).`;
          const justification_ca = `Aquesta combinació vincula el criteri **${ceCode}** amb ${modsStr_ca} mitjançant situacions de saló i metodologies actives (reptes, tallers guiats, resolució d’incidències i evidències professionals avaluables).`;

          connections.push({
            title_es: connTitle_es,
            title_ca: connTitle_ca,
            targetModuleCode,
            targetModuleName_es,
            targetModuleName_ca,
            targetRaCode,
            targetRaText_es,
            targetRaText_ca,
            sourceCriteria: ceCode,
            criteriaKeys: [letter, `${raNum}${letter}`, ceCode],
            relatedCriteria,
            relationType,
            justification_es,
            justification_ca,
            activities: mappedActivities
          });
        }
      }

      learningOutcomes.push({
        id: raId,
        code: raCode,
        text_es,
        text_ca,
        criteria_es,
        criteria_ca,
        connections
      });
    }

    resultModules.push({
      code: modCode,
      name_es: meta.name_es,
      name_ca: meta.name_ca,
      type: meta.type,
      color: meta.color,
      icon: meta.icon,
      learningOutcomes
    });
  }

  return resultModules;
}

// 6. Generate and Save Both Courses
console.log('Generating Course 1 (CFGM_PELUQUERIA)...');
const course1 = buildCourseDataset(MODULE_METADATA_1);
const outPath1 = path.resolve('backend/src/data/mapa-intermodular/mapa_cfgm_peluqueria.json');
fs.writeFileSync(outPath1, JSON.stringify(course1, null, 2), 'utf8');
console.log(`Course 1 written to ${outPath1} (${(fs.statSync(outPath1).size / 1024 / 1024).toFixed(2)} MB)`);

console.log('Generating Course 2 (CFGM_PELUQUERIA_2)...');
const course2 = buildCourseDataset(MODULE_METADATA_2);
const outPath2 = path.resolve('backend/src/data/mapa-intermodular/mapa_cfgm_peluqueria_2.json');
fs.writeFileSync(outPath2, JSON.stringify(course2, null, 2), 'utf8');
console.log(`Course 2 written to ${outPath2} (${(fs.statSync(outPath2).size / 1024 / 1024).toFixed(2)} MB)`);

// 7. Verification Stats
function printStats(name, modules) {
  let conns = 0, acts = 0, ras = 0;
  let connPerRa = [];
  let emptyConns = 0;
  for (const m of modules) {
    for (const r of m.learningOutcomes) {
      ras++;
      conns += r.connections.length;
      connPerRa.push(r.connections.length);
      for (const c of r.connections) {
        if (!c.activities || c.activities.length === 0) emptyConns++;
        acts += (c.activities || []).length;
      }
    }
  }
  console.log(`=== ${name} STATS ===`);
  console.log(`Modules: ${modules.length}, RAs: ${ras}`);
  console.log(`Total Connections: ${conns} (min ${Math.min(...connPerRa)}, max ${Math.max(...connPerRa)}, avg ${(conns / ras).toFixed(1)} per RA)`);
  console.log(`Total Activities: ${acts} (avg ${(acts / conns).toFixed(1)} per connection)`);
  console.log(`Empty Connections: ${emptyConns}`);
}

printStats('CFGM Peluquería 1.er curso', course1);
printStats('CFGM Peluquería 2.º curso', course2);
