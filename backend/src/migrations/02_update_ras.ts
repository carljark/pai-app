import mongoose from 'mongoose';
import { RA } from '../models/RA';

export const up = async () => {
  console.log('Actualizando RAs de Ciencias Aplicadas e Itinerario...');

  // Eliminar los viejos
  await RA.deleteMany({
    module: { $in: [
      'Ciencias aplicadas',
      'Ciencias aplicadas I',
      'Ciencias aplicadas II',
      'Ciències aplicades',
      'Ciències aplicades I',
      'Ciències aplicades II',
      "Itinerari per l'ocupabilitat",
      "Itinerario para la empleabilidad"
    ]}
  });

  const ca_1 = [
    "Resol problemes matemàtics en situacions quotidianes, utilitzant els elements bàsics del llenguatge matemàtic i les seves operacions.",
    "Reconeix les instalacions i el material de laboratori valorant-los com a recursos necessaris per a la realització de les pràctiques.",
    "Identifica propietats fonamentals de la matèria en les diferents formes en que se presenta en la naturta, manejant les magnituds físiques i les unitats fonamentals en unitats del sistema mètric decimal.",
    "Utilitza el mètode més adequat pèr a la separació de components de mescles senzilles relacionant-ho amb el procés físic o químic en què es basa.",
    "Reconeix com l'energia estar present en els processos naturals descrivint fenòmens simples de la vida real.",
    "Localitza les estructures anatòmiques bàsiques discriminant els sistemes o aparells als que pertanyen i associant-los a les funcions que produeixen a l'organisme.",
    "Diferencia la salut de la malaltia, relacionant els hàbits de vids amb les malalties més freqüents reconeixent els principis bàsics de defensa contra les mateixes.",
    "Elabora menus i dietes equilibrades senzilles diferenciant els nutrients que contenen i adaptant-los als diferents paràmetres corporals i a situacions diverses.",
    "Resol situacions quotidianes utilitzant expressions algebraiques senzilles i aplicant els mètodes de resolució més adequats."
  ];

  const ca_2 = [
    "Resol situacions quotidianes aplicant els mètodes de resolució d'equacions i sistemes i valorant la precisió, simplicitat i utilitat del llenguatge algebraic.",
    "Resol problemes senzills d'índole diversa, mitjançant el seu anàlisi contrastat i aplicant les fases del mètode científic.",
    "Realitza mesures directes i indirectes de figures geomètriques presents en contextos reals, utilitzant instruments, les fòrmules i les tècniques necessàries.",
    "Interpreta gràfiques de dos magnituds calculant els paràmetres significatius de les mateixes i relacionant-lo amb funcions matemàtiques elementals i els principals valors estadístics.",
    "Aplica tècniques físiques i químiques, utilutzant el material necessari, per a la realització de pràctiques de laboratori senzilles, medint les magnituds implicades.",
    "Reconeix reaccions químiques que es produeixen en els processos biològics i en la indústria argumentant las seva importància en la vida quotidiana i descrivint els canvis que es produeixen.",
    "Identifica aspectes positius i negatius de l'ús de l'energia nuclear descrivint els efectes de la contaminació generada en la seva aplicació.",
    "Identifica els canvis que es produeixen en el planeta terra argumentant les seves causes i tenint en compte les diferències que existeixen entre relleu i paisatge.",
    "Categoritza contaminants atmosfèrics principals identificant els seus orígens i relacionant-los amb els efectes que produeixen.",
    "Identifica els contaminants de l'aigua relaconant el seu efecte en el medi ambient amb el seu tractament de depuració.",
    "Contribueix a l'equilibri mediambiental analitzant i argumentant les línies bàsiques sobre el desenvolupament sostenible i proposant accions de millora i conservació.",
    "Relaciona les forces que apareixen en situacions habituals amb els efectes produits tenint en compte la seva contribució al moviment o repòs dels objectes i les magnituds posades en joc.",
    "Identifica els aspectes bàsics de la producció, transport i utilització de l'energia elèctrica i els factors que intervenen en el consum, descrivint els canvis produïts i les magnituds i valors característics.",
    "Preveu la possibilitat d'aparició d'enfermetats bàsiques, emprant tècniques de manteniment i desinfecció dels utensilis i aparells empreats en es seves actuacins derivades de la seva professió."
  ];

  const it = [
    "Desenvolupa activitats d'autoconeixement que li permeten orientar-se a camps professionals motivadors en els quals pot desplegar totes les seves capacitats.",
    "Desenvolupa habilitats socials concretes que s'han demostrat com a fonamentals a l'hora de trobar una ocupació i mantenir-lo.",
    "Accedeix a la informació dels possibles itineraris acadèmics i/o professionals que té al seu abast a través de la recerca i la reflexió lliure d'estereotips vocacionals.",
    "Posa en marxa un itinerari propi. analitza les diferents opcions educatives i professionals, valora els avantatges i inconvenients de cadascuna d'elles i examina aquells fets que millor s'ajusten a les seves possibilitats i preferències.",
    "Coneix les estratègies d'accés al mercat de treball per compte d'altri i utilitza les eines necessàries per al procés d'inserció laboral."
  ];

  const docs = [
    ...ca_1.map((desc, i) => ({
      id: `RA${i + 1}`,
      module: "Ciencias aplicadas I",
      description: desc,
      description_ca: desc
    })),
    ...ca_2.map((desc, i) => ({
      id: `RA${i + 1}`,
      module: "Ciencias aplicadas II",
      description: desc,
      description_ca: desc
    })),
    ...it.map((desc, i) => ({
      id: `RA${i + 1}`,
      module: "Itinerari per l'ocupabilitat",
      description: desc,
      description_ca: desc
    }))
  ];

  await RA.insertMany(docs);
  console.log(`Insertados ${docs.length} nuevos RAs corregidos.`);
};
