import type { Response } from 'express';
import mongoose from 'mongoose';
import { Project } from '../models/Project';
import { ActivityLog } from '../models/ActivityLog';
import { Settings } from '../models/Settings';
import { buildContexts, generateGeminiContent } from '../services/ai.service';
import fs from 'fs';
import path from 'path';

export const generateProject = async (req: any, res: Response) => {
  try {
    const { modules, selectedRas, methodology, tipoNivel, courseLevel, title, language } = req.body;
    
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
MUY IMPORTANTE: Cuando listes los RAs o las CEs y sus criterios de evaluación correspondientes, DEBES mantener estrictamente su NUMERACIÓN y NOMENCLATURA OFICIAL (por ejemplo, "RA 1", "CE 3", y para los criterios usar sus letras o números oficiales como "a)", "b)", "1.1", "3.2"). Usa tu conocimiento interno del currículo oficial para recuperar la numeración exacta de cada uno de ellos y lístalos con su número/letra original.

REGLA CRÍTICA INQUEBRANTABLE SOBRE EL DETALLE DE ACTIVIDADES/FASES:
Es ABSOLUTAMENTE CRÍTICO que el apartado de "Actividades" o "Fases del proyecto" sea extremadamente detallado, profundo y minucioso. 
NO te limites a enumerar las fases brevemente. Para cada fase o actividad, debes especificar claramente:
- Descripción exhaustiva paso a paso de lo que hará el alumnado.
- El rol del docente en esa actividad.
- Metodología y dinámicas de aula (trabajo individual, pequeño grupo, debate, etc.).
- Entregables o productos intermedios esperados.
- Materiales, herramientas o recursos concretos que necesitarán.
Desarrolla el proyecto con un alto nivel de detalle técnico y pedagógico, sin importar lo largo que sea el texto resultante. Un buen proyecto requiere instrucciones ricas y detalladas para que cualquier docente pueda aplicarlo.

REGLA CRÍTICA DE ESTRUCTURA DEL DOCUMENTO:
Tu respuesta DEBE organizarse estrictamente con los siguientes apartados y subapartados (usa formato Markdown con cabeceras):
1. IDENTIDAD DEL PROYECTO (Título, Centro, Ciclo formativo, Curso, Estrategia metodológica, Autoría y validación (si está validado): ${req.user?.name || 'Profesor/a'})
2. INTEGRACIÓN CURRICULAR (Módulos implicados y resultados de aprendizaje vinculados con su NUMERACIÓN OFICIAL)
3. CONTEXTO Y RETO (Necesidad detectada, Conexión con el entorno, Empresa/entidad)
4. DESARROLLO Y FASES (Secuenciación, Duración estimada, Fases super detalladas)
5. ACTIVIDAD DEL ALUMNADO (Agrupamiento, Qué investiga/diseña/produce/evalúa)
6. EVALUACIÓN (Producto final, Formativa, Instrumentos y evidencias del proceso, con TODOS los criterios de los RA/CE manteniendo su NUMERACIÓN/LETRA OFICIAL original)
7. DIFUSIÓN (Cómo, dónde y a quién se presentará o difundirá el proyecto)
8. COORDINACIÓN DOCENTE (Cómo se coordinarán los profesores implicados)
9. VIABILIDAD REAL / RECURSOS NECESARIOS (Presupuesto aproximado, espacios específicos, materiales consumibles, viabilidad temporal)

REGLA DE IDIOMA:
Es OBLIGATORIO que redactes el proyecto entero en ${language === 'catalan' ? 'Catalán' : 'Castellano'}, ya que el usuario ha solicitado la plataforma en ese idioma.

${schoolContextStr} ${intefExamplesContext} ${approvedProjectsContext}`;
    
    // Enriquecer los RAs con sus criterios de evaluación oficiales si existen
    const allRas = await mongoose.models.RA.find();
    const enrichedRas = (selectedRas || []).map((selectedStr: string) => {
      const raDoc = allRas.find(r => r.description === selectedStr || r.description_es === selectedStr || r.description_ca === selectedStr);
      
      if (raDoc && raDoc.criterios_es && raDoc.criterios_es.length > 0) {
        const critList = (language === 'catalan' && raDoc.criterios_ca && raDoc.criterios_ca.length > 0) ? raDoc.criterios_ca : raDoc.criterios_es;
        return `- ${selectedStr}\n  CRITERIOS DE EVALUACIÓN OFICIALES (Utiliza EXACTAMENTE estas letras/números):\n  ${critList.map((c: string) => `  ${c}`).join('\n')}`;
      }
      return `- ${selectedStr}`;
    });

    const userPrompt = `Diseña la propuesta integrando OBLIGATORIAMENTE todos y cada uno de los siguientes Resultados de Aprendizaje/Competencias:
${enrichedRas.join('\n')}`;
    
    const startTime = Date.now();
    const text = await generateGeminiContent(userPrompt, baseInstruction);
    const generationTimeMs = Date.now() - startTime;

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

    await new ActivityLog({
      userId: req.user?._id,
      action: 'GENERATE_PROJECT',
      projectId: savedProject._id,
      details: { generationTimeMs, title: savedProject.title }
    }).save();

    res.json(savedProject);
  } catch (error: any) {
    await new ActivityLog({
      userId: req.user?._id,
      action: 'ERROR_GENERATE_PROJECT',
      details: { error: error.message || error.toString() }
    }).save();
    res.status(500).json({ error: "Error en el motor de IA intermodular", details: error.message });
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
