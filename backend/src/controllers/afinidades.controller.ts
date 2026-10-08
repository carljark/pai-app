import type { Request, Response } from 'express';
import { AfinidadEso, type AfinidadEsoData } from '../models/AfinidadEso';
import { CE } from '../models/CE';
import { AFINIDADES_TABS, cursoDeTab } from '../data/niveles';

interface CriterioTexto {
  id: string;
  text_es: string;
  text_ca: string;
}

interface CeEso {
  subjectCode: string;
  subject_es: string;
  subject_ca: string;
  subjectTipos?: Record<string, string>;
  ce_num: number;
  criteriosPorCurso?: { id: string; cursos: string[]; text_es: string; text_ca: string }[];
}

type Vinculo = { criterios: Record<string, string[]> } & Record<string, unknown>;

/** Texto oficial de un criterio en el curso indicado (los ids se repiten entre 1.º-3.º y 4.º). */
const criterioTexto = (ces: CeEso[], materia: string, id: string, curso: string): CriterioTexto => {
  const num = Number(id.split('.')[0]);
  const ce = ces.find((c) => c.subjectCode === materia && c.ce_num === num);
  const crit = ce?.criteriosPorCurso?.find((c) => c.id === id && c.cursos.includes(curso));
  return { id, text_es: crit?.text_es ?? '', text_ca: crit?.text_ca ?? '' };
};

const conTextos = (vinculo: Vinculo, ces: CeEso[], curso: string) => ({
  ...vinculo,
  criteriosTexto: Object.fromEntries(
    Object.entries(vinculo.criterios).map(([m, ids]) => [m, ids.map((id) => criterioTexto(ces, m, id, curso))])
  )
});

/** Materias que se imparten en el curso, con el número de fichas en que aparecen. */
const materiasDelCurso = (ces: CeEso[], curso: string, afinidades: { materias: string[] }[]) => {
  const vistas = new Map<string, CeEso>();
  for (const ce of ces) if (ce.subjectTipos?.[curso] && !vistas.has(ce.subjectCode)) vistas.set(ce.subjectCode, ce);
  return [...vistas.values()]
    .map((ce) => ({
      code: ce.subjectCode,
      name_es: ce.subject_es,
      name_ca: ce.subject_ca,
      tipo: ce.subjectTipos?.[curso] ?? '',
      total: afinidades.filter((a) => a.materias.includes(ce.subjectCode)).length
    }))
    .sort((a, b) => a.name_ca.localeCompare(b.name_ca, 'ca'));
};

export const getAfinidadesEso = async (req: Request, res: Response) => {
  try {
    const tab = req.query.tab as string;
    if (!tab || !AFINIDADES_TABS.includes(tab)) {
      return res.status(400).json({
        error: `Parámetro 'tab' inválido o ausente. Valores permitidos: ${AFINIDADES_TABS.join(', ')}`
      });
    }
    const curso = cursoDeTab(tab) as string;
    const [docs, ces] = await Promise.all([
      AfinidadEso.find({ tab }).sort({ order: 1 }).select('-_id -__v -createdAt -updatedAt -tab -order')
        .lean<(Omit<AfinidadEsoData, 'id'> & { code: string })[]>(),
      CE.find({ tipoNivel: 'ESO_ORDINARIA' }).lean<CeEso[]>()
    ]);
    const afinidades = docs.map(({ code, vinculos, ...a }) => ({
      ...a,
      id: code,
      vinculos: (vinculos as unknown as Vinculo[]).map((v) => conTextos(v, ces, curso))
    }));
    return res.json({ curso, materias: materiasDelCurso(ces, curso, afinidades), afinidades });
  } catch (error: unknown) {
    console.error('Error al obtener las afinidades de la ESO:', error);
    return res.status(500).json({ error: 'Error interno del servidor al recuperar las afinidades' });
  }
};
