# PLATAFORMA DE APRENDIZAJE INTERMODULAR (PAI)
## Documento de Contexto y Especificaciones de Requisitos del Sistema (SRS)
*Diseñado para su procesamiento por agentes de IA y herramientas CLI (`antigravity-cli`)*

---

## 1. Identificación y Contexto del Proyecto

* **Nombre de la Aplicación:** Plataforma de Aprendizaje Intermodular (PAI) [250, 558]
* **Autora e Investigadora:** Eva Maria Peralta Wöstmann [250, 558]
* **Naturaleza del Proyecto:** Proyecto de Innovación Educativa (PIE) y núcleo de investigación doctoral [250, 558]
* **Metodología de la Investigación:** Investigación Basada en el Diseño (IBD) con ciclos iterativos de análisis, diseño, desarrollo técnico y evaluación educativa [266, 566, 569]
* **Centro de Implementación Piloto:** IES Cap de Llevant (Mahón, Menorca), Familia Profesional de Imagen Personal, Ciclo Formativo de Grado Básico (Grado D) [255]

---

## 2. Problema de Partida y Motivación de la Aplicación

La implantación de la nueva ley de Formación Profesional exige una transformación pedagógica orientada al aprendizaje por competencias y la intermodularidad [514, 559]. Sin embargo, en el aula se presentan los siguientes problemas críticos que la aplicación PAI debe resolver:

1. **Disgregación Curricular e Incomunicación Docente:** Tradicionalmente, los docentes de diferentes materias o módulos en FP Básica (técnicos, sociolingüísticos, científico-técnicos) trabajan de forma aislada [250, 256]. Desconocen las actividades, objetivos curriculares y progresos del alumnado en otras asignaturas [250, 256].
2. **Elevada Carga Cognitiva y Burocrática (Burnout):** Intentar cruzar los currículos oficiales de múltiples especialidades para planificar proyectos comunes genera una alta carga de estrés, burocracia y consumo de tiempo de coordinación en el profesorado [521, 559]. Las reuniones de coordinación suelen ser poco productivas ante la falta de herramientas que automaticen esta vinculación curricular [256, 257].
3. **Desmotivación y Abandono Escolar en FP Básica:** El alumnado de Grado Básico suele percibir las materias teóricas (ámbitos sociolingüístico y científico-técnico) como aburridas e inútiles para su futuro taller profesional [260]. Existe una desconexión entre la teoría y la práctica que reduce el éxito académico y propicia el abandono escolar [253, 260].
4. **Alta Rotación del Profesorado:** El cambio anual de un porcentaje significativo del equipo docente dificulta dar continuidad a los proyectos del centro [263]. Se necesita un repositorio que centralice las programaciones y las evidencias de aprendizaje [261, 263].

---

## 3. Requerimientos Pedagógicos y Metodológicos (El "Puente Curricular")

La aplicación PAI no es un simple generador de texto plano. Debe funcionar como un **puente curricular inteligente** que entienda la pedagogía de la Formación Profesional:

* **Enfoque en Metodologías Activas:** El motor de IA debe estructurar los proyectos bajo metodologías de Aprendizaje Basado en Proyectos (ABP), Aprendizaje Basado en Retos (ABR) o Aprendizaje-Servicio (ApS) [519, 559].
* **Intermodularidad Inseparable:** La regla de oro del generador es que el reto propuesto no pueda resolverse si el alumno no aplica simultáneamente y de forma integrada los conocimientos y resultados de aprendizaje de las distintas materias cruzadas [519, 520].
* **Evaluación Formativa y Triangulada:** La plataforma debe permitir una evaluación compartida (triangulada) entre docentes de diferentes materias mediante rúbricas cualitativas comunes [251, 258, 520, 565]. El profesor del ámbito técnico evalúa la práctica, el del ámbito común evalúa la teoría/comunicación, y ambos cocalifican el producto final [520].
* **Competencia de "Aprender a Aprender":** Integración sistemática de herramientas de autoevaluación, coevaluación y rutinas de pensamiento para que el alumno reflexione sobre su propio proceso de aprendizaje y asimile el error como oportunidad [252, 258, 261].

---

## 4. Requisitos Funcionales de la Aplicación

### 4.1. Interfaz y Flujo de Trabajo para el Docente
La plataforma debe guiar paso a paso al docente en la planificación, eliminando las interfaces de "caja de texto libre" (tipo ChatGPT convencional) para dar paso a un entorno estructurado [517]:

1. **Panel de Selección Múltiple:** El docente selecciona de forma interactiva cuáles son los módulos profesionales o ámbitos del currículo que desea conectar (ej. *Atención al Cliente* y *Maquillaje*) [518, 520].
2. **Carga de Objetivos y Resultados de Aprendizaje (RA):** La aplicación despliega los Resultados de Aprendizaje y Competencias Específicas oficiales asociados a esos módulos (según los reales decretos de currículo) [518]. El docente marca cuáles desea evaluar en el proyecto conjunto [518].
3. **Definición de Parámetros Metodológicos:** Selección del tipo de proyecto (ABP, ABR, ApS) y la duración estimada [519, 559].
4. **Generador de Estructuras Intermodulares (Motor de IA):** A partir del input, la IA formula el reto real o simulado, las tareas específicas ligadas a cada módulo y las pautas del producto final [519].
5. **Repositorio Colaborativo:** Espacio de código abierto para almacenar, catalogar y reutilizar las Situaciones de Aprendizaje (SdA) y las unidades de aprendizaje creadas conjuntamente por el claustro [251, 253, 258].

### 4.2. Entorno Visual y Portafolio para el Alumnado
La interfaz del alumnado de FP Básica debe caracterizarse por la sencillez, claridad visual y gamificación motivacional:

1. **Mapa de Progreso Visual:** Un panel interactivo donde el alumno visualiza de forma clara qué conocimientos y competencias se espera que adquiera y cuál es su avance real hacia los objetivos de promoción [252, 260].
2. **Portafolio Digital de Evidencias:** Espacio personal donde subir los entregables (vídeos, fotos del taller, documentos técnicos) de las actividades interdisciplinares [252, 259, 266].
3. **Módulo de Autoevaluación e Interacción:** El alumno accede a rúbricas visuales simplificadas (ej. dianas de evaluación), realiza coevaluaciones con sus compañeros y registra sus diarios de aprendizaje o rutinas de pensamiento [252, 258, 261, 803].

---

## 5. Arquitectura del Sistema e Infraestructura de IA (Evolución por Fases)

La investigación de la tesis doctoral define una arquitectura técnica evolutiva en dos fases claras [560]:

```
+-------------------------------------------------------------------------------+
|                                ARQUITECTURA PAI                               |
+-------------------------------------------------------------------------------+
| FASE I: MVP Pedagógico (Pruebas de concepto y validación ágil)                |
|  Docentes ---> Interfaz de Usuario ---> API comercial (Claude/GPT-class)      |
|  * Rápido desarrollo, pero dependencia externa y falta de soberanía de datos   |
+-------------------------------------------------------------------------------+
| FASE II: Producción Local y Soberana (Motor IA en Servidor del Centro)       |
|  Docentes ---> Interfaz ---> Motor de IA Local (SLM/LLM local en Nvidia GPU)  |
|  * Soberanía del dato, privacidad 100% de menores, cero costes de APIs         |
+-------------------------------------------------------------------------------+
```

### 5.1. Fase I: MVP Pedagógico (Curso 2026/2027)
* **Objetivo:** Verificar la viabilidad pedagógica del cruce de asignaturas y validar los prompts estructurados de forma ágil [561, 563, 566].
* **Tecnología:** Interfaz conectada mediante API a modelos comerciales de frontera (como Claude o GPT-class) [560, 567, 643].
* **Seguridad en Fase I:** Prohibición estricta de subir datos personales del alumnado, expedientes, entrevistas o materiales confidenciales del centro a estas plataformas públicas [50, 61, 86].

### 5.2. Fase II: Migración a Inteligencia Artificial Local (Cursos 2027-2030)
* **Objetivo:** Lograr una independencia tecnológica, soberanía de datos, eliminación de costes recurrentes de APIs comerciales y garantía absoluta de la privacidad del alumnado [266, 561, 564].
* **Infraestructura:** Servidor físico propio instalado dentro de la intranet de los centros educativos, equipado con hardware dedicado a la inferencia de IA (previsiblemente un chip de alto rendimiento gráfico/IA Nvidia de la gama RTX, como *RTX Spark*) [567].
* **Optimización y RAG:** Carga local de los documentos de programaciones y decretos oficiales en la base de datos de conocimientos de la plataforma para resolver las consultas de intermodularidad mediante Retrieval-Augmented Generation (RAG) local, optimizando la ventana de contexto y eliminando las alucinaciones del modelo [544, 567].
* **Concurrencia:** El sistema debe optimizarse para soportar múltiples peticiones de docentes y alumnos de forma simultánea dentro del centro [567].

---

## 6. Cumplimiento Legal, Normativo y Ético del Sistema

La construcción de la plataforma PAI y la generación de proyectos intermodulares debe alinearse obligatoriamente con el marco legal educativo y tecnológico vigente:

### 6.1. Marco Legal Educativo (Formación Profesional)
* **Ley Orgánica 3/2022 de Ordenación e Integración de la FP:** En su **Artículo 41**, determina el carácter integrador y obligatorio del **"Proyecto Intermodular"** en todos los ciclos formativos [42, 549, 580].
* **Real Decreto 659/2023 de Ordenación de la FP:**
  * En Grado Básico, el módulo se denomina **"Proyecto Intermodular de Aprendizaje Colaborativo"** (Código **3160**), con carácter obligatorio en el currículo [138, 603, 606, 825, 829].
  * Duración mínima obligatoria de **25 horas** lectivas, impartido de forma simultánea a lo largo del ciclo [603, 606].
  * **Organización en dos ejes horarios lectivos semanales [276, 583, 584, 827, 828]:**
    * *Eje 1 (1 hora):* Destinado a la planificación de necesidades específicas del alumnado y coordinación con empresas u organismos colaboradores, preferentemente liderado por el Tutor Dual [583, 584, 827, 828].
    * *Eje 2 (1 hora):* Centrado en el seguimiento académico, tutorización individual/grupal y evaluación final, bajo responsabilidad del tutor de 2º curso [583, 827, 829].
* **Modalidad de Programación (Proyecto Expandido vs. No Expandido):**
  * *Proyecto No Expandido (Opción A):* Se desarrolla estrictamente en las horas del módulo específico de proyecto [585, 830]. Tiene un alcance limitado y menor coordinación [585, 830].
  * *Proyecto Expandido (Opción B):* Integra de manera real las horas lectivas de otros módulos profesionales participantes, justificándolo expresamente en sus programaciones didácticas (ej. detallando que la evaluación del RA3 del módulo técnico sirve para co-calificar el Proyecto Intermodular) [585, 586, 588, 830, 831, 834, 835]. **Esta es la modalidad recomendada y potenciada por PAI [521, 559].**

### 6.2. Privacidad y Soberanía Tecnológica (Protección de Datos)
El uso de IA en entornos donde participan alumnos de FP Básica (muchos de ellos menores de edad) requiere un blindaje estricto de la privacidad:

* **Privacidad desde el Diseño (Privacy by Design):** Consagrado en el Artículo 25.1 del RGPD [150]. La arquitectura de IA local en un servidor del centro es la salvaguarda técnica principal para garantizar este principio [572].
* **Reglamento General de Protección de Datos (RGPD - UE 2016/679) y LOPDGDD 3/2018:** Todas las interacciones deben ser locales para evitar el tratamiento ilícito o la exfiltración a servidores extranjeros [143, 572].
* **Dictamen 28/2024 del Comité Europeo de Protección de Datos (CEPD):** Advierte sobre los riesgos de reidentificación indirecta mediante cruce de datos en modelos generativos, subrayando que los LLMs entrenados con datos personales no siempre pueden considerarse anónimos [24, 25, 26, 118, 119]. El sistema PAI local debe mitigar la regurgitación de información sensible y evitar exfiltrar huellas digitales o datos del alumnado [24, 25, 239].
* **Propiedad Intelectual y Derechos de Autor (Reglamento IA de la UE 2024/1689):** Los proveedores de modelos deben respetar el derecho de exclusión (opt-out) expresado en formatos legibles por máquina conforme a la especificación RFC 9309 (robots.txt, ai.txt) [3, 6, 237, 623]. La plataforma PAI debe basarse en software y bases de datos lícitamente obtenidas y promover licencias libres como Creative Commons para su repositorio [24, 102, 253, 635].

### 6.3. Ética de la Investigación Académica (Ecosistema Tesis)
* **Recomendaciones del Comité Español de Ética de la Investigación:** El sistema debe garantizar la **inspeccionabilidad y trazabilidad** [19, 115]. Para ello, la aplicación integrará un registro estructurado o **bitácora de prompts** vinculada a la cuenta de usuario del docente, documentando la versión del modelo, el prompt empleado, la fecha, las verificaciones y la decisión de descarte o incorporación manual [10, 51, 66, 628, 629].
* **Taxonomía GAIDeT:** El documento de especificaciones asume la taxonomía GAIDeT (Suchikova et al., 2025-2026) para clasificar con precisión las tareas delegadas de forma transparente, diferenciando de forma inequívoca el uso lingüístico instrumental del uso sustantivo de la IA [14, 15, 28, 89].

---

## 7. Directrices para el Motor de IA Intermodular (Instrucciones del Sistema)

Para que el modelo de lenguaje de la aplicación (ya sea comercial en Fase I o local en Fase II) genere adecuadamente los proyectos, el sistema PAI debe inyectar la siguiente plantilla de prompt oculto:

```markdown
Actúa como un diseñador curricular experto en Formación Profesional Básica y metodologías activas (ABP, ABR, ApS). 
Tu tarea es diseñar un proyecto de aprendizaje colaborativo intermodular que fusione de manera inseparable los siguientes módulos: [MÓDULO A] y [MÓDULO B].

Reglas estrictas de diseño:
1. El proyecto debe plantear un reto real o simulado adaptado a la realidad del sector productivo.
2. Es obligatorio e indispensable que la solución final requiera que el estudiante aplique simultáneamente los Resultados de Aprendizaje de ambos módulos. El proyecto no se puede resolver exitosamente usando conocimientos de una sola de las áreas.
3. Estructura tu respuesta con la siguiente plantilla:
   - Título del Proyecto (atractivo y motivacional para grado básico).
   - El Escenario / Reto.
   - Tareas del Módulo A (Resultados de Aprendizaje y criterios asociados).
   - Tareas del Módulo B (Resultados de Aprendizaje y criterios asociados).
   - El Producto o Entregable final donde se unifican ambos módulos de forma inseparable.
   - Pautas para la evaluación formativa conjunta (rúbrica cualitativa triangulada).
   - Preguntas de reflexión metacognitiva y rutinas de pensamiento para el portafolio del alumno.
```

---
*Este documento de especificaciones garantiza el rigor pedagógico, la viabilidad técnica y el cumplimiento ético-legal requeridos para el desarrollo de la aplicación PAI y su validación científica.* [2, 562, 572, 622]
