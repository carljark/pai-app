import type { Response } from 'express';
import mongoose from 'mongoose';
import { Project } from '../models/Project';
import { ActivityLog } from '../models/ActivityLog';
import { Settings } from '../models/Settings';
import { FpbMatch } from '../models/FpbMatch';
import { buildContexts, generateGeminiContent } from '../services/ai.service';
import fs from 'fs';
import path from 'path';
import { addClient, removeClient } from "../services/sse.service";
import { processQueue } from "../services/queue.service";

// Endpoint para el SSE
export const streamUpdates = (req: any, res: Response) => {
  const userId = req.user?._id?.toString();
  if (!userId) return res.status(401).json({ error: 'No autorizado' });

  // Configurar headers para SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const clientId = Date.now().toString();
  addClient(userId, clientId, res);

  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', message: 'SSE connection established' })}\n\n`);

  req.on('close', () => {
    removeClient(userId, clientId);
  });
};

export const generateProject = async (req: any, res: Response) => {
  try {
    const userId = req.user?._id;
    
    // 1. CONTROL DE CONCURRENCIA (1 proyecto generando/en cola a la vez por usuario)
    const pendingProjects = await Project.countDocuments({
      userId,
      status: { $in: ['en_cola', 'generando'] }
    });

    if (pendingProjects > 0) {
      return res.status(429).json({ error: 'Ya tienes un proyecto en la cola o generándose. Por favor, espera a que termine.' });
    }

    // 2. LIMITACIÓN DIARIA (ej. máx 10 proyectos por día)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dailyGenerations = await ActivityLog.countDocuments({
      userId,
      action: 'GENERATE_PROJECT',
      createdAt: { $gte: today }
    });

    if (dailyGenerations >= 10 && req.user?.role !== 'admin') {
      return res.status(429).json({ error: 'Has alcanzado el límite de 10 generaciones diarias. Inténtalo de nuevo mañana.' });
    }

    // 3. CONSTRUCCIÓN DEL PROMPT (Igual que antes, enriquecido con coincidencias de FPB)
    const { modules, selectedRas, methodology, tipoNivel, title, language, courseLevel } = req.body;
    const settings = await Settings.findOne();
    const { schoolContextStr, intefExamplesContext } = buildContexts(settings);

    let approvedProjectsContext = '';
    const approvedProjects = await Project.find({ status: 'publicado' }).limit(5);
    if (approvedProjects.length > 0) {
      approvedProjectsContext = "\n--- PROYECTOS APROBADOS DE LA PLATAFORMA ---\n" + 
        JSON.stringify(approvedProjects.map(p => ({ title: p.title, text: p.generatedContent?.rawText })));
    }

    // Obtener RAs y CEs para el enriquecimiento y extracción de códigos
    const allRas = await mongoose.models.RA.find();
    const allCes = mongoose.models.CE ? await mongoose.models.CE.find() : [];

    // Extraer códigos de los RAs seleccionados
    const selectedCodes = new Set<string>();
    for (const selectedStr of selectedRas || []) {
      const raDoc = allRas.find(r => r.description === selectedStr || r.description_es === selectedStr || r.description_ca === selectedStr);
      if (raDoc && raDoc.id) {
        const code = raDoc.id.split('_')[0];
        if (code) selectedCodes.add(code);
      }
    }

    // Buscar coincidencias y orientaciones curriculares de FPB si procede
    let fpbMatchesContext = '';
    let coincidenciaInstructions = '';
    if (tipoNivel === 'FP_BASICA') {
      const generalPromptDoc = await FpbMatch.findOne({ type: 'prompt_coincidencias' });
      if (generalPromptDoc) {
        coincidenciaInstructions = `\n\n--- INSTRUCCIONES ESPECÍFICAS DE DISEÑO PARA FP BÁSICA ---\n${generalPromptDoc.rawText}`;
      }

      if (selectedCodes.size > 0) {
        const matches = await FpbMatch.find({
          code: { $in: Array.from(selectedCodes) },
          type: { $in: ['coincidencia', 'actividad_ampliada', 'relacion_criterios'] }
        });
        if (matches.length > 0) {
          fpbMatchesContext = "\n\n--- COINCIDENCIAS Y ACTIVIDADES DE REFERENCIA DE FP BÁSICA (INSPIRACIÓN OBLIGATORIA) ---\n" +
            matches.map(m => `[Archivo: ${m.fileName} - Tipo: ${m.type} - Módulo: ${m.code || 'Transversal'}]\n${m.rawText}`).join('\n\n');
        }
      }
    }

    const baseInstruction = `Eres un experto en diseño instruccional y metodologías activas (ABP, Aps).
REGLA CRÍTICA INQUEBRANTABLE SOBRE EVALUACIÓN:
Cuando diseñes el proyecto y llegues al apartado de Evaluación, DEBES contemplar los criterios de evaluación aplicables a CADA UNO de los Resultados de Aprendizaje (RA) o Competencias Específicas (CE) seleccionados por el usuario.
NO puedes obviar ni saltarte NINGÚN resultado de aprendizaje seleccionado. TODOS han de aparecer obligatoriamente en el proyecto.
MUY IMPORTANTE: Cuando listes los RAs o las CEs y sus criterios de evaluación correspondientes, DEBES mantener estrictamente su NUMERACIÓN y NOMENCLATURA OFICIAL.

REGLA CRÍTICA INQUEBRANTABLE SOBRE EL DETALLE DE ACTIVIDADES/FASES:
NO puedes generar un proyecto corto, vago o resumido. DEBES desarrollar CADA FASE Y CADA ACTIVIDAD de forma pormenorizada y con el MÁXIMO NIVEL DE DETALLE posible.
Para CADA UNA de las actividades que propongas en el proyecto, DEBES incluir OBLIGATORIAMENTE la siguiente estructura detallada:
- **Título descriptivo** de la actividad.
- **Duración estimada** (en sesiones o minutos).
- **Agrupamiento** (individual, parejas, pequeño grupo, gran grupo).
- **Objetivos específicos** vinculados directamente a los RA/CE seleccionados.
- **Desarrollo paso a paso para el docente**: Instrucciones exactas de qué debe hacer el profesor, cómo introducir la actividad, qué explicar y cómo guiar.
- **Desarrollo paso a paso para el alumnado**: Qué pasos siguen los alumnos para completarla con éxito.
- **Materiales y recursos necesarios**: Herramientas digitales, plantillas, espacios físicos o material fungible.
- **Entregable o producto esperado**: Qué deben generar los alumnos al final de la actividad.
- **Evaluación formativa**: Cómo se evaluará esta actividad en concreto y con qué instrumento.

El resultado debe ser un manual instruccional exhaustivo y listo para imprimir que cualquier docente pueda leer y aplicar directamente en el aula mañana mismo sin tener que inventar nada.

Formatea el texto final como Markdown profesional (NO lo envuelvas en markdown \`\`\` o similares, escribe directamente el texto Markdown).
MUY IMPORTANTE: NUNCA utilices recuadros de texto dibujados con caracteres ASCII (como +-----, |    |, etc.) bajo ningún concepto para esquemas o secuencias. Si necesitas tabular información, utiliza ÚNICAMENTE el formato estándar de tablas Markdown (usando | y -). Para resaltar texto, usa bloques de cita (>).
REGLA ESTRICTA SOBRE TEXTO, NÚMEROS Y UNIDADES (PROHIBIDO LATEX): Escribe SIEMPRE los números, minutos, horas, unidades (kg, g, m, etc.), paréntesis y acotaciones en TEXTO PLANO NORMAL de Markdown (por ejemplo: "(165 minutos totales)", "50 kg", "2 horas"). NUNCA utilices notación LaTeX, comandos \\text{...}, ni delimitadores con el símbolo de dólar ($) bajo ningún concepto para números, duraciones o texto estándar.
Genera todo el contenido en el idioma: ${language || 'castellano'}.

${schoolContextStr} ${intefExamplesContext} ${approvedProjectsContext}${coincidenciaInstructions}${fpbMatchesContext}`;
    
    // Enriquecer RAs
    const enrichedRas = (selectedRas || []).map((selectedStr: string) => {
      const raDoc = allRas.find(r => r.description === selectedStr || r.description_es === selectedStr || r.description_ca === selectedStr);
      if (raDoc) {
        const moduleName = (language === 'catalan' && raDoc.module_ca) ? raDoc.module_ca : (raDoc.module_es || raDoc.module);
        let text = `- Módulo/Asignatura: ${moduleName}\n  Resultado de Aprendizaje (RA): ${selectedStr}`;
        if (raDoc.criterios_es && raDoc.criterios_es.length > 0) {
          const critList = (language === 'catalan' && raDoc.criterios_ca && raDoc.criterios_ca.length > 0) ? raDoc.criterios_ca : raDoc.criterios_es;
          text += `\n  CRITERIOS DE EVALUACIÓN OFICIALES:\n  ${critList.map((c: string) => `  ${c}`).join('\n')}`;
        }
        return text;
      }
      const ceDoc = allCes.find(c => c.description_es === selectedStr || c.description_ca === selectedStr || c.ce_id === selectedStr);
      if (ceDoc) {
        const subjectName = ceDoc.subject || ceDoc.area;
        let text = `- Asignatura: ${subjectName}\n  Competencia Específica (CE): ${selectedStr}`;
        if (ceDoc.criterios_es && ceDoc.criterios_es.length > 0) {
          const critList = (language === 'catalan' && ceDoc.criterios_ca && ceDoc.criterios_ca.length > 0) ? ceDoc.criterios_ca : ceDoc.criterios_es;
          text += `\n  CRITERIOS DE EVALUACIÓN OFICIALES:\n  ${critList.map((c: string) => `  ${c}`).join('\n')}`;
        }
        return text;
      }
      return `- ${selectedStr}`;
    });

    const userPrompt = `Diseña la propuesta para alumnos de ${courseLevel || 'un curso a determinar'}, integrando OBLIGATORIAMENTE todos y cada uno de los siguientes elementos curriculares:
${enrichedRas.join('\n\n')}

INSTRUCCIÓN OBLIGATORIA: En el documento generado, incluye obligatoriamente un apartado o epígrafe inicial titulado "Identidad del Proyecto" donde indiques explícitamente el curso al que va dirigido (${courseLevel || 'un curso a determinar'}), junto con otros datos identificativos que consideres oportunos (título, duración, etc.).`;

    // 4. GUARDAR EN COLA EN LUGAR DE LLAMAR A LA IA
    const newProject = new Project({
      title: title || 'Proyecto Generado',
      modules,
      ras: selectedRas,
      methodology,
      tipoNivel: tipoNivel || 'FP_BASICA',
      userId: req.user?._id,
      status: 'en_cola', // Nuevo estado
      aiPrompt: userPrompt, // Guardamos el prompt para el worker
      aiInstruction: baseInstruction // Guardamos el system prompt
    });
    const savedProject = await newProject.save();

    // 5. DISPARAR PROCESAMIENTO DE COLA (no esperamos a que termine)
    if (process.env.NODE_ENV !== 'test') {
      processQueue().catch(console.error);
    }

    // 6. DEVOLVER RESPUESTA INMEDIATA
    res.status(202).json({ 
      message: 'Proyecto añadido a la cola de generación',
      project: savedProject
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const listProjects = async (req: any, res: Response) => {
  try {
    const filter = req.user?.role === 'admin' ? {} : { userId: req.user?._id };
    const projects = await Project.find(filter).sort({ createdAt: -1 }).populate('userId', 'name email');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Error al listar proyectos" });
  }
};

export const getProject = async (req: any, res: Response) => {
  try {
    const project = await Project.findById(req.params.id).populate('userId', 'name email');
    if (!project) return res.status(404).json({ error: "Proyecto no encontrado" });
    const authorId = (project.userId as any)?._id?.toString();
    if (req.user?.role !== 'admin' && authorId !== req.user?._id) {
      return res.status(403).json({ error: "Acceso denegado" });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: "Error al cargar proyecto" });
  }
};

export const updateProject = async (req: any, res: Response) => {
  try {
    const { rawText, status } = req.body;
    const updated = await Project.findByIdAndUpdate(req.params.id, {
      'generatedContent.rawText': rawText,
      status: status || 'borrador'
    }, { returnDocument: 'after' });
    
    await new ActivityLog({
      userId: req.user?._id,
      action: status ? `UPDATE_STATUS_${status.toUpperCase()}` : 'UPDATE_PROJECT',
      projectId: updated?._id,
      details: { title: updated?.title }
    }).save();

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar" });
  }
};

export const deleteProject = async (req: any, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Proyecto no encontrado" });
    
    if (req.user?.role !== 'admin' && project.userId?.toString() !== req.user?._id) {
      return res.status(403).json({ error: "Acceso denegado: solo el autor puede borrarlo" });
    }
    
    await Project.findByIdAndDelete(req.params.id);
    
    await new ActivityLog({
      userId: req.user?._id,
      action: 'DELETE_PROJECT',
      projectId: project._id,
      details: { title: project.title }
    }).save();

    res.json({ message: "Proyecto borrado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al borrar proyecto" });
  }
};

export const rewriteSection = async (req: any, res: Response) => {
  try {
    const { context, selectedText, instruction } = req.body;
    if (!selectedText || !instruction) {
      return res.status(400).json({ error: "Falta texto seleccionado o instrucción" });
    }

    const prompt = `Eres el Motor Pedagógico PAI. El profesor está editando un fragmento de un proyecto intermodular.

CONTEXTO DEL PROYECTO (referencia):
${context ? context.slice(0, 2000) : ''}

FRAGMENTO SELECCIONADO POR EL PROFESOR:
"""
${selectedText}
"""

INSTRUCCIÓN DEL PROFESOR:
${instruction}

TAREA:
Reescribe ÚNICAMENTE el fragmento seleccionado aplicando la instrucción del profesor.

REGLAS ESTRICTAS:
- Devuelve EXCLUSIVAMENTE el fragmento reescrito en formato Markdown.
- NO devuelvas el proyecto entero, únicamente el fragmento modificado.
- NO incluyas saludos, preámbulos ni bloques de código tipo \`\`\`markdown.
- Escribe en texto plano Markdown estándar. NUNCA uses notación LaTeX ni el símbolo $ para números o minutos.`;

    const newFragment = await generateGeminiContent(prompt, "Eres un asistente pedagógico de edición curricular conciso y directo.");
    
    let newFullText = context || '';
    const cleanFragment = (newFragment || '').trim().replace(/^```markdown\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');
    
    if (context && context.includes(selectedText)) {
      newFullText = context.replace(selectedText, cleanFragment);
    } else if (context && context.includes(selectedText.trim())) {
      newFullText = context.replace(selectedText.trim(), cleanFragment);
    } else {
      newFullText = cleanFragment;
    }

    res.json({ newText: newFullText, rewrittenPart: cleanFragment });
  } catch (error: any) {
    console.error("Error en reescritura IA:", error);
    res.status(500).json({ error: "Error al contactar con la IA para reescribir" });
  }
};
