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

// Endpoint 2: Generar y Guardar Proyecto
app.post('/api/projects/generate', async (req, res) => {
  const { selectedRas, methodology } = req.body;

  // En la versión MVP, simulamos o enviamos la petición rápida a Gemini / LLM
  const mockGeneratedProject = {
    title: "Proyecto Integrado: Stand Interactivo de Belleza",
    challenge: "Diseñar un servicio de maquillaje aplicando protocolos de comunicación real.",
    tasks: ["Bocetar propuesta", "Simulación de venta y atención"],
    rubric: "Evaluación conjunta de RAs seleccionados."
  };

  const newProject = await Project.create({
    modules: ['Atención al Cliente', 'Maquillaje'],
    ras: selectedRas,
    generatedContent: mockGeneratedProject
  });

  res.status(201).json(newProject);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend PAI escuchando en puerto ${PORT}`));
