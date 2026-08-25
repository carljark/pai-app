import type { Response } from 'express';
import { RA } from '../models/RA';
import { CE } from '../models/CE';

const moduleTranslations: Record<string, string> = {
  "Atención al cliente": "Atenció a possibles clients", // El excel lo llama así o 'Atenció al client'
  "Atención al cliente": "Atenció al client",
  "Cambio de color del cabello": "Canvi de color del cabell",
  "Ciencias aplicadas I": "Ciències aplicades I",
  "Ciencias aplicadas II": "Ciències aplicades II",
  "Comunicación y sociedad I": "Comunicació i societat I",
  "Comunicación y sociedad II": "Comunicació i societat II",
  "Cuidados estéticos básicos de manos y uñas": "Cures estètiques bàsiques de mans i ungles",
  "Depilación mecánica y decoloración del vello superfluo": "Depil·lació mecànica i decoloració mecànica del borrissol superflu",
  "Lavado y cambios de forma del cabello": "Rentat i canvis de forma del cabell",
  "Maquillaje": "Maquillatge",
  "Preparación del entorno profesional": "Preparació de l'entorn professional",
  "Itinerario para la empleabilidad": "Itinerari per l'ocupabilitat"
};

const caToEsModules: Record<string, string> = Object.entries(moduleTranslations).reduce((acc, [es, ca]) => {
  acc[ca] = es;
  return acc;
}, {} as Record<string, string>);

// Y añadir esto para capturar pequeñas variaciones del excel
caToEsModules["Cures estètiques bàsiques de mans i ungles"] = "Cuidados estéticos básicos de manos y uñas";
caToEsModules["Depil·lació mecànica i decoloració mecànica del borrissol superflu"] = "Depilación mecánica y decoloración mecánica del vello superfluo";

const esToCa: Record<string, string> = {
  // ... (se mantiene igual, no lo toco)
  "Biología y Geología": "Biologia i Geologia",
  "Economía y Emprendimiento": "Economia i Emprenedoria",
  "Física y Química": "Física i Química",
  "Geografía e Historia": "Geografia i Història",
  "Lengua Castellana y Literatura": "Llengua Castellana i Literatura",
  "Lengua Catalana y Literatura": "Llengua Catalana i Literatura",
  "Matemáticas": "Matemàtiques",
  "Tecnología y Digitalización": "Tecnologia i Digitalització",
  "Ámbito Científico y Tecnológico": "Àmbit Científic i Tecnològic",
  "Ámbito Lingüístico y Social": "Àmbit Lingüístic i Social",
  "Formación Profesional": "Formació Professional"
};

const caToEs: Record<string, string> = Object.entries(esToCa).reduce((acc, [es, ca]) => {
  acc[ca] = es;
  return acc;
}, {} as Record<string, string>);

export const getRas = async (req: any, res: Response) => {
  try {
    const lang = req.query.lang === 'catalan' ? 'ca' : 'es';
    const ras = await RA.find();
    
    const mapped = ras.map(r => ({
      id: r.id,
      module: lang === 'ca' ? r.module : (caToEsModules[r.module] || r.module_es || r.module),
      description: lang === 'ca' ? (r.description_ca || r.description) : (r.description_es || r.description)
    }));
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ error: "No se pudieron cargar los RAs" });
  }
};

export const getCes = async (req: any, res: Response) => {
  try {
    const lang = req.query.lang === 'catalan' ? 'ca' : 'es';
    const ces = await CE.find();
    
    const mapped = ces.map(c => {
      let subjectBase = c.subject;
      let areaBase = c.area;

      if (subjectBase.startsWith('Matemàtiques')) subjectBase = 'Matemàtiques';

      const subjectCa = subjectBase;
      const subjectEs = caToEs[subjectBase] || subjectBase;
      const areaCa = areaBase;
      const areaEs = caToEs[areaBase] || areaBase;

      return {
        area: lang === 'ca' ? areaCa : areaEs,
        subject: lang === 'ca' ? subjectCa : subjectEs,
        ce_id: c.ce_id,
        description: lang === 'ca' && c.description_ca ? c.description_ca : c.description_es || c.get('description'),
        criterios: lang === 'ca' && c.criterios_ca ? c.criterios_ca : c.criterios_es || c.get('criterios')
      };
    });
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ error: "No se pudieron cargar las CEs" });
  }
};
