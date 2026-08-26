# Diseño Técnico: Correcciones UI, Traducciones y Sistema de Migraciones

## Propósito
Este documento detalla las múltiples mejoras implementadas para estabilizar la interfaz de usuario, asegurar la coherencia de las traducciones en producción, mejorar la respuesta de la IA ante las enumeraciones curriculares y la creación de un sistema de migraciones robusto para la base de datos MongoDB. Todas estas acciones responden a incidencias detectadas tras el pase a producción (EC2) y feedback de usabilidad en el frontend.

## Arquitectura y Flujo

1. **Corrección de Traducciones en RAs (FP):**
   El sistema de idiomas del frontend solicitaba al backend los módulos. Sin embargo, por discrepancias en las claves (plurales/singulares y duplicados en la siembra original), el diccionario dinámico fallaba. Se ha reemplazado por un diccionario explícito en duro (Catalán -> Español) que coincide exactamente con los strings guardados en la BD de MongoDB.

2. **Nuevo Sistema de Migraciones:**
   Se ha implementado una arquitectura de migraciones basada en Node.js que se lanza automáticamente antes de iniciar el servidor web.
   - Orquestador (`migrate.ts`) lee secuencialmente la carpeta `migrations/`.
   - Si una migración no está en la colección `migrations` de MongoDB, se ejecuta y se registra.
   - El contenedor de Docker se ha modificado para ejecutar `npm run migrate` mediante un script `prestart`.

3. **Inclusión de Nuevo Módulo de FP:**
   Se ha inyectado el nuevo módulo "Proyecto inter modular de aprendizaje colaborativo" a través de la nueva arquitectura de migraciones (`001_seed_new_module.ts`), asegurando que todos los entornos (desarrollo y EC2) reciban la actualización al desplegar.

4. **Mejora del Prompt Generativo (Gemini):**
   Se ha modificado el sistema de instrucciones de la IA para exigir la recuperación y preservación explícita de la numeración y nomenclatura oficial del currículo para cada Resultado de Aprendizaje (RA) y Criterio de Evaluación (CE) (ej: "RA 1", "CE 3", "a)", "b)").

5. **Mejoras de Usabilidad en Angular:**
   - **Ordenación del Carrito de Selección:** El listado flotante de RAs seleccionados ahora se agrupa por módulo (ordenado alfabéticamente) y, dentro de cada módulo, los RAs se ordenan numéricamente.
   - **Bandera UI:** Se ha inyectado la bandera de España en formato SVG en el selector de idioma para equilibrar el diseño con la Senyera, respetando la regla global de "No usar emojis".
   - **Modal de Error Independiente:** Se ha eliminado la alerta genérica y extraído la lógica a un Componente Standalone de Angular (`app-error-modal`), utilizando la nueva API de Signals (`input()` y `output()`) para atrapar y mostrar de forma limpia los errores reales de HTTP provenientes del servidor.

## Archivos Modificados / Creados

**Backend:**
- `backend/src/controllers/curriculum.controller.ts` (Modificación de diccionario)
- `backend/src/controllers/project.controller.ts` (Actualización del System Prompt)
- `backend/src/models/Migration.ts` (NUEVO: Modelo de Mongoose)
- `backend/scripts/migrate.ts` (NUEVO: Orquestador de migraciones)
- `backend/migrations/001_seed_new_module.ts` (NUEVO: Primera migración)
- `backend/package.json` (Scripts `prestart`, `predev`, `migrate`)
- `backend/Dockerfile` (Cambio de `CMD` a `npm start`)
- `docker-compose.yml` (Forzar `npm run dev` y creación de `start.sh`)

**Frontend:**
- `frontend/src/app/app.ts` (Señales de error, ordenación de `groupedSelectedItems`)
- `frontend/src/app/app.html` (Inserción de Modal, SVG de España)
- `frontend/src/app/components/error-modal.component.ts` (NUEVO: Componente Standalone con Signals)

## Detalles Técnicos
- La migración de decoradores `@Input()` / `@Output()` hacia las funciones `input()` y `output()` en el componente modal permite beneficiarse del sistema Zoneless de Angular 18+, mejorando el rendimiento de detección de cambios de la UI.
- En la implementación de las migraciones, se ha tenido que ajustar el contexto de ejecución a `process.cwd()` dado que `__dirname` es inaccesible bajo el estándar de Módulos ES (ESM) que utiliza el backend.
