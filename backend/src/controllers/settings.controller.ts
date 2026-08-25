import type { Response } from 'express';
import { Settings } from '../models/Settings';

export const getSettings = async (req: any, res: Response) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo la configuración" });
  }
};

export const updateSettings = async (req: any, res: Response) => {
  try {
    const { schoolName, schoolCity, schoolContext } = req.body;
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();
    settings.schoolName = schoolName;
    settings.schoolCity = schoolCity;
    settings.schoolContext = schoolContext;
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Error actualizando la configuración" });
  }
};
