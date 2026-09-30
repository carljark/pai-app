import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(process.cwd(), '.env') });
// El `.env` real suele estar en la raíz del repo (backend/../.env).
// dotenv no sobreescribe variables ya definidas, así que cargamos ambos.
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = process.env.OPENROUTER_API_KEY;

/**
 * Modelo principal. Por defecto `openrouter/free` (enruta a un modelo gratuito).
 * Se puede sobreescribir con la variable de entorno INGEST_MODEL.
 */
const PRIMARY_MODEL = process.env.INGEST_MODEL?.trim() || 'openrouter/free';

/** Cascada de respaldo si el modelo principal falla o devuelve JSON inválido. */
const MODEL_CASCADE = [
    'openrouter/free',
    'dots-studio/dots-3-note-preview:free',
    'cohere/north-mini-code:free',
    'deepseek/deepseek-v4.1-flash'
];

const MAX_INPUT_CHARS = Number(process.env.INGEST_MAX_INPUT) || 30000;
const MIN_INPUT_CHARS = 500;
const MAX_TOKENS = 4000;
const MAX_ATTEMPTS_PER_FILE = 4;
const DELAY_BETWEEN_FILES_MS = Number(process.env.INGEST_DELAY_MS) || 4000;

const BASE_DIR = path.resolve(process.cwd(), '../Ejemplos proyectos FP y ESO');
const OUTPUT_FILE = path.resolve(process.cwd(), 'src/data/intef_examples.json');

/** Extensión opcional a procesar (p. ej. `tsx scripts/super_ingest.ts .elp`). */
const ONLY_EXT = process.argv[2]?.trim() || '';

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

function extractTextFromZip(zipPath: string): string {
    try {
        const zip = new AdmZip(zipPath);
        const zipEntries = zip.getEntries();
        for (const entry of zipEntries) {
            if (entry.entryName.endsWith('contentv3.xml') || entry.entryName.endsWith('content.xml')) {
                const xmlData = entry.getData().toString('utf8');

                // eXeLearning guarda el texto en atributos value="" de nodos unicode o string
                // Para evitar comerse la RAM con regex complejas, buscamos value="...":
                let extracted = '';

                const matches = xmlData.match(/<unicode[^>]*value="([^"]+)"/g) || [];
                if (matches.length > 0) {
                    extracted = matches.map(m => m.replace(/<unicode[^>]*value="/, '').replace(/"$/, '')).join(' ');
                }

                const cdataMatches = xmlData.match(/<!\[CDATA\[(.*?)\]\]>/gs) || [];
                if (cdataMatches.length > 0) {
                    extracted += " " + cdataMatches.map(m => m.replace(/<!\[CDATA\[/, '').replace(/\]\]>/, '')).join(' ');
                }

                return extracted
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&quot;/g, '"')
                    .replace(/&amp;/g, '&')
                    .replace(/<[^>]+>/g, ' ') // Strip inner HTML tags
                    .replace(/\s+/g, ' ')
                    .trim();
            }
        }
    } catch (e) {
        console.error("  -> AdmZip error en", path.basename(zipPath));
    }
    return '';
}

/** Normaliza un título para detectar duplicados (sin acentos, sin signos, minúsculas). */
function normalizeTitle(title: string): string {
    return (title || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
}

/**
 * Elimina ejemplos con el mismo título normalizado.
 * Conserva la variante con más contenido (`originalContent`/`content_sample`).
 */
function dedupeExamples(list: any[]): any[] {
    const byTitle = new Map<string, any>();
    for (const example of list) {
        const key = normalizeTitle(example.title);
        if (!key) {
            if (!byTitle.has('__sin_titulo__')) byTitle.set('__sin_titulo__', example);
            continue;
        }
        const current = byTitle.get(key);
        if (!current) {
            byTitle.set(key, example);
            continue;
        }
        const currentLen = (current.originalContent || current.content_sample || '').length;
        const candidateLen = (example.originalContent || example.content_sample || '').length;
        if (candidateLen > currentLen) byTitle.set(key, example);
    }
    return Array.from(byTitle.values());
}

function loadExistingExamples(): any[] {
    try {
        if (fs.existsSync(OUTPUT_FILE)) {
            const parsed = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
            if (Array.isArray(parsed)) return parsed;
        }
    } catch (e) {
        console.warn('No se pudo leer el JSON existente, se generará de cero.');
    }
    return [];
}

function save(examples: any[]) {
    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(examples, null, 2));
}

const SYSTEM_INSTRUCTION = `Eres un experto en diseño instruccional y metodologías activas (ABP, ABR, ApS).
Analizas el texto extraído de un proyecto educativo y extraes EXCLUSIVAMENTE "la carne": actividades creativas, retos y trabajo de campo.
Devuelves SIEMPRE un único objeto JSON válido, sin markdown, sin bloques de código y sin texto adicional.`;

const USER_PROMPT = (rawText: string) => `Tienes el texto extraído de un proyecto educativo (puede tener texto cortado o restos de HTML).
Ignora la burocracia, índices y palabras sueltas. Extrae solo lo que aporta creatividad al aula.

Devuelve EXACTAMENTE este objeto JSON (sin markdown, sin \`\`\`):
{
  "title": "Título del proyecto (si no lo encuentras, inventa uno fiel al contenido)",
  "description": "Breve frase del objetivo (1-2 líneas).",
  "modules": ["Título de cada fase/módulo del proyecto"],
  "ras": ["Resultados de aprendizaje o competencias que se trabajan"],
  "methodology": "Metodologías activas empleadas",
  "originalContent": "Resumen detallado (300-1200 caracteres) destacando SOLO actividades creativas, producto final y rol del alumnado. Inspirador."
}

Texto del proyecto:
${rawText}`;

/** Extrae un objeto JSON de una respuesta que puede venir envuelta en markdown o con texto extra. */
function parseJsonLoose(text: string): any {
    if (!text) throw new Error('Respuesta vacía');
    let candidate = text.trim();
    const fence = candidate.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fence) candidate = fence[1].trim();
    const start = candidate.indexOf('{');
    const end = candidate.lastIndexOf('}');
    if (start === -1 || end === -1 || end <= start) throw new Error('No se encontró JSON en la respuesta');
    return JSON.parse(candidate.slice(start, end + 1));
}

async function callOpenRouter(model: string, rawText: string): Promise<any> {
    if (!API_KEY) throw new Error('OPENROUTER_API_KEY no está configurada');

    const response = await fetch(OPENROUTER_URL, {
        method: 'POST',
        signal: AbortSignal.timeout(180_000),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
            'HTTP-Referer': 'https://plappin.app',
            'X-Title': 'Plappin Ingest'
        },
        body: JSON.stringify({
            model,
            max_tokens: MAX_TOKENS,
            messages: [
                { role: 'system', content: SYSTEM_INSTRUCTION },
                { role: 'user', content: USER_PROMPT(rawText.slice(0, MAX_INPUT_CHARS)) }
            ]
        })
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorBody.slice(0, 300)}`);
    }

    const data: any = await response.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) throw new Error('Respuesta vacía o formato inesperado de OpenRouter');

    const parsed = parseJsonLoose(text);
    if (!parsed.title || !parsed.originalContent) {
        throw new Error('JSON incompleto (faltan title/originalContent)');
    }
    return { parsed, usedModel: data.model || model };
}

/**
 * Resume un proyecto probando primero el modelo principal y luego la cascada,
 * con reintentos y backoff ante límites de uso (429) o saturación (5xx).
 */
async function summarize(rawText: string): Promise<any> {
    const models = [PRIMARY_MODEL, ...MODEL_CASCADE.filter(m => m !== PRIMARY_MODEL)];
    let lastError: any;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS_PER_FILE; attempt++) {
        const model = models[(attempt - 1) % models.length];
        try {
            const { parsed, usedModel } = await callOpenRouter(model, rawText);
            console.log(`  -> OK con ${model} (servido por: ${usedModel})`);
            return parsed;
        } catch (error: any) {
            lastError = error;
            console.error(`  -> Intento ${attempt}/${MAX_ATTEMPTS_PER_FILE} (${model}) fallido: ${error.message}`);
            if (attempt < MAX_ATTEMPTS_PER_FILE) {
                await new Promise(r => setTimeout(r, 5000 * attempt));
            }
        }
    }
    throw lastError;
}

async function processFiles() {
    const allFiles = getFiles(BASE_DIR, ['.zip', '.elp'])
        .filter(file => !ONLY_EXT || file.endsWith(ONLY_EXT))
        .sort();

    console.log(`Encontrados ${allFiles.length} proyectos para analizar${ONLY_EXT ? ` (filtro: ${ONLY_EXT})` : ''}...`);
    console.log(`Proveedor: OpenRouter | Modelo principal: ${PRIMARY_MODEL}`);

    // Partimos de lo ya ingerido para no perderlo ni re-procesarlo.
    let examples = dedupeExamples(loadExistingExamples());
    console.log(`Ejemplos existentes (deduplicados): ${examples.length}`);

    // Evitamos re-procesar ficheros ya ingeridos (los nuevos guardan su `source`).
    const processedSources = new Set(examples.map(e => e.source).filter(Boolean));

    let count = 1;
    for (const file of allFiles) {
        const filename = path.basename(file);
        console.log(`\n[${count}/${allFiles.length}] Procesando ${filename}...`);
        count++;

        if (processedSources.has(filename)) {
            console.log(`  -> Saltando ${filename}: ya ingerido previamente.`);
            continue;
        }

        try {
            const rawText = extractTextFromZip(file);
            if (!rawText || rawText.trim().length < MIN_INPUT_CHARS) {
                console.log(`  -> Saltando ${filename}: No hay contenido texto suficiente.`);
                continue;
            }

            const jsonResp = await summarize(rawText);
            const before = examples.length;
            examples = dedupeExamples([...examples, { ...jsonResp, source: filename }]);

            if (examples.length > before) {
                console.log(`  -> ¡Éxito! Título: ${jsonResp.title}`);
            } else {
                console.log(`  -> Duplicado (mismo título): ${jsonResp.title}`);
            }
            processedSources.add(filename);
            save(examples);
        } catch (error: any) {
            console.error(`  -> ERROR procesando ${filename}:`, error.message);
        }

        if (count <= allFiles.length) {
            await new Promise(r => setTimeout(r, DELAY_BETWEEN_FILES_MS));
        }
    }

    examples = dedupeExamples(examples);
    save(examples);
    console.log(`\n✅ Finalizado. ${examples.length} proyectos únicos guardados en ${path.relative(process.cwd(), OUTPUT_FILE)}`);
}

processFiles();
