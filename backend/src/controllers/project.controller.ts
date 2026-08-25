import type { Response } from 'express';
import { Project } from '../models/Project';
import { Settings } from '../models/Settings';
import { buildContexts, generateGeminiContent } from '../services/ai.service';
import fs from 'fs';
import path from 'path';

export const generateProject = async (req: any, res: Response) => {
  try {
    const { modules, selectedRas, methodology, tipoNivel, courseLevel, title } = req.body;
    
    const settings = await Settings.findOne();
    const { schoolContextStr, intefExamplesContext } = buildContexts(settings);

    let approvedProjectsContext = '';
    const approvedProjects = await Project.find({ status: 'publicado' }).limit(5);
    if (approvedProjects.length > 0) {
      approvedProjectsContext = "\n--- PROYECTOS APROBADOS DE LA PLATAFORMA ---\n" + 
        JSON.stringify(approvedProjects.map(p => ({ title: p.title, text: p.generatedContent?.rawText })));
    }

    const baseInstruction = `Eres un experto en diseño instruccional y metodologías activas (ABP, Aps).
REGLA CRÍTICA INQUEBRANTABLE:
Cuando diseñes el proyecto y llegues al apartado de Evaluación, DEBES contemplar los criterios de evaluación aplicables a CADA UNO de los Resultados de Aprendizaje (RA) o Competencias Específicas (CE) seleccionados por el usuario.
NO puedes obviar ni saltarte NINGÚN resultado de aprendizaje seleccionado. TODOS han de aparecer obligatoriamente en el proyecto con sus criterios de evaluación correspondientes (debes deducir sus criterios si no se proporcionan, pero siempre en relación al currículo oficial).
${schoolContextStr} ${intefExamplesContext} ${approvedProjectsContext}`;
    
    const userPrompt = `Diseña la propuesta integrando OBLIGATORIAMENTE todos y cada uno de los siguientes Resultados de Aprendizaje/Competencias:
${selectedRas ? selectedRas.join('\n- ') : ''}`;
    
    const text = await generateGeminiContent(userPrompt, baseInstruction);

    const newProject = new Project({
      title: title || 'Proyecto Generado',
      modules,
      ras: selectedRas,
      methodology,
      tipoNivel: tipoNivel || 'FP_BASICA',
      userId: req.user?._id,
      generatedContent: { rawText: text }
    });
    const savedProject = await newProject.save();

    res.json(savedProject);
  } catch (error) {
    res.status(500).json({ error: "Error en el motor de IA intermodular" });
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
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: "Proyecto no encontrado" });
    if (req.user?.role !== 'admin' && project.userId?.toString() !== req.user?._id) {
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
    }, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar" });
  }
};
