import type { Response } from 'express';
import mongoose from 'mongoose';
import { Project } from '../models/Project';
import { ActivityLog } from '../models/ActivityLog';
import { Settings } from '../models/Settings';
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

    // 3. CONSTRUCCIÓN DEL PROMPT (Igual que antes)
    const { modules, selectedRas, methodology, tipoNivel, title, language } = req.body;
    const settings = await Settings.findOne();
    const { schoolContextStr, intefExamplesContext } = buildContexts(settings);

    let approvedProjectsContext = '';
    const approvedProjects = await Project.find({ status: 'publicado' }).limit(5);
    if (approvedProjects.length > 0) {
      approvedProjectsContext = "\n--- PROYECTOS APROBADOS DE LA PLATAFORMA ---\n" + 
        JSON.stringify(approvedProjects.map(p => ({ title: p.title, text: p.generatedContent?.rawText })));
    }

    const baseInstruction = `Eres un experto en diseño instruccional y metodologías activas (ABP, Aps).
REGLA CRÍTICA INQUEBRANTABLE SOBRE EVALUACIÓN:
Cuando diseñes el proyecto y llegues al apartado de Evaluación, DEBES contemplar los criterios de evaluación aplicables a CADA UNO de los Resultados de Aprendizaje (RA) o Competencias Específicas (CE) seleccionados por el usuario.
NO puedes obviar ni saltarte NINGÚN resultado de aprendizaje seleccionado. TODOS han de aparecer obligatoriamente en el proyecto.
MUY IMPORTANTE: Cuando listes los RAs o las CEs y sus criterios de evaluación correspondientes, DEBES mantener estrictamente su NUMERACIÓN y NOMENCLATURA OFICIAL.

REGLA CRÍTICA INQUEBRANTABLE SOBRE EL DETALLE DE ACTIVIDADES/FASES:
NO puedes generar un proyecto corto o resumido. DEBES desarrollar CADA FASE Y CADA ACTIVIDAD con el MÁXIMO NIVEL DE DETALLE posible.
El resultado debe ser un manual exhaustivo y listo para imprimir que cualquier docente pueda leer y aplicar directamente en el aula mañana mismo.

Formatea el texto final como Markdown profesional (NO lo envuelvas en markdown \`\`\` o similares, escribe directamente el texto Markdown).
MUY IMPORTANTE: NUNCA utilices recuadros de texto dibujados con caracteres ASCII (como +-----, |    |, etc.) bajo ningún concepto para esquemas o secuencias. Si necesitas tabular información, utiliza ÚNICAMENTE el formato estándar de tablas Markdown (usando | y -). Para resaltar texto, usa bloques de cita (>).
Genera todo el contenido en el idioma: ${language || 'castellano'}.

${schoolContextStr} ${intefExamplesContext} ${approvedProjectsContext}`;
    
    // Enriquecer RAs
    const allRas = await mongoose.models.RA.find();
    const allCes = mongoose.models.CE ? await mongoose.models.CE.find() : [];
    
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

    const userPrompt = `Diseña la propuesta integrando OBLIGATORIAMENTE todos y cada uno de los siguientes elementos curriculares:
${enrichedRas.join('\n\n')}`;

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
