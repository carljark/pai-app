import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a Base de Datos local
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pai_db')
  .then(() => console.log('MongoDB Conectado'))
  .catch(err => console.error(err));

// --- Esquemas de MongoDB ---
const ProjectSchema = new mongoose.Schema({
  title: String,
  modules: [String],
  ras: [String],
  methodology: String,
  tipoNivel: { type: String, enum: ['FP_BASICA', 'DIVERSIFICACION_CURRICULAR'], default: 'FP_BASICA' },
  status: { type: String, enum: ['borrador', 'publicado'], default: 'borrador' },
  generatedContent: {
    rawText: String,
    jsonStructure: Object
  },
  createdAt: { type: Date, default: Date.now }
});
const Project = mongoose.model('Project', ProjectSchema);

// Modelo de Resultados de Aprendizaje (BOE)
const RaSchema = new mongoose.Schema({
  id: String,
  module: String,
  description: String,
  description_es: String,
  description_ca: String
});
const RA = mongoose.model('RA', RaSchema);

const moduleTranslations: Record<string, string> = {
  "Atención al cliente": "Atenció al client",
  "Cambio de color del cabello": "Canvi de color del cabell",
  "Ciencias aplicadas I": "Ciències aplicades I",
  "Ciencias aplicadas II": "Ciències aplicades II",
  "Comunicación y sociedad I": "Comunicació i societat I",
  "Comunicación y sociedad II": "Comunicació i societat II",
  "Cuidados estéticos básicos de uñas": "Cures estètiques bàsiques d'ungles",
  "Depilación mecánica y decoloración del vello superfluo": "Depilació mecànica i decoloració del pèl superflu",
  "Lavado y cambios de forma del cabello": "Rentat i canvis de forma del cabell",
  "Maquillaje": "Maquillatge",
  "Preparación del entorno profesional": "Preparació de l'entorn professional"
};

// Endpoint 1: Obtener todos los RAs (FP Básica)
app.get('/api/ras', async (req, res) => {
  try {
    const lang = req.query.lang === 'catalan' ? 'ca' : 'es';
    const ras = await RA.find();
    
    const mapped = ras.map(r => ({
      id: r.id,
      module: lang === 'ca' ? (moduleTranslations[r.module] || r.module) : r.module,
      description: lang === 'ca' && r.description_ca ? r.description_ca : r.description_es || r.get('description')
    }));
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ error: "No se pudieron cargar los RAs" });
  }
});

// Modelo de Competencias Específicas (ESO)
const CESchema = new mongoose.Schema({
  area: String,
  subject: String,
  ce_id: String,
  description_es: String,
  description_ca: String,
  criterios_es: Array,
  criterios_ca: Array
});
const CE = mongoose.model('CE', CESchema);

const subjectTranslations: Record<string, string> = {
  "Biología y Geología": "Biologia i Geologia",
  "Economía y Emprendimiento": "Economia i Emprenedoria",
  "Física y Química": "Física i Química",
  "Geografía e Historia": "Geografia i Història",
  "Lengua Castellana y Literatura": "Llengua Castellana i Literatura",
  "Lengua Catalana y Literatura": "Llengua Catalana i Literatura",
  "Matemáticas": "Matemàtiques",
  "Tecnología y Digitalización": "Tecnologia i Digitalització",
  "Ámbito Científico-Tecnológico": "Àmbit Científic-Tecnològic",
  "Ámbito Lingüístico y Social": "Àmbit Lingüístic i Social",
  "Formación Profesional": "Formació Professional",
  "Ciencias de la Naturaleza": "Ciències de la Naturalesa",
  "Ciencias Sociales": "Ciències Socials"
};

// Endpoint 1b: Obtener todas las CEs (ESO - Diversificación)
app.get('/api/ces', async (req, res) => {
  try {
    const lang = req.query.lang === 'catalan' ? 'ca' : 'es';
    const ces = await CE.find();
    
    const mapped = ces.map(c => ({
      area: lang === 'ca' ? (subjectTranslations[c.area] || c.area) : c.area,
      subject: lang === 'ca' ? (subjectTranslations[c.subject] || c.subject) : c.subject,
      ce_id: c.ce_id,
      description: lang === 'ca' && c.description_ca ? c.description_ca : c.description_es || c.get('description'),
      criterios: lang === 'ca' && c.criterios_ca ? c.criterios_ca : c.criterios_es || c.get('criterios')
    }));
    res.json(mapped);
  } catch (error) {
    console.error("Error cargando CEs:", error);
    res.status(500).json({ error: "No se pudieron cargar las CEs" });
  }
});

// Sembrado inicial de datos (Seeder)
async function seedDB() {
  const count = await RA.countDocuments();
  if (count > 0) {
    console.log('✅ Base de datos ya inicializada. Omitiendo seed.');
    return;
  }
  await RA.deleteMany({}); // Purgar mock data anterior
  await RA.insertMany([
    // Preparación del entorno profesional
    { id: 'RA_PEP_1', module: 'Preparación del entorno profesional', description: '1. Muestra una imagen personal y profesional adecuada en el entorno de trabajo relacionándola con la higiene corporal y la estética personal.' },
    { id: 'RA_PEP_2', module: 'Preparación del entorno profesional', description: '2. Prepara las instalaciones, aplicando las técnicas de higienización.' },
    { id: 'RA_PEP_3', module: 'Preparación del entorno profesional', description: '3. Recepciona material de peluquería y estética, identificando sus características y aplicaciones.' },
    { id: 'RA_PEP_4', module: 'Preparación del entorno profesional', description: '4. Acomoda y protege al cliente en función de las características del servicio previsto, aplicando las técnicas y las normas de comportamiento apropiadas en condiciones de calidad, higiene y seguridad.' },
    // Cuidados estéticos básicos de uñas
    { id: 'RA_CEN_1', module: 'Cuidados estéticos básicos de uñas', description: '1. Prepara equipos, útiles y productos de manicura y pedicura, reconociendo sus características y aplicaciones.' },
    { id: 'RA_CEN_2', module: 'Cuidados estéticos básicos de uñas', description: '2. Observa las uñas, reconociendo las alteraciones más relevantes.' },
    { id: 'RA_CEN_3', module: 'Cuidados estéticos básicos de uñas', description: '3. Aplica técnicas básicas de manicura, relacionando las características morfológicas de las manos y de las uñas con la forma final de éstas últimas.' },
    { id: 'RA_CEN_4', module: 'Cuidados estéticos básicos de uñas', description: '4. Aplica técnicas básicas de pedicura, relacionando las características morfológicas de los pies y de las uñas con la forma final de éstas últimas.' },
    // Maquillaje
    { id: 'RA_MAQ_1', module: 'Maquillaje', description: '1. Prepara útiles y productos de maquillaje, reconociendo sus características y aplicaciones.' },
    { id: 'RA_MAQ_2', module: 'Maquillaje', description: '2. Prepara la piel del cliente, aplicando técnicas de higiene y protección.' },
    { id: 'RA_MAQ_3', module: 'Maquillaje', description: '3. Aplica técnicas de maquillaje social, relacionado el tipo de maquillaje con las necesidades del cliente.' },
    { id: 'RA_MAQ_4', module: 'Maquillaje', description: '4. Realiza maquillajes básicos de fantasía facial, determinando la armonía estética y cromática de los mismos.' },
    // Comunicación y sociedad I (9 RAs)
    { id: 'CE_CS1_1', module: 'Comunicación y sociedad I', description: '1. Valora la importancia de la comunicación oral y escrita, reconociendo su papel en situaciones de aprendizaje y en su entorno social y profesional.' },
    { id: 'CE_CS1_2', module: 'Comunicación y sociedad I', description: '2. Comprende textos orales identificando la intención comunicativa y el sentido global del mensaje.' },
    { id: 'CE_CS1_3', module: 'Comunicación y sociedad I', description: '3. Utiliza estrategias comunicativas para interpretar y comunicar información oral en lengua castellana, aplicando los principios de la escucha activa, estrategias sencillas de composición y las normas lingüísticas básicas.' },
    { id: 'CE_CS1_4', module: 'Comunicación y sociedad I', description: '4. Comprende textos escritos extraídos de su entorno personal y profesional.' },
    { id: 'CE_CS1_5', module: 'Comunicación y sociedad I', description: '5. Redacta textos escritos sencillos relacionados con su entorno académico y profesional.' },
    { id: 'CE_CS1_6', module: 'Comunicación y sociedad I', description: '6. Utiliza estrategias para comunicar información oral en lengua inglesa, elaborando presentaciones orales de poca extensión, bien estructuradas, relativas a situaciones habituales de comunicación cotidiana y frecuente de ámbito personal o profesional.' },
    { id: 'CE_CS1_7', module: 'Comunicación y sociedad I', description: '7. Participa en conversaciones en lengua inglesa utilizando un lenguaje sencillo y claro en situaciones habituales frecuentes del ámbito personal o profesional, activando estrategias de comunicación básicas.' },
    { id: 'CE_CS1_8', module: 'Comunicación y sociedad I', description: '8. Elabora textos escritos en lengua inglesa, breves y sencillos de situaciones de comunicación habituales y frecuentes del ámbito personal o profesional, aplicando estrategias de lectura comprensiva y desarrollando estrategias estructuradas de composición.' },
    { id: 'CE_CS1_9', module: 'Comunicación y sociedad I', description: '9. Utiliza de forma guiada las tecnologías de la información y la comunicación.' },
    // Ciencias aplicadas I
    { id: 'CE_CA1_1', module: 'Ciencias aplicadas I', description: '1. Resuelve problemas matemáticos en situaciones cotidianas, utilizando los elementos básicos del lenguaje matemático y sus operaciones.' },
    { id: 'CE_CA1_2', module: 'Ciencias aplicadas I', description: '2. Reconoce las instalaciones y el material de laboratorio.' },
    { id: 'CE_CA1_3', module: 'Ciencias aplicadas I', description: '3. Identifica la materia y la energía, valorando sus usos.' },
    { id: 'CE_CA1_4', module: 'Ciencias aplicadas I', description: '4. Reconoce los cambios en la materia, relacionándolos con su estructura térmica.' },
    { id: 'CE_CA1_5', module: 'Ciencias aplicadas I', description: '5. Identifica las partes de la célula y sus funciones.' },
    { id: 'CE_CA1_6', module: 'Ciencias aplicadas I', description: '6. Reconoce hábitos de vida saludables.' },
    { id: 'CE_CA1_7', module: 'Ciencias aplicadas I', description: '7. Relaciona la salud con el medio ambiente.' },
    // Depilación mecánica y decoloración del vello superfluo
    { id: 'RA_DEP_1', module: 'Depilación mecánica y decoloración del vello superfluo', description: '1. Observa las características del pelo y de la zona a tratar, relacionándolo con las técnicas que pueden ser empleadas.' },
    { id: 'RA_DEP_2', module: 'Depilación mecánica y decoloración del vello superfluo', description: '2. Prepara equipos, útiles y productos de depilación y decoloración, reconociendo sus características y aplicaciones.' },
    { id: 'RA_DEP_3', module: 'Depilación mecánica y decoloración del vello superfluo', description: '3. Depila de forma mecánica, relacionando la técnica seleccionada con los efectos finales.' },
    { id: 'RA_DEP_4', module: 'Depilación mecánica y decoloración del vello superfluo', description: '4. Decolora el vello, reconociendo el efecto de los productos sobre el vello y la piel.' },
    // Lavado y cambios de forma del cabello
    { id: 'RA_LCC_1', module: 'Lavado y cambios de forma del cabello', description: '1. Observa el estado del cuero cabelludo y cabello, reconociendo las alteraciones más relevantes.' },
    { id: 'RA_LCC_2', module: 'Lavado y cambios de forma del cabello', description: '2. Prepara equipos y útiles de lavado y cambios de forma, reconociendo sus características y aplicaciones.' },
    { id: 'RA_LCC_3', module: 'Lavado y cambios de forma del cabello', description: '3. Lava/acondiciona el cabello, relacionándolo con las características del mismo.' },
    { id: 'RA_LCC_4', module: 'Lavado y cambios de forma del cabello', description: '4. Cambia la forma del cabello de manera temporal, relacionando las técnicas de cambios temporal seleccionada con el efecto final.' },
    { id: 'RA_LCC_5', module: 'Lavado y cambios de forma del cabello', description: '5. Cambia la forma del cabello de manera permanente, relacionando las técnicas de cambio permanente seleccionadas con el efecto final.' },
    // Cambio de color del cabello
    { id: 'RA_CCC_1', module: 'Cambio de color del cabello', description: '1. Prepara equipos y útiles de cambio de color reconociendo sus características y aplicaciones.' },
    { id: 'RA_CCC_2', module: 'Cambio de color del cabello', description: '2. Decolora el cabello reconociendo el efecto de los productos sobre el cabello.' },
    { id: 'RA_CCC_3', module: 'Cambio de color del cabello', description: '3. Colorea el conjunto del cabello, relacionando la técnica seleccionada con los efectos finales.' },
    { id: 'RA_CCC_4', module: 'Cambio de color del cabello', description: '4. Colorea parcialmente el cabello, relacionando la técnica seleccionada con los efectos finales.' },
    // Atención al cliente
    { id: 'RA_ATC_1', module: 'Atención al cliente', description: '1. Atiende a posibles clientes, reconociendo las diferentes técnicas de comunicación.' },
    { id: 'RA_ATC_2', module: 'Atención al cliente', description: '2. Comunica al posible cliente las diferentes posibilidades del servicio, justificándolas desde el punto de vista técnico.' },
    // Comunicación y sociedad II
    { id: 'CE_CS2_1', module: 'Comunicación y sociedad II', description: '1. Utiliza estrategias de comunicación para interpretar y comunicar información oral en diferentes contextos.' },
    // Ciencias aplicadas II
    { id: 'CE_CA2_1', module: 'Ciencias aplicadas II', description: '1. Aplica métodos científicos y matemáticos para resolver problemas del entorno profesional y social.' }
  ]);
  console.log('✅ Base de datos inicializada y actualizada con el currículo del BOE (FPB).');
}
mongoose.connection.once('open', () => seedDB());

// Endpoint 2: Historial de Proyectos
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error("Error al obtener proyectos:", error);
    res.status(500).json({ error: "Error al recuperar historial" });
  }
});

// Endpoint 3: Generar y Guardar Proyecto con Gemini
app.post('/api/projects/generate', async (req, res) => {
  try {
    const { modules, selectedRas, methodology, tipoNivel, courseLevel } = req.body;
    
    const involvedModules = modules && modules.length > 0 ? modules : ['Módulo(s) Desconocido(s)'];
    const metodologiaElegida = methodology || 'ABP (Aprendizaje Basado en Proyectos)';
    const lang = req.body.language || 'castellano';
    const nivelElegido = courseLevel || (tipoNivel === 'FP_BASICA' ? '1º Curso' : '3º ESO');

    // Cargar la base de conocimiento (RAG local)
    let knowledgeBase = '';
    try {
      knowledgeBase = fs.readFileSync(path.join(process.cwd(), 'knowledge_base.md'), 'utf-8');
    } catch (e) {
      console.warn("No se pudo cargar knowledge_base.md, omitiendo contexto metodológico extra.");
    }
    
    let baseInstruction = `ROL Y CONTEXTO:
Eres el "Motor Pedagógico" de la Plataforma de Aprendizaje Intermodular (PAI), un experto de máximo nivel en diseño instruccional, metodologías activas (ABP, ABR, ApS).
Tu objetivo es ayudar a los docentes a diseñar proyectos/situaciones que conecten diferentes áreas.

REGLAS PEDAGÓGICAS INQUEBRANTABLES:
1. Conexión con la realidad: Nunca propongas exámenes tradicionales ni trabajos puramente académicos. Debe simular un entorno profesional o un servicio a la comunidad.
2. Integración invisible: La teoría debe ser una herramienta indispensable para ejecutar la parte práctica.
3. Evaluación Formativa: Obligatoriamente debes incluir herramientas de evaluación continua (autoevaluación, coevaluación) y una justificación para una Rúbrica Compartida.
4. Tono: Redacta la propuesta con un tono profesional, inspirador y directamente aplicable al aula.
5. IDIOMA DE SALIDA: Todo el contenido generado, títulos, textos y rúbricas deben estar OBLIGATORIAMENTE redactados en ${lang.toUpperCase()}. No uses otro idioma bajo ningún concepto.

CONTEXTO DE EVALUACIÓN DEL CENTRO (BIBLIA METODOLÓGICA):
Aplica imperativamente estas reglas para estructurar la evaluación y las rúbricas:
${knowledgeBase}`;

    let formatInstruction = '';
    
    if (tipoNivel === 'DIVERSIFICACION_CURRICULAR') {
      formatInstruction = `
REGLAS ESPECÍFICAS PARA DIVERSIFICACIÓN CURRICULAR (ESO):
- NUNCA uses la palabra "Proyecto Intermodular". Debes llamarlo OBLIGATORIAMENTE "Situación de Aprendizaje".
- NUNCA uses "Resultados de Aprendizaje (RA)". Debes usar "Competencias Específicas (CE)" y "Criterios de Evaluación".

FORMATO DE SALIDA EXIGIDO (Markdown):
### IDENTIDAD DE LA SITUACIÓN DE APRENDIZAJE
- **TÍTULO:** (Atractivo y motivador para adolescentes).
- **NIVEL:** (${nivelElegido} - PDC).
- **ESTRATEGIA METODOLÓGICA:** (${metodologiaElegida}).

### 1. JUSTIFICACIÓN Y CONTEXTO
(Explica cómo esta situación conecta con la realidad del alumno y por qué es relevante).

### 2. CONCRECIÓN CURRICULAR
(Lista las Competencias Específicas y Criterios de Evaluación seleccionados y justifica cómo se trabajarán).

### 3. SECUENCIACIÓN DIDÁCTICA
(Fases claras: Motivación, Desarrollo/Investigación, Producto Final y Difusión. Describe las actividades).

### 4. EVALUACIÓN FORMATIVA Y FORMADORA
- **PRODUCTO FINAL:** (Qué van a crear tangiblemente).
- **HERRAMIENTAS DE EVALUACIÓN:** (Especifica herramientas y OBLIGATORIAMENTE incluye una Rúbrica de Evaluación en tabla Markdown).`;
    } else {
      // Por defecto FP Básica
      formatInstruction = `
REGLAS ESPECÍFICAS PARA FP BÁSICA:
- Utiliza la terminología "Proyecto Intermodular" y "Resultados de Aprendizaje (RA)".

FORMATO DE SALIDA EXIGIDO (Markdown):
### IDENTIDAD DEL PROYECTO
- **TÍTULO:** (Crea un título atractivo y motivador).
- **CENTRO Y CICLO FORMATIVO:** (Ej: IES Cap de Llevant - FPB).
- **CURSO:** (${nivelElegido}).
- **ESTRATEGIA METODOLÓGICA:** (${metodologiaElegida}).

### 1. CONTEXTO Y RETO
- **NECESIDAD DETECTADA:** (Breve descripción de la necesidad).
- **CONEXIÓN CON EL ENTORNO Y VALOR QUE APORTA:** (Impacto social/profesional).

### 2. DESARROLLO Y FASES
- **SECUENCIACIÓN Y FASES DEL PROYECTO:** (Divide en fases detalladas paso a paso).

### 3. ACTIVIDAD DEL ALUMNADO
- **QUÉ INVESTIGA / DISEÑA / PRODUCE:** (Explicación del rol del alumnado).

### 4. INTEGRACIÓN CURRICULAR
- **MÓDULOS IMPLICADOS Y RAs:** (Mapea cómo se justifican los RA seleccionados).

### 5. PRODUCTO FINAL
- (Breve descripción).

### 6. EVALUACIÓN Y DIFUSIÓN
- **FORMATIVA E INSTRUMENTOS:** (OBLIGATORIAMENTE incluye una Rúbrica Intermodular en tabla Markdown).`;
    }

    const systemInstruction = baseInstruction + "\n" + formatInstruction + `\n\n⚠️ IMPORTANTE: Empieza EXACTAMENTE con el primer encabezado Markdown, sin saludos ni introducciones ("Aquí tienes...").`;

    const userPrompt = `Por favor, diseña la propuesta integrando específicamente estos elementos curriculares:
${selectedRas ? selectedRas.join('\n- ') : 'Los genéricos de la especialidad'}
RECUERDA: Genera la respuesta ÍNTEGRAMENTE en idioma ${lang.toUpperCase()}.`;

    // Instanciamos el cliente (cogerá la variable de entorno GEMINI_API_KEY automáticamente)
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({});

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    // Guardamos en la Base de Datos
    const newProject = new Project({
      modules,
      ras: selectedRas,
      methodology,
      tipoNivel: tipoNivel || 'FP_BASICA',
      generatedContent: {
        rawText: response.text
      }
    });
    const savedProject = await newProject.save();

    res.json(savedProject);
  } catch (error) {
    console.error("Error contactando a Gemini:", error);
    res.status(500).json({ error: "Error en el motor de IA intermodular" });
  }
});

// Endpoint 4: Actualizar Proyecto (Borrador / Publicar)
app.put('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rawText, status } = req.body;
    const updatedProject = await Project.findByIdAndUpdate(id, {
      'generatedContent.rawText': rawText,
      status: status || 'borrador'
    }, { new: true });
    res.json(updatedProject);
  } catch (error) {
    console.error("Error al actualizar proyecto:", error);
    res.status(500).json({ error: "Error al actualizar" });
  }
});

// Endpoint 5: Reescribir sección con IA
app.post('/api/projects/rewrite', async (req, res) => {
  try {
    const { context, selectedText, instruction } = req.body;
    if (!selectedText || !instruction) {
      return res.status(400).json({ error: "Falta texto seleccionado o instrucción" });
    }

    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({});

    const prompt = `Eres el Motor Pedagógico PAI. El profesor está editando un proyecto intermodular.
Este es el PROYECTO ACTUAL (en formato Markdown):
${context}

El profesor ha subrayado en la pantalla el siguiente texto (nota: al seleccionarlo puede haber perdido el formato Markdown como asteriscos o almohadillas):
"""
${selectedText}
"""

INSTRUCCIÓN DEL PROFESOR para ese texto:
${instruction}

TAREA: 
1. Localiza a qué parte del PROYECTO ACTUAL corresponde el texto subrayado.
2. Reescribe esa parte según la instrucción.
3. Devuélveme el PROYECTO COMPLETO con el cambio ya integrado.
⚠️ IMPORTANTE Y ESTRICTO: Mantén el resto del proyecto EXACTAMENTE IGUAL. Devuelve ÚNICAMENTE el código Markdown del proyecto modificado, sin saludos, sin bloques de código tipo \`\`\`markdown, ni explicaciones previas.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt
    });

    res.json({ newText: response.text });
  } catch (error) {
    console.error("Error en reescritura IA:", error);
    res.status(500).json({ error: "Error al contactar con la IA para reescribir" });
  }
});

import multer from 'multer';

// Configuración de Multer para almacenar en la carpeta "uploads"
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const projectId = req.params.id;
    const dir = path.join(process.cwd(), 'uploads', projectId);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    // Para evitar problemas de codificación, decodificamos el nombre original por si acaso (ej. acentos UTF-8)
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
    cb(null, file.originalname);
  }
});
const upload = multer({ storage });

// Endpoint 6: Subir un archivo adjunto a un proyecto
app.post('/api/projects/:id/files', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No se proporcionó ningún archivo" });
  }
  res.json({ message: "Archivo subido con éxito", filename: req.file.originalname });
});

// Endpoint 7: Listar los archivos adjuntos de un proyecto
app.get('/api/projects/:id/files', (req, res) => {
  const projectId = req.params.id;
  const dir = path.join(process.cwd(), 'uploads', projectId);
  
  if (!fs.existsSync(dir)) {
    return res.json([]);
  }

  try {
    const files = fs.readdirSync(dir).map(filename => {
      const stats = fs.statSync(path.join(dir, filename));
      return {
        name: filename,
        size: stats.size,
        createdAt: stats.birthtime
      };
    });
    res.json(files);
  } catch (error) {
    console.error("Error al leer archivos:", error);
    res.status(500).json({ error: "Error al leer archivos adjuntos" });
  }
});

// Endpoint 8: Descargar un archivo adjunto
app.get('/api/projects/:id/files/:filename', (req, res) => {
  const { id, filename } = req.params;
  const filePath = path.join(process.cwd(), 'uploads', id, filename);
  
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ error: "Archivo no encontrado" });
  }
});

// Endpoint 9: Eliminar un archivo adjunto
app.delete('/api/projects/:id/files/:filename', (req, res) => {
  const { id, filename } = req.params;
  const filePath = path.join(process.cwd(), 'uploads', id, filename);
  
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
      res.json({ message: "Archivo eliminado correctamente" });
    } catch (e) {
      res.status(500).json({ error: "No se pudo eliminar el archivo" });
    }
  } else {
    res.status(404).json({ error: "Archivo no encontrado" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend PAI escuchando en puerto ${PORT}`));
