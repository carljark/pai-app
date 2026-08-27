import { Request, Response } from 'express';
import { Project } from '../models/Project';
export const dumpProjects = async (req: Request, res: Response) => {
  const projects = await Project.find();
  res.json(projects);
};
