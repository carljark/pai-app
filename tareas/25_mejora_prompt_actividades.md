# Tarea 25: Mejora del prompt del sistema para pormenorizar actividades

## Propósito
El usuario ha solicitado mejorar el prompt interno de la Inteligencia Artificial encargado de la generación de proyectos. El objetivo principal es forzar a la IA a que "desarrolle pormenorizadamente cada una de las actividades que proponga", evitando así entregas escuetas o abstractas.

## Arquitectura/Flujo
1. **Identificación**: El *system instruction* utilizado para interactuar con Gemini (`generateGeminiContent`) se construye en el `project.controller.ts` dentro de la constante `baseInstruction`.
2. **Re-ingeniería del Prompt**: Se ha intervenido la regla estricta sobre el detalle de actividades. Ahora se exige a la IA que estructure de manera obligatoria cada actividad propuesta mediante una matriz que abarca:
   - Título descriptivo.
   - Duración.
   - Agrupamiento.
   - Objetivos vinculados.
   - Desarrollo exacto para el docente.
   - Desarrollo exacto para el alumnado.
   - Recursos materiales.
   - Entregable.
   - Evaluación formativa.
3. **Flujo de cola intacto**: El prompt enriquecido se sigue inyectando de forma asíncrona dentro del documento guardado en MongoDB y se procesa mediante el `queue.service.ts` como es habitual.

## Archivos Modificados
- `backend/src/controllers/project.controller.ts`: Actualización de la constante de texto `baseInstruction` con la nueva directriz restrictiva.

## Detalles Técnicos
- Se mantuvo el mandato de usar "Markdown profesional" y la prohibición explícita de usar "cajas ASCII", que generaban errores de renderizado anteriormente. 
- La nueva instrucción reduce la propensión de los modelos de lenguaje (LLMs) a resumir procesos didácticos que deberían ser inmediatamente aplicables (manuales instruccionales).
