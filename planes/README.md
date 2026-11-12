# Planes de cambio

Planes escritos con la skill `proponer-cambio` antes de implementar una tarea grande. Estados: _Propuesto_, _Implementado (tarea 200)_, _Descartado_ e _Implementado (tarea NNN)_; la tarea correspondiente se documenta en `tareas/`.

## Planes

- **[256 — Servidor MCP para usar Plappin desde Claude o Gemini](256_plan_servidor_mcp.md)** · _Implementado (tarea 256)_  
  Servidor MCP remoto en `/api/mcp` con tokens personales revocables: los docentes trabajan con sus proyectos, el currículo y los mapas desde Claude o Gemini CLI con los mismos permisos que en la web, y los administradores tienen además herramientas de administración.

- **[255 — Revisión automática del proyecto con IA](255_plan_revision_automatica_proyecto.md)** · _Implementado (tarea 255)_  
  Botón «Revisar con IA» en el taller: nota de 1 a 5, justificación y sugerencias en 9 dimensiones (alineación curricular, coherencia, actividades, evaluación, DUA…), asíncrono como la traducción y en el idioma del proyecto.

- **[253 — Ampliación del mapa de afinidades de 4.º de ESO y actividades conjuntas](253_plan_mapa_eso_4_fichas_y_actividades_conjuntas.md)** · _Implementado (tarea 253)_  
  Repite en 4.º las tareas 247 y 251: 16 fichas nuevas hasta que cada materia aparezca en 6, y 3 actividades conjuntas por ficha redactadas con DeepSeek, con todos los tramos en paralelo.

- **[251 — Ampliación de los mapas de afinidades de 2.º y 3.º de ESO y actividades conjuntas](251_plan_mapa_eso_2_y_3_fichas_y_actividades_conjuntas.md)** · _Implementado (tarea 251)_  
  Repite la tarea 247 en 2.º y 3.º: fichas nuevas hasta que cada materia aparezca en al menos 6, y 3 actividades conjuntas por ficha redactadas con DeepSeek, con todos los tramos en paralelo.

- **[250 — FP Básica al plan 2026/27 en el mapa y en el generador](250_plan_fp_basica_plan_2026_27_mapa_y_curriculo.md)** · _Implementado (tarea 250)_  
  Mapa de FP Básica en dos pestañas (1.º y 2.º) con el Proyecto intermodular 3160 y Comunicación y Ciencias Sociales II, módulos comunes con los códigos 3161–3164 del plan 2026/27 y RA del generador con código de módulo, filtro por curso y el 3159.

- **[249 — Cesta de materias y módulos en los mapas (ESO y FP)](249_plan_cesta_de_materias_mapas.md)** · _Implementado (tarea 249)_  
  Botón «Añadir a la cesta» en la vista clásica y cesta en el mapa mental a la que se arrastran las bolas de materias o módulos (con sonido «PLAPP»). Lo arrastrado aporta los criterios o RA que tiene en común con el resto de la cesta, para crear un proyecto con varias materias o módulos.

- **[248 — Despliegue automático desde main con GitHub Actions](248_plan_despliegue_automatico_github_actions.md)** · _Implementado (tarea 248)_  
  CI en cada push y PR, y despliegue automático de cada commit de `main` con el CI en verde: imágenes construidas en GitHub y publicadas en GHCR, y el EC2 solo las descarga, con copia de seguridad previa y vuelta atrás a las imágenes anteriores.

- **[247 — Ampliación del mapa de afinidades de 1.º de ESO y actividades conjuntas](247_plan_mapa_eso_1_fichas_y_actividades_conjuntas.md)** · _Implementado (tarea 247)_  
  Unas 20-25 fichas nuevas en 1.º de ESO (cada materia en al menos 6) y un campo nuevo de actividades conjuntas con al menos 3 por ficha en todo 1.º, redactadas con opencode y DeepSeek V4.1 Flash como en la tarea 245.

- **[246 — Visita guiada y menú de Ayuda para docentes](246_plan_visita_guiada_y_ayuda.md)** · _Implementado (tarea 246)_  
  Bienvenida con elección de idioma para todos los usuarios, botón «Ayuda» con cuatro visitas guiadas cortas (driver.js), preguntas frecuentes y un proyecto de ejemplo bilingüe de solo lectura sobre el que se hace la visita del taller.

- **[245 — Tres actividades por conexión en todos los mapas intermodulares de FP](245_plan_tres_actividades_por_conexion_mapas_fp.md)** · _Implementado (tarea 245)_  
  Dos actividades bilingües nuevas por relación en los 13 mapas que tienen una sola, Peluquería completada hasta tres y la regla de «al menos tres» en el generador, la skill y AGENTS.md.

- **[244 — Vista panorámica de conexiones y mapa mental de la ESO (beta)](244_plan_panoramica_y_mapa_mental_eso.md)** · _Implementado (tarea 244)_  
  Tercera vista del mapa de FP con todas las conexiones del curso agrupadas en un círculo de RA (*hierarchical edge bundling*) y salto al mapa mental; mapa mental beta del mapa de afinidades de la ESO (materias → afines → fichas).

- **[243 — Mapa mental intermodular (beta)](243_plan_mapa_mental_intermodular_beta.md)** · _Implementado (tarea 243)_  
  Vista alternativa del mapa intermodular de FP como mapa mental (d3 para el cálculo y Angular para el SVG), con nodos que se despliegan, zoom y panel lateral de la conexión; visible para todos con la etiqueta «beta» y conviviendo con la vista clásica.

- **[220 — Clonar proyectos y desplegable de ciclos](220_plan_clonar_proyectos_y_desplegable_de_ciclos.md)** · _Implementado (tarea 220)_  
  Botón «Copiar» en el historial y en el área personal que crea una copia propia titulada «Copia de …» (contenido, traducciones y archivos); las pestañas y pills de nivel pasan a ser un menú desplegable.

- **[218 — Solicitudes de centros y sus ciclos](218_plan_solicitudes_de_centros.md)** · _Implementado (tarea 218)_  
  Un docente pide su centro y sus ciclos desde la aplicación (con la oferta de FP de Baleares y qué ciclos ya están disponibles), el administrador gestiona las solicitudes y la skill `procesar-solicitudes` incorpora en Claude Code los ciclos que faltan.

- **[005 — Trabajo colaborativo en proyectos compartidos](005_plan_trabajo_colaborativo_en_proyectos.md)** · _Implementado (tarea 203)_  
  Solo autor y colaboradores pueden editar (el resto, solo lectura), notificación al colaborador invitado, turno de edición que bloquea la IA y los cambios a los demás mientras alguien modifica el proyecto, y registro con fecha, hora y autor de cada cambio.

- **[004 — Mapa de afinidades curriculares de la ESO (1.º-4.º)](004_plan_mapa_afinidades_curriculares_eso.md)** · _Implementado (tarea 202)_  
  Mapa de la ESO con el formato del documento del IES Cap de Llevant (fichas de afinidad sin actividades), revisado contra el Decreto 42/2025, ampliado y con 4.º de ESO y sus materias de opción.

- **[003 — Selección de criterios de evaluación en la ESO y el PDC](003_plan_seleccion_criterios_evaluacion_eso.md)** · _Implementado (tarea 200)_  
  Cada CE de la ESO y del PDC muestra sus criterios, con «seleccionar todos»; el proyecto se genera a partir de los criterios elegidos, en castellano y catalán.

- **[002 — Niveles educativos desde el catálogo](002_plan_niveles_desde_el_catalogo.md)** · _Implementado (tarea 198)_  
  Historial, filtros, cursos, orden de módulos, mapa intermodular, prompt y validaciones salen del catálogo de niveles; se eliminan los 600 KB de RA de respaldo del bundle del frontend.

- **[001 — ESO ordinaria (1.º-4.º) y catálogo de niveles educativos](001_plan_eso_ordinaria_y_catalogo_de_niveles.md)** · _Implementado (tarea 197)_  
  Nuevo nivel ESO con las CE y criterios por curso del Decreto 42/2025 (Baleares) y la edad del alumnado en el prompt; catálogo de niveles en el backend como base para incorporar todos los FP de Baleares y de España.

