import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a Base de Datos local
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pai_db')
  .then(() => console.log('MongoDB Conectado'))
  .catch(err => console.error(err));

// Modelo de Proyecto Mínimo
const ProjectSchema = new mongoose.Schema({
  title: String,
  modules: [String],
  ras: [String],
  generatedContent: Object,
  createdAt: { type: Date, default: Date.now }
});
const Project = mongoose.model('Project', ProjectSchema);

// Modelo de Resultados de Aprendizaje (BOE)
const RaSchema = new mongoose.Schema({
  id: String,
  module: String,
  description: String
});
const RA = mongoose.model('RA', RaSchema);

// Sembrado inicial de datos (Seeder)
async function seedDB() {
  const count = await RA.countDocuments();
  if (count === 0) {
    await RA.insertMany([
      { id: 'RA1', module: 'Atención al Cliente', description: 'Aplica técnicas de comunicación verbal y no verbal en la atención.' },
      { id: 'RA2', module: 'Atención al Cliente', description: 'Atiende consultas, quejas y reclamaciones según protocolo.' },
      { id: 'RA1', module: 'Maquillaje', description: 'Elabora bocetos y diseños según especificaciones técnicas.' },
      { id: 'RA2', module: 'Maquillaje', description: 'Aplica técnicas de maquillaje de día adaptadas al cliente.' },
      { id: 'RA1', module: 'Ciencias Aplicadas', description: 'Resuelve problemas matemáticos vinculados al sector profesional.' },
      { id: 'RA1', module: 'Comunicación y Sociedad', description: 'Elabora textos y exposiciones orales persuasivas sobre el ámbito laboral.' }
    ]);
    console.log('✅ Base de datos inicializada con el currículo del BOE.');
  }
}
mongoose.connection.once('open', () => seedDB());

// Endpoint 1: Obtener RAs (Desde MongoDB)
app.get('/api/ras', async (req, res) => {
  try {
    const ras = await RA.find();
    res.json(ras);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo los RAs" });
  }
});

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
    const { modules, selectedRas, methodology } = req.body;
    
    // Extraemos los módulos o ponemos unos por defecto si el frontend aún no los envía bien
    const modA = modules && modules.length > 0 ? modules[0] : 'Atención al Cliente';
    const modB = modules && modules.length > 1 ? modules[1] : 'Maquillaje';
    const metodologiaElegida = methodology || 'ABP (Aprendizaje Basado en Proyectos)';

    // Instrucción del Sistema extraída de los Requisitos Pedagógicos de PAI
    const systemInstruction = `Actúa como un diseñador curricular experto en Formación Profesional Básica y metodologías activas (${metodologiaElegida}). 
Tu tarea es diseñar un proyecto de aprendizaje colaborativo intermodular que fusione de manera inseparable los siguientes módulos: ${modA} y ${modB}.

Reglas estrictas de diseño:
1. El proyecto debe plantear un reto real o simulado adaptado a la realidad del sector productivo.
2. Es obligatorio e indispensable que la solución final requiera que el estudiante aplique simultáneamente los Resultados de Aprendizaje de ambos módulos. El proyecto no se puede resolver exitosamente usando conocimientos de una sola de las áreas.
3. Estructura tu respuesta con la siguiente plantilla (usa Markdown):
   - Título del Proyecto (atractivo y motivacional para grado básico).
   - El Escenario / Reto.
   - Tareas del Módulo A (Resultados de Aprendizaje y criterios asociados).
   - Tareas del Módulo B (Resultados de Aprendizaje y criterios asociados).
   - El Producto o Entregable final donde se unifican ambos módulos de forma inseparable.
   - Pautas para la evaluación formativa conjunta (rúbrica cualitativa triangulada).
   - Preguntas de reflexión metacognitiva y rutinas de pensamiento para el portafolio del alumno.`;

    const userPrompt = `Por favor, diseña el proyecto intermodular integrando específicamente estos Resultados de Aprendizaje (RAs):
${selectedRas ? selectedRas.join('\\n- ') : 'Los genéricos de ambos módulos'}`;

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
    const newProject = await Project.create({
      modules: [modA, modB],
      ras: selectedRas || [],
      generatedContent: { rawText: response.text }
    });

    res.status(201).json(newProject);
  } catch (error) {
    console.error("Error contactando a Gemini:", error);
    res.status(500).json({ error: "Error en el motor de IA intermodular" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend PAI escuchando en puerto ${PORT}`));
