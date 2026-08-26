import { RA } from '../src/models/RA';

export async function up() {
  const newModuleData = [
    {
      module: "Proyecto inter modular de aprendizaje colaborativo",
      module_es: "Proyecto inter modular de aprendizaje colaborativo",
      id: "3160_RA1",
      description: "Busca información en internet sobre empresas «tipo» del sector/es relacionados con los estándares de competencia incluidos en el ámbito profesional del título, elaborando un mapa de las mismas y los servicios o productos que ofrecen.",
      description_es: "Busca información en internet sobre empresas «tipo» del sector/es relacionados con los estándares de competencia incluidos en el ámbito profesional del título, elaborando un mapa de las mismas y los servicios o productos que ofrecen.",
      description_ca: "Cerca informació a internet sobre empreses «tipus» del sector/s relacionats amb els estàndards de competència inclosos en l'àmbit professional del títol, elaborant un mapa d'aquestes i els serveis o productes que ofereixen."
    },
    {
      module: "Proyecto inter modular de aprendizaje colaborativo",
      module_es: "Proyecto inter modular de aprendizaje colaborativo",
      id: "3160_RA2",
      description: "Selecciona un servicio o producto de una empresa del sector relacionándolo con su contribución a los ODS y sus destinatarios a nivel global.",
      description_es: "Selecciona un servicio o producto de una empresa del sector relacionándolo con su contribución a los ODS y sus destinatarios a nivel global.",
      description_ca: "Selecciona un servei o producte d'una empresa del sector relacionant-lo amb la seva contribució als ODS i els seus destinataris a nivell global."
    },
    {
      module: "Proyecto inter modular de aprendizaje colaborativo",
      module_es: "Proyecto inter modular de aprendizaje colaborativo",
      id: "3160_RA3",
      description: "Hace una propuesta de una empresa tipo «spin-off» indicando los aspectos diferenciales con la empresa de referencia y elaborando un dosier con sus características.",
      description_es: "Hace una propuesta de una empresa tipo «spin-off» indicando los aspectos diferenciales con la empresa de referencia y elaborando un dosier con sus características.",
      description_ca: "Fa una proposta d'una empresa tipus «spin-off» indicant els aspectes diferencials amb l'empresa de referència i elaborant un dossier amb les seves característiques."
    },
    {
      module: "Proyecto inter modular de aprendizaje colaborativo",
      module_es: "Proyecto inter modular de aprendizaje colaborativo",
      id: "3160_RA4",
      description: "Relaciona cada unidad de una empresa tipo con la prevención de riesgos profesionales, identificando los equipos/sistemas de protección generales y los propios de cada actividad.",
      description_es: "Relaciona cada unidad de una empresa tipo con la prevención de riesgos profesionales, identificando los equipos/sistemas de protección generales y los propios de cada actividad.",
      description_ca: "Relaciona cada unitat d'una empresa tipus amb la prevenció de riscos professionals, identificant els equips/sistemes de protecció generals i els propis de cada activitat."
    },
    {
      module: "Proyecto inter modular de aprendizaje colaborativo",
      module_es: "Proyecto inter modular de aprendizaje colaborativo",
      id: "3160_RA5",
      description: "Transmite información con claridad de manera ordenada y estructurada.",
      description_es: "Transmite información con claridad de manera ordenada y estructurada.",
      description_ca: "Transmet informació amb claredat de manera ordenada i estructurada."
    }
  ];

  let count = 0;
  for (const ra of newModuleData) {
    const existing = await RA.findOne({ id: ra.id });
    if (!existing) {
      await new RA(ra).save();
      count++;
    }
  }
  console.log(`Insertados ${count} nuevos RAs del módulo Proyecto Intermodular.`);
}
