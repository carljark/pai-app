import type { Response } from 'express';
import mongoose from 'mongoose';
import { Project } from '../models/Project';
import { ActivityLog } from '../models/ActivityLog';
import { Settings } from '../models/Settings';
import { FpbMatch } from '../models/FpbMatch';
import { buildContexts, generateAiContentWithFallback } from '../services/ai.service';
import fs from 'fs';
import path from 'path';
import { addClient, removeClient } from "../services/sse.service";
import { processQueue } from "../services/queue.service";
import { syncProjectNotification, deleteProjectNotification } from "../services/notification.service";

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

export const formatCriterion = (c: any): string => {
  if (!c) return '';
  if (typeof c === 'string') return c.trim();
  if (typeof c === 'object') {
    const id = c.criterio_id || c.id || '';
    const desc = c.description || c.desc || '';
    if (id && desc) return `${id}: ${desc}`.trim();
    return (desc || id || '').trim();
  }
  return String(c).trim();
};

export const filterCriteriaByCourse = (critList: any[], level?: string): any[] => {
  if (!critList || !Array.isArray(critList) || critList.length === 0) return [];
  const matchDigit = (level || '').match(/\d/);
  if (!matchDigit) return critList;
  const targetDigit = matchDigit[0];

  return critList.filter(c => {
    const text = typeof c === 'string' ? c : `${c.criterio_id || ''} ${c.description || ''}`;
    // Revisa si especifica explícitamente curso de ESO o FP (ej: "3º ESO", "(4º ESO)", "1º FP", "(2º FP)")
    const hasSpecificCourseMatch = text.match(/(?:[1-4])[º|ª|o|\.]?\s*(?:de\s*)?(?:ESO|FP)|\([1-4][º|o]?\s*(?:ESO|FP)\)/i);
    if (hasSpecificCourseMatch) {
      const critDigitMatch = hasSpecificCourseMatch[0].match(/\d/);
      if (critDigitMatch && critDigitMatch[0] !== targetDigit) {
        return false;
      }
    }
    return true;
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
    const { modules, selectedRas, methodology, tipoNivel, title, language, courseLevel, extraInstructions } = req.body;
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

    let fpbCaInstruction = '';
    if (tipoNivel === 'FP_BASICA') {
      if (language === 'catalan') {
        fpbCaInstruction = `

REGLA OBLIGATÒRIA PER A FP BÀSICA - PROPOSTA PER A LA CARPETA D'APRENENTATGE (CA):
Com a element pedagògic clau de la Formació Professional Bàsica, has d'incloure OBLIGATÒRIAMENT en el projecte una secció o proposta destacada d'activitat clau que l'alumnat haurà de desar i arxivar a la seua Carpeta d'Aprenentatge (CA) / Portafolis d'evidències.
Aquesta proposta ha d'especificar de manera detallada:
- **Títol de l'activitat per a la Carpeta d'Aprenentatge (CA)**.
- **Evidència o document a arxivar**: Descripció precisa del treball, fitxa de taller, registre fotogràfic, informe tècnic o reflexió que s'ha d'incorporar a la CA.
- **Instruccions d'elaboració per a l'alumnat**: Pautes clares perquè l'alumnat sàpiga com realitzar, ordenar i conservar aquesta evidència.
- **Criteris d'avaluació formativa**: Com valorarà el docent aquesta evidència dins de la Carpeta d'Aprenentatge i la seua relació amb els Resultats d'Aprenentatge.`;
      } else {
        fpbCaInstruction = `

REGLA OBLIGATORIA PARA FP BÁSICA - PROPUESTA PARA CARPETA DE APRENDIZAJE (CA):
Como elemento pedagógico clave de la Formación Profesional Básica, debes incluir OBLIGATORIAMENTE en el proyecto una sección o propuesta destacada de actividad clave que el alumnado deberá guardar y archivar en su Carpeta de Aprendizaje (CA) / Portafolio de evidencias.
Esta propuesta debe especificar de manera detallada:
- **Título de la actividad para la Carpeta de Aprendizaje (CA)**.
- **Evidencia o documento a archivar**: Descripción precisa del trabajo, ficha de taller, registro fotográfico, informe técnico o reflexión que debe incorporarse a la CA.
- **Instrucciones de elaboración para el alumnado**: Pautas claras para que el alumnado sepa cómo realizar, ordenar y conservar esta evidencia.
- **Criterios de evaluación formativa**: Cómo valorará el docente esta evidencia dentro de la Carpeta de Aprendizaje y su relación con los Resultados de Aprendizaje.`;
      }
    }

    const baseInstruction = `Eres un experto en diseño instruccional y metodologías activas (ABP, Aps).
REGLA CRÍTICA INQUEBRANTABLE SOBRE EL CURSO Y NIVEL EDUCATIVO:
El proyecto debe diseñarse rigurosa y exclusivamente para el curso y nivel educativo formalmente indicado en la solicitud del docente (por ejemplo: 3º de ESO en Diversificación Curricular / PDC). Si se solicita 3º de ESO, queda TERMINANTEMENTE PROHIBIDO cambiarlo a 4º de ESO o dirigirlo a otro curso. Los proyectos de referencia o ejemplos de repositorios (como INTEF) que pertenezcan a otros cursos (como 4º de ESO) deben usarse ÚNICAMENTE como inspiración de metodologías activas y estructura didáctica, pero NUNCA deben alterar el curso formalmente solicitado. En el apartado inicial "Identidad del Proyecto", debes consignar con total exactitud el curso y nivel educativo solicitado.

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

REGLA SOBRE INSTRUCCIONES EXTRA DEL DOCENTE:
Si en la solicitud se aportan "INSTRUCCIONES EXTRA DEL DOCENTE", debes integrarlas de forma obligatoria y prioritaria en el diseño del proyecto, adaptando temáticas, dinámicas pedagógicas, recursos o productos finales a lo especificado por el profesor.

El resultado debe ser un manual instruccional exhaustivo y listo para imprimir que cualquier docente pueda leer y aplicar directamente en el aula mañana mismo sin tener que inventar nada.

Formatea el texto final como Markdown profesional (NO lo envuelvas en markdown \`\`\` o similares, escribe directamente el texto Markdown).
MUY IMPORTANTE: NUNCA utilices recuadros de texto dibujados con caracteres ASCII (como +-----, |    |, etc.) bajo ningún concepto para esquemas o secuencias. Si necesitas tabular información, utiliza ÚNICAMENTE el formato estándar de tablas Markdown (usando | y -). Para resaltar texto, usa bloques de cita (>).
REGLA ESTRICTA SOBRE TEXTO, NÚMEROS Y UNIDADES (PROHIBIDO LATEX): Escribe SIEMPRE los números, minutos, horas, unidades (kg, g, m, etc.), paréntesis y acotaciones en TEXTO PLANO NORMAL de Markdown (por ejemplo: "(165 minutos totales)", "50 kg", "2 horas"). NUNCA utilices notación LaTeX, comandos \\text{...}, ni delimitadores con el símbolo de dólar ($) bajo ningún concepto para números, duraciones o texto estándar.
Genera todo el contenido en el idioma: ${language || 'castellano'}.

${schoolContextStr} ${intefExamplesContext} ${approvedProjectsContext}${coincidenciaInstructions}${fpbMatchesContext}${fpbCaInstruction}`;
    
    // Determinación del curso efectivo y descripción
    const defaultCourse = tipoNivel === 'DIVERSIFICACION_CURRICULAR' ? '3º' : '1º';
    const effectiveCourse = (courseLevel && typeof courseLevel === 'string' && courseLevel.trim()) ? courseLevel.trim() : defaultCourse;
    const targetCourseDescription = tipoNivel === 'DIVERSIFICACION_CURRICULAR'
      ? `${effectiveCourse} de ESO (Diversificación Curricular / PDC)`
      : `${effectiveCourse} de FP Básica (Formación Profesional Básica)`;

    // Enriquecer RAs y CEs filtrando criterios según el curso correspondiente
    const enrichedRas = (selectedRas || []).map((selectedStr: string) => {
      const raDoc = allRas.find(r => r.description === selectedStr || r.description_es === selectedStr || r.description_ca === selectedStr);
      if (raDoc) {
        const moduleName = (language === 'catalan' && raDoc.module_ca) ? raDoc.module_ca : (raDoc.module_es || raDoc.module);
        let text = `- Módulo/Asignatura: ${moduleName}\n  Resultado de Aprendizaje (RA): ${selectedStr}`;
        const rawList = (language === 'catalan' && raDoc.criterios_ca && raDoc.criterios_ca.length > 0)
          ? raDoc.criterios_ca
          : (raDoc.criterios_es && raDoc.criterios_es.length > 0 ? raDoc.criterios_es : []);
        const filteredList = filterCriteriaByCourse(rawList, effectiveCourse);
        if (filteredList.length > 0) {
          text += `\n  CRITERIOS DE EVALUACIÓN OFICIALES:\n  ${filteredList.map((c: any) => `  ${formatCriterion(c)}`).join('\n')}`;
        }
        return text;
      }
      const ceDoc = allCes.find(c => c.description_es === selectedStr || c.description_ca === selectedStr || c.ce_id === selectedStr);
      if (ceDoc) {
        const subjectName = ceDoc.subject || ceDoc.area;
        let text = `- Asignatura: ${subjectName}\n  Competencia Específica (CE): ${selectedStr}`;
        const rawList = (language === 'catalan' && ceDoc.criterios_ca && ceDoc.criterios_ca.length > 0)
          ? ceDoc.criterios_ca
          : (ceDoc.criterios_es && ceDoc.criterios_es.length > 0 ? ceDoc.criterios_es : (ceDoc.criterios || []));
        const filteredList = filterCriteriaByCourse(rawList, effectiveCourse);
        if (filteredList.length > 0) {
          text += `\n  CRITERIOS DE EVALUACIÓN OFICIALES:\n  ${filteredList.map((c: any) => `  ${formatCriterion(c)}`).join('\n')}`;
        }
        return text;
      }
      return `- ${selectedStr}`;
    });

    let userPrompt = `Diseña la propuesta EXCLUSIVAMENTE para alumnado de ${targetCourseDescription}, integrando OBLIGATORIAMENTE todos y cada uno de los siguientes elementos curriculares:
${enrichedRas.join('\n\n')}

INSTRUCCIÓN OBLIGATORIA DE CURSO Y NIVEL:
En el documento generado, incluye obligatoriamente un apartado o epígrafe inicial titulado "Identidad del Proyecto" donde indiques explícitamente y con total exactitud que el curso al que va dirigido es "${targetCourseDescription}". Está TERMINANTEMENTE PROHIBIDO modificar o sugerir otro curso distinto (por ejemplo, si se indica 3º de ESO, NO utilices 4º de ESO bajo ningún concepto).`;

    if (extraInstructions && typeof extraInstructions === 'string' && extraInstructions.trim()) {
      userPrompt += `\n\n--- INSTRUCCIONES EXTRA DEL DOCENTE (OBLIGATORIAS) ---\n${extraInstructions.trim()}`;
    }

    const defaultTitle = (modules && modules.length > 0)
      ? modules.join(' + ')
      : (selectedRas && selectedRas.length > 0 ? selectedRas.slice(0, 2).join(' + ') : 'Proyecto Generado');

    // 4. GUARDAR EN COLA EN LUGAR DE LLAMAR A LA IA
    const newProject = new Project({
      title: title || defaultTitle,
      modules,
      ras: selectedRas,
      methodology,
      tipoNivel: tipoNivel || 'FP_BASICA',
      courseLevel: effectiveCourse,
      userId: req.user?._id,
      status: 'en_cola', // Nuevo estado
      aiPrompt: userPrompt, // Guardamos el prompt para el worker
      aiInstruction: baseInstruction, // Guardamos el system prompt
      extraInstructions: typeof extraInstructions === 'string' && extraInstructions.trim() ? extraInstructions.trim() : undefined,
      aiProvider: req.body.aiProvider === 'openrouter' ? 'openrouter' : 'gemini',
      aiModel: req.body.aiModel ? String(req.body.aiModel).trim() : undefined
    });
    const savedProject = await newProject.save();

    await syncProjectNotification(savedProject, {
      type: 'PROJECT_STATUS',
      title: 'Proyecto en Cola',
      message: 'Proyecto añadido a la cola de generación',
      userName: req.user?.name,
      userEmail: req.user?.email
    });

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
    const { mine } = req.query;
    const userId = req.user?._id;
    let filter: any = {};

    if (mine === 'true') {
      filter = { userId };
    }
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
    
    const authorId = (project.userId as any)?._id?.toString() || project.userId?.toString();
    if (req.user?.role !== 'admin' && authorId !== req.user?._id?.toString()) {
      return res.status(403).json({ error: "Acceso denegado: solo el autor puede borrarlo" });
    }
    
    await Project.findByIdAndDelete(req.params.id);
    await deleteProjectNotification(req.params.id);

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

function buildRewritePrompt(context: string, instruction: string): string {
  return `Eres el Motor Pedagógico PAI. El profesor está solicitando una modificación o refinamiento sobre el documento completo del proyecto intermodular.

DOCUMENTO DEL PROYECTO ACTUAL (MARKDOWN COMPLETO):
"""
${context}
"""

INSTRUCCIÓN DEL PROFESOR:
"""
${instruction}
"""

TAREA:
Reescribe y actualiza el documento completo del proyecto en formato Markdown aplicando de forma coherente y precisa la instrucción del profesor, manteniendo todas las demás secciones, formato y coherencia pedagógica.

REGLAS ESTRICTAS:
- Devuelve el documento COMPLETO actualizado en formato Markdown.
- NO devuelvas resúmenes, explicaciones ni fragmentos aislados, únicamente el documento Markdown completo resultante.
- NO incluyas saludos, preámbulos ni bloques envolventes de código tipo \`\`\`markdown ni \`\`\`.
- Escribe en texto plano Markdown estándar. NUNCA uses notación LaTeX ni el símbolo $ para números o minutos.`;
}

export const rewriteSection = async (req: any, res: Response) => {
  try {
    const { context, instruction, aiProvider, aiModel } = req.body;
    if (!context || !instruction) {
      return res.status(400).json({ error: "Falta el contenido del proyecto o la instrucción" });
    }

    const prompt = buildRewritePrompt(context, instruction);
    const preferredProvider: 'gemini' | 'openrouter' = aiProvider === 'openrouter' ? 'openrouter' : 'gemini';
    const result = await generateAiContentWithFallback(
      prompt,
      "Eres un asistente pedagógico de edición curricular experto, directo y preciso.",
      preferredProvider,
      undefined,
      aiModel
    );
    const cleanText = (result.text || '').trim().replace(/^```markdown\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');
    console.log(`[Project/Rewrite] Reescritura completada con proveedor ${result.provider} (modelo: ${result.model})`);

    res.json({
      newText: cleanText,
      rewrittenPart: cleanText,
      provider: result.provider,
      model: result.model,
      fallbackUsed: result.fallbackUsed
    });
  } catch (error: any) {
    console.error("Error en reescritura IA:", error);
    res.status(500).json({ error: "Error al contactar con la IA para reescribir" });
  }
};

function validateRetryAccess(project: any, user: any): { status: number; message: string } | null {
  if (!project) return { status: 404, message: 'Proyecto no encontrado' };
  const isOwner = project.userId?.toString() === user?._id?.toString();
  if (user?.role !== 'admin' && !isOwner) {
    return { status: 403, message: 'Acceso denegado' };
  }
  if (project.status !== 'error') {
    return { status: 400, message: 'Solo se pueden reintentar proyectos con estado de error' };
  }
  return null;
}

async function hasPendingGeneration(userId: any): Promise<boolean> {
  const count = await Project.countDocuments({
    userId,
    status: { $in: ['en_cola', 'generando'] }
  });
  return count > 0;
}

async function reenqueueProject(project: any, userName?: string, aiProvider?: string, userEmail?: string): Promise<void> {
  if (!project.aiPrompt) {
    project.aiPrompt = `Genera un proyecto educativo para ${project.tipoNivel}.`;
    project.aiInstruction = 'Experto pedagógico.';
  }
  if (aiProvider) {
    project.aiProvider = aiProvider === 'openrouter' ? 'openrouter' : 'gemini';
  }
  project.status = 'en_cola';
  project.errorDetail = undefined;
  project.generationStartedAt = undefined;
  project.generationTimeMs = undefined;
  project.updatedAt = new Date();
  await project.save();

  await syncProjectNotification(project, {
    type: 'PROJECT_STATUS',
    title: 'Proyecto en Cola (Reintento)',
    message: 'Proyecto reencolado para su generación.',
    userName,
    userEmail
  });

  if (process.env.NODE_ENV !== 'test') {
    processQueue().catch(console.error);
  }
}

export const retryProject = async (req: any, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    const authError = validateRetryAccess(project, req.user);
    if (authError) return res.status(authError.status).json({ error: authError.message });

    const hasPending = await hasPendingGeneration(req.user?._id);
    if (hasPending) {
      return res.status(429).json({ error: 'Ya tienes un proyecto en la cola o generándose. Por favor, espera a que termine.' });
    }

    await reenqueueProject(project, req.user?.name, req.body?.aiProvider, req.user?.email);
    return res.json({ message: 'Proyecto reencolado exitosamente', project });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

