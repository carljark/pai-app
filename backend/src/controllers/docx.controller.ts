import type { Response } from 'express';
import { Project } from '../models/Project';
import { ActivityLog } from '../models/ActivityLog';
import { marked } from 'marked';
import HTMLtoDOCX from 'html-to-docx';
import mammoth from 'mammoth';
import TurndownService from 'turndown';

const turndownService = new TurndownService({ headingStyle: 'atx' });

export const exportDocx = async (req: any, res: Response) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user._id });
    if (!project || !project.generatedContent?.rawText) {
      return res.status(404).json({ error: 'Proyecto no encontrado o sin contenido' });
    }

    await ActivityLog.create({
      userId: req.user._id,
      action: 'EXPORT_DOCX',
      projectId: project._id,
      details: { projectTitle: project.title },
      createdAt: new Date()
    });

    const html = await marked.parse(project.generatedContent.rawText);
    const fileBuffer = await HTMLtoDOCX(html as string, null, { table: { row: { cantSplit: true } }, footer: true, pageNumber: true });
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="Proyecto_${project.title || 'PAI'}.docx"`);
    res.send(fileBuffer);
  } catch (error) {
    res.status(500).json({ error: 'Error exportando a DOCX' });
  }
};

export const importDocx = async (req: any, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se ha subido ningún archivo' });
    
    const result = await mammoth.convertToHtml({ buffer: req.file.buffer });
    const cleanHtml = result.value;
    const newMarkdown = turndownService.turndown(cleanHtml);
    
    const project = await Project.findOne({ _id: req.params.id, userId: req.user._id });
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });
    
    project.generatedContent!.rawText = newMarkdown;
    await project.save();
    
    res.json({ message: 'Documento procesado correctamente', project });
  } catch (error) {
    res.status(500).json({ error: 'Error importando el archivo DOCX' });
  }
};
