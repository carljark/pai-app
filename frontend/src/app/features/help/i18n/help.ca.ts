import { HelpTexts } from '../tours/tour.model';

export const HELP_CA: HelpTexts = {
  welcome: {
    title: 'Et donam la benvinguda a Plappin!',
    intro:
      "Plappin t'ajuda a dissenyar projectes i situacions d'aprenentatge a partir del currículum oficial. Vols que t'ensenyem com funciona? És un parell de minuts.",
    languageLabel: 'En quin idioma prefereixes fer servir Plappin?',
    start: 'Començar la visita',
    later: 'Més tard',
    never: 'No tornar-ho a mostrar',
  },
  panel: {
    title: 'Ajuda',
    close: "Tancar l'ajuda",
    toursTitle: 'Visites guiades',
    startTour: 'Començar',
    completed: 'Feta',
    faqTitle: 'Preguntes freqüents',
    contactTitle: 'No trobes el que cerques?',
    contactText: 'Escriu-nos el teu dubte o la teva proposta i et respondrem.',
    contactButton: 'Escriu-nos',
  },
  sidebarLabel: 'Ajuda',
  helpButtonLabel: 'Veure com funciona aquesta pantalla',
  nav: {
    next: 'Següent',
    prev: 'Enrere',
    done: 'Acabar',
    progress: 'Pas {{current}} de {{total}}',
  },
  example: {
    banner:
      "Projecte d'exemple: el pots llegir i exportar, però no modificar. Si el vols canviar, fes-ne una còpia: apareixerà a la teva Àrea Personal.",
    copy: 'Fer-ne una còpia',
    loadError: "No s'ha pogut obrir el projecte d'exemple. Torna-ho a provar més tard.",
  },
  tours: {
    intro: {
      title: 'Coneix Plappin',
      description: 'Les opcions del menú i per a què serveix cadascuna.',
      steps: [
        {
          title: 'Nou projecte',
          text: "Comença aquí. Tries el teu cicle o curs i els resultats d'aprenentatge, i Plappin et proposa un projecte complet.",
        },
        {
          title: 'Àrea personal',
          text: 'Aquí tens els teus projectes i els que altres docents han compartit amb tu.',
        },
        {
          title: 'Arxiu',
          text: "Els projectes de tot el professorat. Serveixen d'inspiració i pots copiar els que t'agradin.",
        },
        {
          title: 'Taller',
          text: 'On llegeixes, revises i millores el projecte que tens obert, i el descarregues en Word o PDF.',
        },
        {
          title: 'Mapa intermodular',
          text: "Mostra què tenen en comú els mòduls del teu cicle, amb idees d'activitats per treballar-los junts.",
        },
        {
          title: 'Sol·licitar centre',
          text: "No trobes el teu cicle? Demana'l aquí i l'incorporarem.",
        },
        {
          title: 'Ajuda',
          text: 'Torna aquí quan vulguis per repetir aquesta visita, fer-ne d’altres o escriure’ns.',
        },
      ],
    },
    generator: {
      title: 'Crea el teu primer projecte',
      description: 'Els passos del generador, de la titulació al botó Generar.',
      steps: [
        {
          title: '1. El teu cicle o curs',
          text: 'Tria la titulació i, si té diversos cursos, el curs amb què treballaràs.',
        },
        {
          title: '2. El tipus de projecte',
          text: 'Escull la metodologia: projectes, reptes o aprenentatge i servei.',
        },
        {
          title: '3. Compartir (opcional)',
          text: 'Si dissenyes el projecte amb altres docents, afegeix-los aquí i el podran editar amb tu.',
        },
        {
          title: '4. Les teves indicacions (opcional)',
          text: "Explica en poques paraules què ha de tenir en compte: el grup, l'entorn, una sortida, un producte final…",
        },
        {
          title: '5. El que vols treballar',
          text: "Obre cada mòdul i marca els resultats d'aprenentatge o les competències que vols incloure.",
        },
        {
          title: '6. Generar',
          text: "Aquí veuràs la teva selecció i el botó per generar. Quan vulguis, prem-lo: tarda uns minuts i t'avisarem quan estigui llest.",
        },
      ],
    },
    taller: {
      title: 'Revisa i edita el teu projecte',
      description: "El taller, amb un projecte d'exemple que pots explorar sense por.",
      steps: [
        {
          title: "Un projecte d'exemple",
          text: "Per a la visita obrim un projecte d'exemple. No es pot modificar, però en pots fer una còpia i canviar-la al teu gust.",
        },
        {
          title: 'El projecte',
          text: 'Aquí es llegeix el projecte complet: identitat, fases i activitats, avaluació i annexos.',
        },
        {
          title: 'Descarregar i desar',
          text: 'Descarrega’l en Word per retocar-lo o en PDF per compartir-lo. En els teus projectes, aquí també deses i publiques els canvis.',
        },
        {
          title: 'Recursos i assistent',
          text: "En els teus projectes (o en la teva còpia d'aquest) podràs demanar canvis a l'assistent amb les teves paraules («afegeix una activitat d'avaluació») i adjuntar materials del projecte.",
        },
        {
          title: 'Ara és el teu torn',
          text: "Quan generis el teu propi projecte, s'obrirà aquí mateix. Tu decideixes: la IA proposa i tu revises.",
        },
      ],
    },
    mapa: {
      title: 'Explora el mapa',
      description: "Com trobar connexions entre mòduls i idees d'activitats.",
      steps: [
        {
          title: 'Cicle i curs',
          text: 'Tria el cicle i el curs del qual vols veure el mapa.',
        },
        {
          title: 'Maneres de veure’l',
          text: 'Canvia entre la vista per passos, el mapa mental o la vista panoràmica.',
        },
        {
          title: 'Pas 1: mòdul i resultat',
          text: "Tria un mòdul i un dels seus resultats d'aprenentatge.",
        },
        {
          title: 'Pas 2: criteri',
          text: "Escull el criteri d'avaluació que t'interessa.",
        },
        {
          title: 'Pas 3: connexions',
          text: 'Veuràs amb quins altres mòduls es relaciona i activitats per treballar-los junts. Des d’aquí pots crear un projecte amb aquesta connexió.',
        },
      ],
    },
  },
  faq: [
    {
      question: 'Puc canviar el que proposa la IA?',
      answer:
        "Sí. Al taller pots demanar canvis a l'assistent o descarregar el projecte en Word, editar-lo i tornar-lo a pujar.",
    },
    {
      question: 'On són els meus projectes?',
      answer: "A l'Àrea Personal. L'Arxiu aplega els projectes de tot el professorat.",
    },
    {
      question: "Què són els RA i els criteris d'avaluació?",
      answer:
        "Els resultats d'aprenentatge (RA) són allò que l'alumnat ha de saber fer en acabar un mòdul, i els criteris d'avaluació indiquen com comprovar-ho. Plappin fa servir els oficials de cada cicle.",
    },
    {
      question: 'Puc treballar un projecte amb altres docents?',
      answer:
        'Sí. Afegeix-los a «Compartir amb» en crear el projecte. Mentre un edita, la resta el veu en només lectura.',
    },
    {
      question: 'Puc tenir el projecte en castellà i en català?',
      answer:
        "Sí. Canvia l'idioma al menú i, al taller, prem «Traduir» si el projecte encara no és en aquest idioma.",
    },
    {
      question: 'No trob el meu cicle, què faig?',
      answer: "Demana'l des de «Sol·licitar centre» i t'avisarem quan estigui disponible.",
    },
  ],
};
