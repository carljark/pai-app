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

// Endpoint 1: Obtener RAs (Simulados para el MVP)
app.get('/api/ras', (req, res) => {
  res.json([
    { id: 'RA1', module: 'Atención al Cliente', description: 'Aplica técnicas de comunicación verbal.' },
    { id: 'RA2', module: 'Maquillaje', description: 'Elabora bocetos y diseños según especificaciones.' }
  ]);
});

// Endpoint 2: Generar y Guardar Proyecto con Gemini
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
