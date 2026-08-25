# Diseño Técnico: Upgrade a Gemini 3.6 Pro

## 1. Propósito de la Tarea
- **Aumento de la Capacidad de Razonamiento:** A petición del usuario, se ha sustituido el modelo base `gemini-3.6-flash` por el modelo de mayor razonamiento `gemini-3.6-pro`.
- Se asume conscientemente que el tiempo de ejecución (tanto en la extracción en diferido como en la generación síncrona desde la web) será considerablemente mayor, a cambio de una capacidad deductiva y creativa muy superior.

## 2. Cambios Implementados
- **Script de Extracción (`super_ingest.ts`):** Se ha cancelado la tarea en segundo plano que estaba corriendo con el modelo *flash*. Se ha modificado el script para que ahora invoque a `gemini-3.6-pro` y se ha relanzado el proceso desde cero.
- **Motor Generativo (Backend `server.ts`):** Se han actualizado todas las llamadas del endpoint `POST /api/projects/generate` para que utilicen explícitamente `gemini-3.6-pro`. De este modo, no solo la extracción de conocimiento, sino la **creación final del proyecto**, se beneficiarán del máximo poder de razonamiento disponible.

## 3. Archivos Modificados
- `backend/scripts/super_ingest.ts`
- `backend/src/server.ts`
