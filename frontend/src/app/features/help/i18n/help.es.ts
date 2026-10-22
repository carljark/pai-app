import { HelpTexts } from '../tours/tour.model';

export const HELP_ES: HelpTexts = {
  welcome: {
    title: '¡Te damos la bienvenida a Plappin!',
    intro:
      'Plappin te ayuda a diseñar proyectos y situaciones de aprendizaje a partir del currículo oficial. ¿Te enseñamos cómo funciona? Son un par de minutos.',
    languageLabel: '¿En qué idioma prefieres usar Plappin?',
    start: 'Empezar la visita',
    later: 'Más tarde',
    never: 'No volver a mostrar',
  },
  panel: {
    title: 'Ayuda',
    close: 'Cerrar la ayuda',
    toursTitle: 'Visitas guiadas',
    startTour: 'Empezar',
    completed: 'Hecha',
    faqTitle: 'Preguntas frecuentes',
    contactTitle: '¿No encuentras lo que buscas?',
    contactText: 'Escríbenos tu duda o tu propuesta y te responderemos.',
    contactButton: 'Escríbenos',
  },
  sidebarLabel: 'Ayuda',
  helpButtonLabel: 'Ver cómo funciona esta pantalla',
  nav: {
    next: 'Siguiente',
    prev: 'Atrás',
    done: 'Terminar',
    progress: 'Paso {{current}} de {{total}}',
  },
  example: {
    banner:
      'Proyecto de ejemplo: lo puedes leer y exportar, pero no modificar. Si quieres cambiarlo, haz una copia: aparecerá en tu Área Personal.',
    copy: 'Hacer una copia',
    loadError: 'No se ha podido abrir el proyecto de ejemplo. Inténtalo de nuevo más tarde.',
  },
  tours: {
    intro: {
      title: 'Conoce Plappin',
      description: 'Las opciones del menú y para qué sirve cada una.',
      steps: [
        {
          title: 'Nuevo proyecto',
          text: 'Empieza aquí. Eliges tu ciclo o curso y los resultados de aprendizaje, y Plappin te propone un proyecto completo.',
        },
        {
          title: 'Área personal',
          text: 'Aquí tienes tus proyectos y los que otros docentes han compartido contigo.',
        },
        {
          title: 'Archivo',
          text: 'Los proyectos de todo el profesorado. Sirven de inspiración y puedes copiar los que te gusten.',
        },
        {
          title: 'Taller',
          text: 'Donde lees, revisas y mejoras el proyecto que tienes abierto, y lo descargas en Word o PDF.',
        },
        {
          title: 'Mapa intermodular',
          text: 'Muestra qué tienen en común los módulos de tu ciclo, con ideas de actividades para trabajarlos juntos.',
        },
        {
          title: 'Solicitar centro',
          text: '¿No encuentras tu ciclo? Pídelo aquí y lo incorporaremos.',
        },
        {
          title: 'Ayuda',
          text: 'Vuelve aquí cuando quieras para repetir esta visita, hacer otras o escribirnos.',
        },
      ],
    },
    generator: {
      title: 'Crea tu primer proyecto',
      description: 'Los pasos del generador, de la titulación al botón Generar.',
      steps: [
        {
          title: '1. Tu ciclo o curso',
          text: 'Elige la titulación y, si tiene varios cursos, el curso con el que trabajarás.',
        },
        {
          title: '2. El tipo de proyecto',
          text: 'Escoge la metodología: proyectos, retos o aprendizaje y servicio.',
        },
        {
          title: '3. Compartir (opcional)',
          text: 'Si diseñas el proyecto con otros docentes, añádelos aquí y lo podrán editar contigo.',
        },
        {
          title: '4. Tus indicaciones (opcional)',
          text: 'Cuenta en pocas palabras lo que debe tener en cuenta: el grupo, el entorno, una salida, un producto final…',
        },
        {
          title: '5. Lo que quieres trabajar',
          text: 'Abre cada módulo y marca los resultados de aprendizaje o competencias que quieres incluir.',
        },
        {
          title: '6. Generar',
          text: 'Aquí verás tu selección y el botón para generar. Cuando quieras, púlsalo: tarda unos minutos y te avisaremos cuando esté listo.',
        },
      ],
    },
    taller: {
      title: 'Revisa y edita tu proyecto',
      description: 'El taller, con un proyecto de ejemplo que puedes explorar sin miedo.',
      steps: [
        {
          title: 'Un proyecto de ejemplo',
          text: 'Para la visita abrimos un proyecto de ejemplo. No se puede modificar, pero puedes hacer una copia y cambiarla a tu gusto.',
        },
        {
          title: 'El proyecto',
          text: 'Aquí se lee el proyecto completo: identidad, fases y actividades, evaluación y anexos.',
        },
        {
          title: 'Descargar y guardar',
          text: 'Descárgalo en Word para retocarlo o en PDF para compartirlo. En tus proyectos, aquí también guardas y publicas los cambios.',
        },
        {
          title: 'Recursos y asistente',
          text: 'Pide cambios al asistente con tus palabras («añade una actividad de evaluación») y adjunta materiales del proyecto.',
        },
        {
          title: 'Ahora te toca a ti',
          text: 'Cuando generes tu propio proyecto, se abrirá aquí mismo. Tú decides: la IA propone y tú revisas.',
        },
      ],
    },
    mapa: {
      title: 'Explora el mapa',
      description: 'Cómo encontrar conexiones entre módulos e ideas de actividades.',
      steps: [
        {
          title: 'Ciclo y curso',
          text: 'Elige el ciclo y el curso cuyo mapa quieres ver.',
        },
        {
          title: 'Formas de verlo',
          text: 'Cambia entre la vista por pasos, el mapa mental o la vista panorámica.',
        },
        {
          title: 'Paso 1: módulo y resultado',
          text: 'Elige un módulo y uno de sus resultados de aprendizaje.',
        },
        {
          title: 'Paso 2: criterio',
          text: 'Escoge el criterio de evaluación que te interesa.',
        },
        {
          title: 'Paso 3: conexiones',
          text: 'Verás con qué otros módulos se relaciona y actividades para trabajarlos juntos. Desde aquí puedes crear un proyecto con esa conexión.',
        },
      ],
    },
  },
  faq: [
    {
      question: '¿Puedo cambiar lo que propone la IA?',
      answer:
        'Sí. En el taller puedes pedir cambios al asistente o descargar el proyecto en Word, editarlo y volver a subirlo.',
    },
    {
      question: '¿Dónde están mis proyectos?',
      answer: 'En el Área Personal. El Archivo reúne los proyectos de todo el profesorado.',
    },
    {
      question: '¿Qué son los RA y los criterios de evaluación?',
      answer:
        'Los resultados de aprendizaje (RA) son lo que el alumnado debe saber hacer al acabar un módulo, y los criterios de evaluación indican cómo comprobarlo. Plappin usa los oficiales de cada ciclo.',
    },
    {
      question: '¿Puedo trabajar un proyecto con otros docentes?',
      answer:
        'Sí. Añádelos en «Compartir con» al crear el proyecto. Mientras uno edita, el resto lo ve en solo lectura.',
    },
    {
      question: '¿Puedo tener el proyecto en castellano y en catalán?',
      answer:
        'Sí. Cambia el idioma en el menú y, en el taller, pulsa «Traducir» si el proyecto aún no está en ese idioma.',
    },
    {
      question: 'No encuentro mi ciclo, ¿qué hago?',
      answer: 'Pídelo desde «Solicitar centro» y te avisaremos cuando esté disponible.',
    },
  ],
};
