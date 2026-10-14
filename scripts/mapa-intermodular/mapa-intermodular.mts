/**
 * Herramienta del mapa intermodular de FP: prepara la ficha curricular de un curso y construye
 * el JSON del mapa a partir de un archivo de relaciones RA↔RA redactado por una persona o una IA.
 *
 *   cd backend && npx tsx ../scripts/mapa-intermodular/mapa-intermodular.mts ficha \
 *     --nivel CFGM_X --curso 1º --trabajo ../scripts/mapa-intermodular/fuentes/CFGM_X
 *   cd backend && npx tsx ../scripts/mapa-intermodular/mapa-intermodular.mts construir \
 *     --nivel CFGM_X --curso 1º --trabajo ../scripts/mapa-intermodular/fuentes/CFGM_X \
 *     --salida src/data/mapa-intermodular/mapa_cfgm_x.json
 *
 * `ficha` escribe en la carpeta de trabajo `ficha.md` (módulos, RA y criterios ES/CA) y `config.json`
 * (tipo, relación, color e icono de cada módulo). `construir` lee `config.json` y todos los
 * `relaciones*.json`, valida las reglas del mapa (AGENTS.md §8) y, sin errores, escribe el JSON.
 * Formato y reglas: documentation/procesamiento_actividades_mapa_intermodular.md (sección 8).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const DATA_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../backend/src/data');
const LANGS = ['es', 'ca'] as const;
const ACTIVITY_FIELDS = ['titulo', 'contexto', 'desarrollo', 'evidencia', 'dua', 'metodologia'] as const;
const RELATION_TYPES = ['tecnica', 'ciencias', 'comunicacion', 'empleabilidad', 'cliente', 'sostenibilidad', 'digital'];
const MIN_CONN = 6;
const MAX_CONN = 15;
const PALETTE = ['#f472b6', '#34d399', '#fb923c', '#a78bfa', '#38bdf8', '#f87171', '#4ade80', '#fbbf24', '#c084fc', '#60a5fa'];
const ICONS = ['heart-pulse', 'microscope', 'flask-conical', 'users', 'book', 'hand', 'leaf', 'briefcase', 'compass', 'atom'];

/** Módulos comunes del currículo: su tipo y la familia de relación de las conexiones que llegan a ellos. */
const COMUNES: Record<string, { tipo: string; relacion: string; icon: string }> = {
  '0156': { tipo: 'comun', relacion: 'comunicacion', icon: 'languages' },
  '0179': { tipo: 'comun', relacion: 'comunicacion', icon: 'languages' },
  '1664': { tipo: 'comun', relacion: 'digital', icon: 'binary' },
  '1665': { tipo: 'comun', relacion: 'digital', icon: 'binary' },
  '1708': { tipo: 'comun', relacion: 'sostenibilidad', icon: 'leaf' },
  '1709': { tipo: 'comun', relacion: 'empleabilidad', icon: 'briefcase' },
  '1710': { tipo: 'comun', relacion: 'empleabilidad', icon: 'briefcase' },
  '1713': { tipo: 'transversal', relacion: 'tecnica', icon: 'folder-kanban' },
};

type Lang = (typeof LANGS)[number];
type Ra = { id: string; moduleCode: string; module_es: string; module_ca: string; description_es: string;
  description_ca: string; criterios_es: string[]; criterios_ca: string[] };
type Lado = { modulo: string; ra: string; criterios: string[] };
type Actividad = Record<`${(typeof ACTIVITY_FIELDS)[number]}_${Lang}`, string>;
type Relacion = { a: Lado; b: Lado; justificacion_es: string; justificacion_ca: string; actividades: Actividad[];
  _origen?: string };
type ModConfig = { nombre_es: string; nombre_ca: string; tipo: string; relacion: string; color: string; icon: string };
type Config = { nivel: string; curso: string; modulos: Record<string, ModConfig> };

const args = (() => {
  const out: Record<string, string> = { cmd: process.argv[2] ?? '' };
  for (let i = 3; i < process.argv.length; i += 2) out[process.argv[i]!.replace(/^--/, '')] = process.argv[i + 1] ?? '';
  return out;
})();

const errors: string[] = [];
const warnings: string[] = [];
const fail = (msg: string) => errors.push(msg);

/** Carga el catálogo y los RA del curso pedido, en el orden de módulos del catálogo. */
async function loadCourse(nivelId: string, curso: string) {
  const { NIVELES } = await import(pathToFileURL(path.join(DATA_DIR, 'niveles.ts')).href);
  const nivel = NIVELES.find((n: any) => n.id === nivelId);
  if (!nivel) throw new Error(`El nivel ${nivelId} no está en backend/src/data/niveles.ts`);
  const modulos: string[] = nivel.cursos.find((c: any) => c.curso === curso)?.modulos ?? [];
  if (!modulos.length) throw new Error(`El curso ${curso} de ${nivelId} no declara módulos`);
  const ras = await loadRas(nivelId);
  const byModule = new Map(modulos.map((m) => [m, ras.filter((r) => r.moduleCode === m)]));
  for (const [m, list] of byModule) if (!list.length) throw new Error(`El módulo ${m} no tiene RA cargados`);
  return { nivel, modulos, byModule };
}

/** Busca el archivo `ras_*.data.ts` cuyos RA tienen el `tipoNivel` pedido. */
async function loadRas(nivelId: string): Promise<Ra[]> {
  for (const file of fs.readdirSync(DATA_DIR).filter((f) => /^ras_.*\.data\.ts$/.test(f))) {
    const mod = await import(pathToFileURL(path.join(DATA_DIR, file)).href);
    const list = Object.values(mod).find((v) => Array.isArray(v)) as Ra[] | undefined;
    if (list?.length && (list[0] as any).tipoNivel === nivelId) return list;
  }
  throw new Error(`No hay ningún backend/src/data/ras_*.data.ts con tipoNivel ${nivelId}`);
}

const raNum = (raId: string) => raId.replace(/^RA/, '');
const letterOf = (criterio: string) => criterio.trim().charAt(0);
/** Clave corta de un criterio («0011-1a»); sin prefijo si el código del módulo tiene letras («1a»). */
const critKey = (modulo: string, ra: string, letra: string) =>
  /[a-z]/i.test(modulo) ? `${raNum(ra)}${letra}` : `${modulo}-${raNum(ra)}${letra}`;

// ───────────────────────────── ficha ─────────────────────────────

function fichaMarkdown(nivel: any, curso: string, byModule: Map<string, Ra[]>): string {
  const lines = [`# Ficha curricular: ${nivel.nombre_es} (${nivel.nombre_ca}), curso ${curso}`, '',
    'Textos oficiales cargados en la aplicación. Cita los criterios por su letra (`a`, `b`…).', ''];
  for (const [code, ras] of byModule) {
    lines.push(`## ${code} · ${ras[0]!.module_es} | ${ras[0]!.module_ca}`, '');
    for (const ra of ras) {
      lines.push(`### ${code} ${ra.id}`, `- ES: ${ra.description_es}`, `- CA: ${ra.description_ca}`, '');
      ra.criterios_es.forEach((c, i) => lines.push(`  - ES ${c}`, `    CA ${ra.criterios_ca[i] ?? ''}`));
      lines.push('');
    }
  }
  return lines.join('\n');
}

function defaultConfig(nivelId: string, curso: string, byModule: Map<string, Ra[]>): Config {
  const modulos: Record<string, ModConfig> = {};
  [...byModule.entries()].forEach(([code, ras], i) => {
    const comun = COMUNES[code];
    modulos[code] = { nombre_es: ras[0]!.module_es, nombre_ca: ras[0]!.module_ca,
      tipo: comun?.tipo ?? 'especifico', relacion: comun?.relacion ?? 'tecnica',
      color: PALETTE[i % PALETTE.length]!, icon: comun?.icon ?? ICONS[i % ICONS.length]! };
  });
  return { nivel: nivelId, curso, modulos };
}

async function ficha() {
  const { nivel, byModule } = await loadCourse(args.nivel!, args.curso!);
  fs.mkdirSync(args.trabajo!, { recursive: true });
  fs.writeFileSync(path.join(args.trabajo!, 'ficha.md'), fichaMarkdown(nivel, args.curso!, byModule));
  const cfgPath = path.join(args.trabajo!, 'config.json');
  if (!fs.existsSync(cfgPath)) {
    fs.writeFileSync(cfgPath, JSON.stringify(defaultConfig(args.nivel!, args.curso!, byModule), null, 2) + '\n');
  }
  const nRa = [...byModule.values()].reduce((s, l) => s + l.length, 0);
  console.log(`Ficha y config en ${args.trabajo} (${byModule.size} módulos, ${nRa} RA).`);
}

// ─────────────────────────── validación ───────────────────────────

/** Comprueba que un lado de la relación existe en el curso y que cita de 1 a 3 criterios reales. */
function checkLado(lado: Lado, byModule: Map<string, Ra[]>, where: string): Ra | undefined {
  const ra = byModule.get(lado?.modulo)?.find((r) => r.id === lado.ra);
  if (!ra) return void fail(`${where}: no existe ${lado?.modulo} ${lado?.ra} en el curso`);
  const letras = ra.criterios_es.map(letterOf);
  if (!Array.isArray(lado.criterios) || lado.criterios.length < 1 || lado.criterios.length > 3) {
    fail(`${where}: ${lado.modulo} ${lado.ra} debe citar entre 1 y 3 criterios`);
  }
  for (const c of lado.criterios ?? []) if (!letras.includes(c)) fail(`${where}: ${lado.modulo} ${lado.ra} no tiene el criterio ${c})`);
  if (new Set(lado.criterios).size !== lado.criterios?.length) fail(`${where}: criterios repetidos en ${lado.modulo} ${lado.ra}`);
  return ra;
}

/** Palabra completa con límites Unicode (`\b` de JS no reconoce las letras acentuadas). */
const word = (alts: string) => new RegExp(`(?<![\\p{L}'’-])(${alts})(?![\\p{L}])`, 'iu');
const CA_IN_ES = [/·/, word('amb|els|les seves|aquesta|també|alumnat|mitjançant|perquè'), /(?<!\p{L})[ld]'\p{L}/iu];
const ES_IN_CA = [/ñ/, word('con|los|para|las|también|alumnado|mediante|porque|una vez|y')];

/** Textos presentes y distintos en ES/CA, sin marcas evidentes del otro idioma. */
function checkTextos(obj: Record<string, any>, campos: readonly string[], where: string) {
  for (const campo of campos) {
    const es = obj[`${campo}_es`];
    const ca = obj[`${campo}_ca`];
    if (typeof es !== 'string' || es.trim().length < 3) fail(`${where}: falta ${campo}_es`);
    if (typeof ca !== 'string' || ca.trim().length < 3) fail(`${where}: falta ${campo}_ca`);
    if (typeof es !== 'string' || typeof ca !== 'string') continue;
    if (es.trim() === ca.trim()) fail(`${where}: ${campo}_es y ${campo}_ca son idénticos`);
    const caEnEs = CA_IN_ES.find((re) => re.test(es));
    const esEnCa = ES_IN_CA.find((re) => re.test(ca));
    if (caEnEs) fail(`${where}: ${campo}_es parece catalán («${es.match(caEnEs)![0]}»)`);
    if (esEnCa) fail(`${where}: ${campo}_ca parece castellano («${ca.match(esEnCa)![0]}»)`);
  }
}

function checkRelacion(rel: Relacion, byModule: Map<string, Ra[]>, where: string) {
  checkLado(rel.a, byModule, where);
  checkLado(rel.b, byModule, where);
  if (rel.a?.modulo === rel.b?.modulo) fail(`${where}: los dos lados son del mismo módulo (${rel.a.modulo})`);
  checkTextos(rel, ['justificacion'], where);
  if (!Array.isArray(rel.actividades) || rel.actividades.length < 1) fail(`${where}: la relación no tiene actividades`);
  (rel.actividades ?? []).forEach((act, i) => {
    checkTextos(act, ACTIVITY_FIELDS, `${where} actividad ${i + 1}`);
    checkCitas(act, rel, `${where} actividad ${i + 1}`);
    checkRedaccion(act, `${where} actividad ${i + 1}`);
  });
}

const CITA = /(?<![\p{L}\d])([A-Z]*\d+)-(\d+)([a-z])(?![\p{L}])/gu;
const citas = (text: unknown) => (typeof text === 'string' ? [...text.matchAll(CITA)].map((m) => m[0]) : []);

/** Las citas «0011-1a» del desarrollo coinciden en ES y CA y son criterios de la relación. */
function checkCitas(act: Actividad, rel: Relacion, where: string) {
  const es = citas(act.desarrollo_es);
  const ca = citas(act.desarrollo_ca);
  if (es.join() !== ca.join()) fail(`${where}: las citas de criterios difieren entre ES (${es}) y CA (${ca})`);
  const propias = [rel.a, rel.b].flatMap((l) => (l?.criterios ?? []).map((c) => `${l.modulo}-${raNum(l.ra)}${c}`));
  const ajenas = es.filter((c) => !propias.includes(c));
  if (ajenas.length) fail(`${where}: cita criterios que no son de la relación (${ajenas.join(', ')})`);
  const sinCitar = propias.filter((c) => !es.includes(c));
  if (sinCitar.length) warnings.push(`${where}: el desarrollo no cita ${sinCitar.join(', ')}`);
}

/** Reglas globales: pares únicos, 6-15 conexiones y títulos sin repetir por RA, criterios cubiertos. */
function checkGlobal(rels: Relacion[], byModule: Map<string, Ra[]>) {
  const pares = new Set<string>();
  const grado = new Map<string, number>();
  const titulos = new Map<string, Set<string>>();
  const cubiertos = new Set<string>();
  for (const rel of rels) {
    const ka = `${rel.a?.modulo} ${rel.a?.ra}`;
    const kb = `${rel.b?.modulo} ${rel.b?.ra}`;
    const par = [ka, kb].sort().join(' ↔ ');
    if (pares.has(par)) fail(`${rel._origen}: la relación ${par} está repetida`);
    pares.add(par);
    for (const [k, lado] of [[ka, rel.a], [kb, rel.b]] as const) {
      grado.set(k, (grado.get(k) ?? 0) + 1);
      (lado?.criterios ?? []).forEach((c) => cubiertos.add(`${k}${c}`));
      checkTitulos(titulos, k, rel);
    }
  }
  checkGrados(grado, byModule);
  checkCobertura(cubiertos, byModule);
  checkPlantillas(rels);
  return pares.size;
}

const FINAL_COJO = word('de|del|la|el|los|las|y|i|que|a|en|per|para|con|amb|un|una|al|als|les|els|o');
const TEXTO_DE_CRITERIO = /(?<!\p{L})(Se han? |S'han? )/u;

/** Títulos completos y desarrollos redactados, no pegados del texto de los criterios. */
function checkRedaccion(act: Actividad, where: string) {
  for (const lang of LANGS) {
    const titulo = act[`titulo_${lang}`]?.trim() ?? '';
    const ultima = titulo.split(/\s+/).pop() ?? '';
    if (FINAL_COJO.test(ultima) && ultima.length <= 4) fail(`${where}: titulo_${lang} acaba a medias («${titulo}»)`);
    if (TEXTO_DE_CRITERIO.test(titulo)) fail(`${where}: titulo_${lang} copia el texto de un criterio («${titulo}»)`);
    if (TEXTO_DE_CRITERIO.test(act[`desarrollo_${lang}`] ?? '')) {
      fail(`${where}: desarrollo_${lang} pega el texto de un criterio («Se ha…»/«S'ha…»); redáctalo con palabras propias`);
    }
  }
}

/**
 * Detecta textos generados con plantilla: desarrollos que empiezan igual y contextos, DUA o
 * evidencias repetidos. Cada actividad debe redactarse para su relación.
 */
function checkPlantillas(rels: Relacion[]) {
  const acts = rels.flatMap((r) => r.actividades ?? []);
  const limite = Math.max(4, Math.ceil(acts.length * 0.05));
  const repetidos = (textos: string[]) =>
    [...textos.reduce((m, t) => m.set(t, (m.get(t) ?? 0) + 1), new Map<string, number>())].filter(([, n]) => n > limite);
  const inicio = (t = '') => t.trim().split(/\s+/).slice(0, 6).join(' ').toLowerCase();
  for (const [t, n] of repetidos(acts.map((a) => inicio(a.desarrollo_es)))) {
    fail(`${n} desarrollos empiezan igual («${t}…»): redacta cada actividad para su relación`);
  }
  for (const campo of ['contexto', 'dua', 'evidencia'] as const) {
    for (const [t, n] of repetidos(acts.map((a) => (a[`${campo}_es`] ?? '').trim()))) {
      fail(`${campo}_es repetido ${n} veces («${t.slice(0, 70)}…»): debe ser propio de cada actividad`);
    }
  }
}

function checkTitulos(titulos: Map<string, Set<string>>, raKey: string, rel: Relacion) {
  const set = titulos.get(raKey) ?? new Set<string>();
  for (const act of rel.actividades ?? []) {
    for (const t of [`es:${act.titulo_es}`, `ca:${act.titulo_ca}`]) {
      if (set.has(t.toLowerCase())) fail(`${rel._origen}: título repetido en ${raKey}: «${t.slice(3)}»`);
      set.add(t.toLowerCase());
    }
  }
  titulos.set(raKey, set);
}

function checkGrados(grado: Map<string, number>, byModule: Map<string, Ra[]>) {
  for (const [code, ras] of byModule) {
    for (const ra of ras) {
      const n = grado.get(`${code} ${ra.id}`) ?? 0;
      if (n < MIN_CONN || n > MAX_CONN) fail(`${code} ${ra.id}: ${n} conexiones (deben ser entre ${MIN_CONN} y ${MAX_CONN})`);
    }
  }
}

function checkCobertura(cubiertos: Set<string>, byModule: Map<string, Ra[]>) {
  const faltan = [...byModule].flatMap(([code, ras]) =>
    ras.flatMap((ra) => ra.criterios_es.map(letterOf).filter((l) => !cubiertos.has(`${code} ${ra.id}${l}`))
      .map((l) => `${code}-${raNum(ra.id)}${l}`)));
  if (faltan.length) warnings.push(`Criterios sin ninguna conexión (${faltan.length}): ${faltan.join(', ')}`);
}

// ─────────────────────────── construcción ───────────────────────────

function relatedCriteria(lado: Lado, ra: Ra, mod: ModConfig) {
  return lado.criterios.map((l) => {
    const i = ra.criterios_es.findIndex((c) => letterOf(c) === l);
    const key = critKey(lado.modulo, lado.ra, l);
    const es = `${key}. ${ra.criterios_es[i]}`;
    return { moduleCode: lado.modulo, moduleName_es: mod.nombre_es, moduleName_ca: mod.nombre_ca,
      criteria_es: es, criteria_ca: `${key}. ${ra.criterios_ca[i]}`, criteria: es };
  });
}

const METODOLOGIA = { es: 'Metodología activa: ', ca: 'Metodologia activa: ' };
const withPrefix = (text: string, lang: Lang) =>
  /^metodolog/i.test(text.trim()) ? text.trim() : METODOLOGIA[lang] + text.trim();

function activity(act: Actividad, id: string) {
  const out: Record<string, string> = { id };
  for (const lang of LANGS) {
    out[`title_${lang}`] = act[`titulo_${lang}`].trim();
    out[`motivatingFactor_${lang}`] = act[`contexto_${lang}`].trim();
    out[`description_${lang}`] = act[`desarrollo_${lang}`].trim();
    out[`evidence_${lang}`] = act[`evidencia_${lang}`].trim();
    out[`diversitySupport_${lang}`] = act[`dua_${lang}`].trim();
    out[`justification_${lang}`] = withPrefix(act[`metodologia_${lang}`], lang);
  }
  return out;
}

/** Conexión vista desde `src` hacia `dst`: los criterios propios son los de `src`. */
function connection(rel: Relacion, src: Lado, dst: Lado, ctx: BuildCtx, n: number) {
  const dstRa = ctx.ra(dst);
  const dstMod = ctx.cfg.modulos[dst.modulo]!;
  const own = src.criterios.map((l) => critKey(src.modulo, src.ra, l));
  const ext = dst.criterios.map((l) => critKey(dst.modulo, dst.ra, l));
  return {
    title_es: `Conexión curricular: ${own.join(', ')} ↔ ${dst.modulo} ${ext.join(', ')} (${dstMod.nombre_es})`,
    title_ca: `Connexió curricular: ${own.join(', ')} ↔ ${dst.modulo} ${ext.join(', ')} (${dstMod.nombre_ca})`,
    targetModuleCode: dst.modulo, targetModuleName_es: dstMod.nombre_es, targetModuleName_ca: dstMod.nombre_ca,
    targetRaCode: dst.ra, targetRaText_es: dstRa.description_es, targetRaText_ca: dstRa.description_ca,
    sourceCriteria: own.join(', '),
    criteriaKeys: src.criterios.flatMap((l) => [...new Set([l, `${raNum(src.ra)}${l}`, `${src.modulo}-${raNum(src.ra)}${l}`])]),
    relatedCriteria: relatedCriteria(dst, dstRa, dstMod),
    relationType: dstMod.relacion,
    justification_es: rel.justificacion_es.trim(), justification_ca: rel.justificacion_ca.trim(),
    activities: rel.actividades.map((a, k) =>
      activity(a, `act_${src.modulo}_${raNum(src.ra)}${src.criterios[0]}_${n}_${k + 1}`)),
  };
}

type BuildCtx = { cfg: Config; ra: (l: Lado) => Ra; order: (l: Lado) => number };

function buildMap(rels: Relacion[], byModule: Map<string, Ra[]>, cfg: Config) {
  const modOrder = [...byModule.keys()];
  const ctx: BuildCtx = { cfg, ra: (l) => byModule.get(l.modulo)!.find((r) => r.id === l.ra)!,
    order: (l) => modOrder.indexOf(l.modulo) * 100 + Number(raNum(l.ra)) };
  const porRa = new Map<string, { dst: Lado; conn: () => object }[]>();
  for (const rel of rels) {
    for (const [src, dst] of [[rel.a, rel.b], [rel.b, rel.a]] as const) {
      const key = `${src.modulo} ${src.ra}`;
      const list = porRa.get(key) ?? [];
      const n = list.length + 1;
      list.push({ dst, conn: () => connection(rel, src, dst, ctx, n) });
      porRa.set(key, list);
    }
  }
  return modOrder.map((code) => moduleDoc(code, byModule.get(code)!, cfg.modulos[code]!, porRa, ctx));
}

function moduleDoc(code: string, ras: Ra[], mod: ModConfig, porRa: Map<string, any[]>, ctx: BuildCtx) {
  return {
    code, name_es: mod.nombre_es, name_ca: mod.nombre_ca, type: mod.tipo, color: mod.color, icon: mod.icon,
    learningOutcomes: ras.map((ra) => ({
      id: `${code}_${ra.id}`, code: ra.id, text_es: ra.description_es, text_ca: ra.description_ca,
      criteria_es: ra.criterios_es, criteria_ca: ra.criterios_ca,
      connections: (porRa.get(`${code} ${ra.id}`) ?? [])
        .sort((x, y) => ctx.order(x.dst) - ctx.order(y.dst)).map((x) => x.conn()),
    })),
  };
}

function checkConfig(cfg: Config, modulos: string[]) {
  if (cfg.nivel !== args.nivel || cfg.curso !== args.curso) fail(`config.json es de ${cfg.nivel} ${cfg.curso}`);
  for (const m of modulos) {
    const mc = cfg.modulos?.[m];
    if (!mc) { fail(`config.json no define el módulo ${m}`); continue; }
    if (!['especifico', 'comun', 'transversal'].includes(mc.tipo)) fail(`config.json: tipo inválido en ${m}`);
    if (!RELATION_TYPES.includes(mc.relacion)) fail(`config.json: relación inválida en ${m} (${RELATION_TYPES.join(', ')})`);
  }
}

function readRelaciones(dir: string): Relacion[] {
  const files = fs.readdirSync(dir).filter((f) => /^relaciones.*\.json$/.test(f)).sort();
  if (!files.length) throw new Error(`No hay relaciones*.json en ${dir}`);
  return files.flatMap((f) => {
    const list = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8')) as Relacion[];
    return list.map((r, i) => ({ ...r, _origen: `${f} #${i + 1}` }));
  });
}

async function construir() {
  const { modulos, byModule } = await loadCourse(args.nivel!, args.curso!);
  const cfg = JSON.parse(fs.readFileSync(path.join(args.trabajo!, 'config.json'), 'utf-8')) as Config;
  checkConfig(cfg, modulos);
  const rels = readRelaciones(args.trabajo!);
  rels.forEach((r) => checkRelacion(r, byModule, r._origen!));
  const pares = checkGlobal(rels, byModule);
  warnings.forEach((w) => console.warn(`⚠️  ${w}`));
  if (errors.length) {
    errors.forEach((e) => console.error(`❌ ${e}`));
    console.error(`\n${errors.length} errores: no se escribe el mapa.`);
    process.exit(1);
  }
  const map = buildMap(rels, byModule, cfg);
  if (args.salida) fs.writeFileSync(args.salida, JSON.stringify(map, null, 2) + '\n');
  const acts = rels.reduce((s, r) => s + r.actividades.length, 0);
  console.log(`✅ ${pares} relaciones → ${pares * 2} conexiones, ${acts} actividades distintas (${acts * 2} en el mapa).`);
  console.log(args.salida ? `Mapa escrito en ${args.salida}` : 'Validación correcta (sin --salida no se escribe nada).');
}

const commands: Record<string, () => Promise<void>> = { ficha, construir };
if (!commands[args.cmd] || !args.nivel || !args.curso || !args.trabajo) {
  console.error('Uso: mapa-intermodular.mts <ficha|construir> --nivel <ID> --curso <1º|2º> --trabajo <dir> [--salida <json>]');
  process.exit(1);
}
await commands[args.cmd]!();
