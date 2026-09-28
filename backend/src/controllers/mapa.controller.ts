import type { Request, Response } from 'express';
import { MapaModule } from '../models/MapaModule';

const ALLOWED_TABS = ['FPB', 'CFGM', 'CFGM_PELUQUERIA', 'CFGM_PELUQUERIA_2'];

export const getMapaModules = async (req: Request, res: Response) => {
  try {
    const tab = req.query.tab as string;

    if (!tab || !ALLOWED_TABS.includes(tab)) {
      return res.status(400).json({
        error: `Parámetro 'tab' inválido o ausente. Valores permitidos: ${ALLOWED_TABS.join(', ')}`
      });
    }

    const modules = await MapaModule.find({ tab })
      .sort({ order: 1 })
      .select('-_id -__v -createdAt -updatedAt -tab -order')
      .lean();

    return res.json(modules);
  } catch (error: any) {
    console.error('Error al obtener módulos del mapa intermodular:', error);
    return res.status(500).json({ error: 'Error interno del servidor al recuperar los módulos' });
  }
};
