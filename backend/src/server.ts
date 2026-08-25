import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

import { authMiddleware, JWT_SECRET } from './auth';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a Base de Datos local
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pai_db')
  .then(() => console.log('MongoDB Conectado'))
  .catch(err => console.error(err));

// --- Esquemas de MongoDB ---
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['pending', 'teacher', 'admin'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', UserSchema);

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
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});
const Project = mongoose.model('Project', ProjectSchema);

// Aplicar middleware de autenticación a toda la API
app.use('/api', authMiddleware);

// Endpoint Auth: Registrar
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'El email ya está registrado' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.json({ message: 'Usuario registrado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Endpoint Auth: Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Credenciales inválidas' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign({ _id: user._id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

// Middleware de roles
const requireAdmin = (req: any, res: any, next: any) => {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Requiere permisos de administrador' });
  next();
};

const requireApproved = (req: any, res: any, next: any) => {
  if (req.user?.role === 'pending') return res.status(403).json({ error: 'Tu cuenta está pendiente de aprobación por un administrador.' });
  next();
};

// Endpoints Admin: Gestión de Usuarios
app.get('/api/admin/users', requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error obteniendo usuarios' });
  }
});

app.put('/api/admin/users/:id/role', requireAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    await User.findByIdAndUpdate(req.params.id, { role });
    res.json({ message: 'Rol actualizado' });
  } catch (err) {
    res.status(500).json({ error: 'Error actualizando rol' });
  }
});

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

const esToCa: Record<string, string> = {
  "Biología y Geología": "Biologia i Geologia",
  "Economía y Emprendimiento": "Economia i Emprenedoria",
  "Física y Química": "Física i Química",
  "Geografía e Historia": "Geografia i Història",
  "Lengua Castellana y Literatura": "Llengua Castellana i Literatura",
  "Lengua Catalana y Literatura": "Llengua Catalana i Literatura",
  "Matemáticas": "Matemàtiques",
  "Tecnología y Digitalización": "Tecnologia i Digitalització",
  "Ámbito Científico y Tecnológico": "Àmbit Científic i Tecnològic",
  "Ámbito Lingüístico y Social": "Àmbit Lingüístic i Social",
  "Formación Profesional": "Formació Professional"
};

const caToEs: Record<string, string> = Object.entries(esToCa).reduce((acc, [es, ca]) => {
  acc[ca] = es;
  return acc;
}, {} as Record<string, string>);

// Endpoint 1b: Obtener todas las CEs (ESO - Diversificación)
app.get('/api/ces', async (req, res) => {
  try {
    const lang = req.query.lang === 'catalan' ? 'ca' : 'es';
    const ces = await CE.find();
    
    const mapped = ces.map(c => {
      // Base (asumiendo que viene en catalán)
      let subjectBase = c.subject;
      let areaBase = c.area;

      // Agrupar Matemáticas
      if (subjectBase.startsWith('Matemàtiques')) {
        subjectBase = 'Matemàtiques';
      }

      const subjectCa = subjectBase;
      const subjectEs = caToEs[subjectBase] || subjectBase;
      
      const areaCa = areaBase;
      const areaEs = caToEs[areaBase] || areaBase;

      return {
        area: lang === 'ca' ? areaCa : areaEs,
        subject: lang === 'ca' ? subjectCa : subjectEs,
        ce_id: c.ce_id,
        description: lang === 'ca' && c.description_ca ? c.description_ca : c.description_es || c.get('description'),
        criterios: lang === 'ca' && c.criterios_ca ? c.criterios_ca : c.criterios_es || c.get('criterios')
      };
    });
    res.json(mapped);
  } catch (error) {
    console.error("Error cargando CEs:", error);
    res.status(500).json({ error: "No se pudieron cargar las CEs" });
  }
});

// Sembrado inicial de datos (Seeder)
import { runMigrations } from './migrations/runner';

mongoose.connection.once('open', () => {
  // Ahora usamos el motor de migraciones
  runMigrations();
});

// Endpoint 2: Historial de Proyectos
app.get('/api/projects', async (req: any, res) => {
  try {
    const projects = await Project.find().populate('userId', 'name').sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error("Error al obtener proyectos:", error);
    res.status(500).json({ error: "Error al recuperar historial" });
  }
});

// Endpoint 3: Generar y Guardar Proyecto con Gemini
app.post('/api/projects/generate', requireApproved, async (req: any, res) => {
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

    // Cargar ejemplos de INTEF (RAG de proyectos)
    let intefExamplesContext = '';
    try {
      const examplesPath = path.join(process.cwd(), 'src/data/intef_examples.json');
      if (fs.existsSync(examplesPath)) {
        const examplesData = JSON.parse(fs.readFileSync(examplesPath, 'utf-8'));
        if (examplesData.length > 0) {
          // Cargamos TODOS los ejemplos sin límite
          intefExamplesContext = '\n\nEJEMPLOS INSPIRADORES DE PROYECTOS REALES (INTEF):\nInspírate en la riqueza de actividades y la estructura de estos proyectos modelo:\n' + 
            examplesData.map((ex: any) => `### PROYECTO: ${ex.title}\nDESCRIPCIÓN: ${ex.description}\nEXTRACTO DE ACTIVIDADES: ${ex.content_sample}`).join('\n\n');
        }
      }
    } catch (e) {
      console.warn("No se pudo cargar intef_examples.json, omitiendo ejemplos INTEF.", e);
    }
    
    // Cargar Proyectos Aprobados de la plataforma
    let approvedProjectsContext = '';
    try {
      const approvedProjects = await Project.find({ status: 'aprobado' });
      if (approvedProjects.length > 0) {
        approvedProjectsContext = '\n\nPROYECTOS APROBADOS DE LA PLATAFORMA (Usa esto para entender el tono y el éxito pasado):\n' +
          approvedProjects.map((p: any) => `### PROYECTO APROBADO: ${p.title || 'Sin Título'}\nCONTENIDO:\n${p.rawText}`).join('\n\n');
      }
    } catch (e) {
      console.warn("Error cargando proyectos aprobados de la base de datos", e);
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
${knowledgeBase}

${intefExamplesContext}

${approvedProjectsContext}`;

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
      userId: (req as any).user?._id,
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
