import type { Response } from 'express';
import { RA } from '../models/RA';
import { CE } from '../models/CE';

const caToEsModules: Record<string, string> = {
  "Atenció a possibles clients": "Atención al cliente",
  "Atenció al client": "Atención al cliente",
  "Canvi de color del cabell": "Cambio de color del cabello",
  "Canvis de color del cabell": "Cambio de color del cabello",
  "Ciències aplicades I": "Ciencias aplicadas I",
  "Ciències aplicades II": "Ciencias aplicadas II",
  "Comunicació i societat I": "Comunicación y sociedad I",
  "Comunicació i societat II": "Comunicación y sociedad II",
  "Cures estètiques bàsiques de mans i ungles": "Cuidados estéticos básicos de manos y uñas",
  "Depil·lació mecànica i decoloració mecànica del borrissol superflu": "Depilación mecánica y decoloración del vello superfluo",
  "Rentat i canvis de forma del cabell": "Lavado y cambios de forma del cabello",
  "Maquillatge": "Maquillaje",
  "Preparació de l'entorn professional": "Preparación del entorno profesional",
  "Itinerari per l'ocupabilitat": "Itinerario para la empleabilidad",
  "Projecte inter modular d'aprenentatge col·laboratiu": "Proyecto inter modular de aprendizaje colaborativo",
  "Proyecto inter modular de aprendizaje colaborativo": "Proyecto inter modular de aprendizaje colaborativo",
  "Tècniques d’higiene facial i corporal": "Técnicas de higiene facial y corporal",
  "Tècniques d'higiene facial i corporal": "Técnicas de higiene facial y corporal",
  "Depilació mecànica i decoloració del borrissol": "Depilación mecánica y decoloración del vello",
  "Estètica de mans i peus": "Estética de manos y pies",
  "Anàlisi estètica": "Análisis estético",
  "Imatge corporal i hàbits saludables": "Imagen corporal y hábitos saludables",
  "Cosmetologia per a estètica i bellesa": "Cosmetología para estética y belleza",
  "Digitalització aplicada als sectors productius": "Digitalización aplicada a los sectores productivos",
  "Itinerari personal per a l’ocupabilitat I": "Itinerario personal para la empleabilidad I",
  "Itinerari personal per a l'ocupabilitat I": "Itinerario personal para la empleabilidad I",
  "Anglès professional": "Inglés profesional"
};

const esToCaModules: Record<string, string> = {
  "Proyecto inter modular de aprendizaje colaborativo": "Projecte inter modular d'aprenentatge col·laboratiu",
  "Ciencias aplicadas I": "Ciències aplicades I",
  "Ciencias aplicadas II": "Ciències aplicades II",
  "Comunicación y sociedad I": "Comunicació i societat I",
  "Comunicación y sociedad II": "Comunicació i societat II",
  "Atención al cliente": "Atenció al client",
  "Cambio de color del cabello": "Canvis de color del cabell",
  "Cuidados estéticos básicos de manos y uñas": "Cures estètiques bàsiques de mans i ungles",
  "Depilación mecánica y decoloración del vello superfluo": "Depil·lació mecànica i decoloració mecànica del borrissol superflu",
  "Lavado y cambios de forma del cabello": "Rentat i canvis de forma del cabell",
  "Maquillaje": "Maquillatge",
  "Preparación del entorno profesional": "Preparació de l'entorn professional",
  "Itinerario para la empleabilidad": "Itinerari per l'ocupabilitat",
  "Técnicas de higiene facial y corporal": "Tècniques d’higiene facial i corporal",
  "Depilación mecánica y decoloración del vello": "Depilació mecànica i decoloració del borrissol",
  "Estética de manos y pies": "Estètica de mans i peus",
  "Análisis estético": "Anàlisi estètica",
  "Imagen corporal y hábitos saludables": "Imatge corporal i hàbits saludables",
  "Cosmetología para estética y belleza": "Cosmetologia per a estètica i bellesa",
  "Digitalización aplicada a los sectores productivos": "Digitalització aplicada als sectors productius",
  "Itinerario personal para la empleabilidad I": "Itinerari personal per a l’ocupabilitat I",
  "Inglés profesional": "Anglès professional"
};

const esToCa: Record<string, string> = {
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
  "Ámbito Sociolingüístico": "Àmbit Sociolingüístic",
  "Formación Profesional": "Formació Professional"
};

const caToEs: Record<string, string> = Object.entries(esToCa).reduce((acc, [es, ca]) => {
  acc[ca] = es;
  return acc;
}, {} as Record<string, string>);

function mapRa(r: any, lang: 'ca' | 'es') {
  const module = lang === 'ca' ? (r.module_ca || esToCaModules[r.module] || r.module) : (r.module_es || caToEsModules[r.module] || r.module);
  const description = lang === 'ca' ? (r.description_ca || r.description) : (r.description_es || r.description);
  const criterios = lang === 'ca' && r.criterios_ca && r.criterios_ca.length > 0 ? r.criterios_ca : (r.criterios_es || []);
  return { 
    id: r.id, 
    module, 
    description, 
    criterios, 
    tipoNivel: r.tipoNivel, 
    moduleCode: r.moduleCode 
  };
}

export const getRas = async (req: any, res: Response) => {
  try {
    const lang = req.query.lang === 'catalan' ? 'ca' : 'es';
    const ras = await RA.find();
    return res.json(ras.map(r => mapRa(r, lang)));
  } catch (error) {
    return res.status(500).json({ error: "No se pudieron cargar los RAs" });
  }
};

function mapCe(c: any, lang: 'ca' | 'es') {
  const subjectBase = c.subject.startsWith('Matemàtiques') ? 'Matemàtiques' : c.subject;
  const area = lang === 'ca' ? (esToCa[c.area] || c.area) : (caToEs[c.area] || c.area);
  const subject = lang === 'ca' ? (esToCa[subjectBase] || subjectBase) : (caToEs[subjectBase] || subjectBase);
  const description = lang === 'ca' && c.description_ca ? c.description_ca : (c.description_es || c.get('description'));
  const criterios = lang === 'ca' && c.criterios_ca ? c.criterios_ca : (c.criterios_es || c.get('criterios'));
  return { area, subject, ce_id: c.ce_id, description, criterios };
}

export const getCes = async (req: any, res: Response) => {
  try {
    const lang = req.query.lang === 'catalan' ? 'ca' : 'es';
    const ces = await CE.find();
    return res.json(ces.map(c => mapCe(c, lang)));
  } catch (error) {
    return res.status(500).json({ error: "No se pudieron cargar las CEs" });
  }
};
