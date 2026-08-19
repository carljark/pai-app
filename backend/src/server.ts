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

// --- Esquemas de MongoDB ---
const ProjectSchema = new mongoose.Schema({
  modules: [String],
  ras: [String],
  generatedContent: Object, // { rawText: "markdown string" }
  status: { type: String, enum: ['borrador', 'publicado'], default: 'borrador' },
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
    const involvedModules = modules && modules.length > 0 ? modules : ['Módulo(s) Desconocido(s)'];
    const metodologiaElegida = methodology || 'ABP (Aprendizaje Basado en Proyectos)';

    const systemInstruction = `ROL Y CONTEXTO:
Eres el "Motor Pedagógico" de la Plataforma de Aprendizaje Intermodular (PAI), un experto de máximo nivel en diseño instruccional, metodologías activas (ABP, ABR, ApS) y Formación Profesional Básica (FPB). 
Tu objetivo es ayudar a los docentes a diseñar proyectos intermodulares que conecten módulos teóricos (Ámbitos) con módulos prácticos (Taller), reduciendo su carga burocrática y maximizando la motivación de estudiantes adolescentes (15-17 años).

REGLAS PEDAGÓGICAS INQUEBRANTABLES:
1. Conexión con la realidad: Nunca propongas exámenes tradicionales, resúmenes teóricos aburridos ni trabajos puramente académicos. Todo proyecto debe simular un entorno laboral real, una empresa, un evento o un servicio a la comunidad.
2. Integración invisible: La teoría (matemáticas, ciencias, lengua, inglés) no debe parecer una asignatura separada, sino una herramienta indispensable para que el alumno pueda ejecutar la parte práctica (el taller) con éxito.
3. Evaluación Formativa y Triangulada: Obligatoriamente debes incluir herramientas de evaluación continua: autoevaluación, coevaluación (diarios de aprendizaje, dianas de evaluación, listas de cotejo) y una justificación para una Rúbrica Intermodular Compartida.
4. Tono: Redacta la propuesta con un tono profesional, inspirador y directamente aplicable al aula. Dirígete al equipo docente.

FORMATO DE ENTRADA (INPUT):
El usuario te proporcionará un listado de Módulos, Resultados de Aprendizaje (RA) y Competencias Específicas (CE) extraídos del currículo oficial.

FORMATO DE SALIDA EXIGIDO (OUTPUT):
Debes generar SIEMPRE la respuesta utilizando la siguiente estructura basada en el "Canvas de Proyecto Intermodular", respetando los siguientes encabezados exactos en formato Markdown:

### IDENTIDAD DEL PROYECTO
- **TÍTULO:** (Crea un título atractivo y motivador para un adolescente).
- **CENTRO Y CICLO FORMATIVO:** (Ej: IES Cap de Llevant - FPB).
- **CURSO:** (1º o 2º).
- **ESTRATEGIA METODOLÓGICA:** (Ej: ABP, ABR, ApS...).

### 1. CONTEXTO Y RETO
- **NECESIDAD DETECTADA:** (Breve descripción de la necesidad detectada en el sector).
- **CONEXIÓN CON EL ENTORNO Y VALOR QUE APORTA:** (Relación con el entorno, beneficios y/o impacto social en la comunidad).
- **EMPRESA, ENTIDAD O CONTEXTO PROFESIONAL:** (Situar el proyecto en su marco profesional real o simulado).

### 2. DESARROLLO Y FASES
- **SECUENCIACIÓN Y DURACIÓN ESTIMADA:** (Planificación general y sesiones previstas).
- **FASES DEL PROYECTO:** (Divide el proyecto en fases. Desarrolla las actividades de cada fase con gran detalle, de forma exhaustiva y realista, especificando paso a paso qué tienen que hacer los alumnos y qué módulo entra en juego en cada momento).

### 3. ACTIVIDAD DEL ALUMNADO
- **AGRUPAMIENTO / ORGANIZACIÓN:** (Gran grupo, pequeño grupo, individual, cooperativo...).
- **QUÉ INVESTIGA / DISEÑA / PRODUCE / EVALÚA:** (Explicación del rol del alumnado a lo largo del proceso).

### 4. INTEGRACIÓN CURRICULAR
- **MÓDULOS IMPLICADOS Y RESULTADOS DE APRENDIZAJE VINCULADOS:** (Mapea de forma clara cómo se justifican los RA que el usuario introdujo en el input dentro de las actividades).

### 5. PRODUCTO FINAL
- (Breve descripción del producto o servicio final del proyecto).

### 6. EVALUACIÓN
- **FORMATIVA:** (Descripción de cómo se hará la auto-evaluación, co-evaluación, etc.).
- **INSTRUMENTOS Y EVIDENCIAS DEL PROCESO:** (Propón instrumentos concretos. Además, OBLIGATORIAMENTE incluye aquí una Rúbrica de Evaluación Intermodular en forma de tabla Markdown con niveles de desempeño y qué RA/Módulo evalúa cada fila).

### 7. DIFUSIÓN
- (Redes sociales, página web del centro, cartelería...).

### 8. VIABILIDAD REAL
- **RECURSOS NECESARIOS:** (Espacios, materiales y colaboraciones con entidades de la isla).
- **COORDINACIÓN DOCENTE:** (Reuniones de coordinación, co-docencia y organización horaria).

⚠️ IMPORTANTE Y ESTRICTO: Tu respuesta NO debe contener NINGÚN texto introductorio, conversacional ni saludo (prohibido decir "Aquí tienes la propuesta..."). Tu respuesta DEBE EMPEZAR EXACTAMENTE Y ÚNICAMENTE con el encabezado: "### IDENTIDAD DEL PROYECTO".`;

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
      modules: involvedModules,
      ras: selectedRas || [],
      generatedContent: { rawText: response.text }
    });

    res.status(201).json(newProject);
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend PAI escuchando en puerto ${PORT}`));
