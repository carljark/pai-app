import type { Request, Response } from 'express';
import { MapaModule } from '../models/MapaModule';
import { MAPA_TABS } from '../data/niveles';

export const getMapaModules = async (req: Request, res: Response) => {
  try {
    const tab = req.query.tab as string;

    if (!tab || !MAPA_TABS.includes(tab)) {
      return res.status(400).json({
        error: `Parámetro 'tab' inválido o ausente. Valores permitidos: ${MAPA_TABS.join(', ')}`
      });
    }

    const modules = await MapaModule.find({ tab })
      .sort({ order: 1 })
      .select('-_id -__v -createdAt -updatedAt -tab -order')
      .lean();

    const sanitizedModules = modules.map((m: any) => ({
      ...m,
      learningOutcomes: (m.learningOutcomes || []).map((lo: any) => ({
        ...lo,
        connections: (lo.connections || []).filter((c: any) => c.activities && c.activities.length > 0)
      }))
    }));

    return res.json(sanitizedModules);
  } catch (error: any) {
    console.error('Error al obtener módulos del mapa intermodular:', error);
    return res.status(500).json({ error: 'Error interno del servidor al recuperar los módulos' });
  }
};
