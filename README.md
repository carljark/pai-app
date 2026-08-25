# Proyecto PAI (Plataforma de Aprendizaje Intermodular)

Este repositorio contiene la versión MVP (Fase I) de la Plataforma PAI, diseñada para generar proyectos curriculares intermodulares usando IA generativa en la Formación Profesional Básica.

## Stack Tecnológico

*   **Frontend**: Angular v22 (TypeScript).
*   **Backend**: Node.js v22, Express.js y Mongoose.
*   **Base de Datos**: MongoDB.
*   **Inteligencia Artificial**: Google Gemini (via `@google/genai` SDK).
*   **Orquestación**: Docker Compose.

## Requisitos Previos

*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) o [Rancher Desktop](https://rancherdesktop.io/) (configurado con motor `dockerd`).
*   Clave API de Google Gemini (obtenida desde [Google AI Studio](https://aistudio.google.com/)).

## Configuración y Arranque (Entorno de Desarrollo)

1.  **Configurar la API Key**:
    Crea un archivo llamado `.env` dentro de la carpeta `backend/` y añade tu clave secreta:
    ```env
    GEMINI_API_KEY=tu_clave_aqui
    ```

2.  **Levantar el entorno**:
    En la raíz del proyecto, ejecuta el siguiente comando:
    ```bash
    docker compose up -d --build
    ```
    Este comando levantará los tres servicios de forma aislada e interconectada:
    *   **Base de datos**: MongoDB en el puerto `27017` (con un volumen persistente llamado `mongo_data` para no perder la información).
    *   **Backend**: API de Node.js escuchando en `http://localhost:3000`. Usa recarga en caliente mediante `tsx watch`.
    *   **Frontend**: Aplicación Angular escuchando en `http://localhost:4200`. Usa recarga en caliente mediante `ng serve`.

3.  **Detener el entorno**:
    ```bash
    docker compose down
    ```

## Despliegue en Producción (AWS EC2)

La aplicación cuenta con una arquitectura optimizada para producción (usando Nginx como reverse proxy y compilación estática de Angular) definida en el archivo `docker-compose.prod.yml`.

### Pasos para desplegar o actualizar en producción:

1.  **Configurar Variables de Entorno Globales**:
    En el servidor (EC2), el archivo `.env` debe colocarse **en la raíz del proyecto** (no dentro de la carpeta `backend/`) para que Docker Compose pueda leerlo correctamente. Debe contener, como mínimo:
    ```env
    GEMINI_API_KEY=tu_clave_aqui
    ADMIN_EMAIL=admin@tucentro.edu
    ADMIN_PASSWORD=contraseña_segura
    JWT_SECRET=tu_secreto_jwt
    ```

2.  **Actualizar y levantar el servicio**:
    Para aplicar los últimos cambios de la rama correspondiente (ej. `develop` o `main`) y reconstruir los contenedores sin detener el servidor bruscamente, ejecuta:
    ```bash
    git pull origin develop  # O la rama que uses en producción
    docker compose -f docker-compose.prod.yml up -d --build
    ```

3.  **Comandos útiles de mantenimiento**:
    *   **Reiniciar rápido (sin reconstruir):** `docker compose -f docker-compose.prod.yml restart`
    *   **Ver logs del backend en vivo:** `docker compose -f docker-compose.prod.yml logs -f backend`
    *   **Detener la aplicación:** `docker compose -f docker-compose.prod.yml down`

## Motor Pedagógico e Inteligencia Artificial

La plataforma no solo junta textos de un formulario, sino que utiliza a Gemini como un "Motor Pedagógico" alineado con la **LOMLOE**.

El comportamiento de la IA cambia radicalmente dependiendo de la metodología seleccionada en la interfaz:
*   **ABP (Aprendizaje Basado en Proyectos):** La IA asume que el objetivo principal es planificar y desarrollar un **producto final tangible** (un objeto, una campaña, un dossier).
*   **ABR (Aprendizaje Basado en Retos):** La IA orienta la narrativa hacia un desafío del mundo real (frecuentemente ligado a los ODS), requiriendo una **solución accionable y comunitaria**.
*   **Aprendizaje Basado en Problemas:** La IA modifica el enfoque hacia la **investigación teórica-práctica**. Plantea un interrogante inicial donde los alumnos deben deducir qué necesitan investigar y cómo aplicar el conocimiento (los Resultados de Aprendizaje) para resolverlo.

### 💡 Personalización del Centro (La "Biblia Metodológica")
La arquitectura del backend incluye un archivo especial llamado `backend/knowledge_base.md`. 
Este archivo actúa como un marco de RAG (Retrieval-Augmented Generation) que se inyecta en cada petición a la IA. 

Si el claustro decide que sus metodologías o herramientas de evaluación deben seguir unas fases muy específicas (ej: *"En nuestro centro, el Aprendizaje Basado en Problemas siempre debe tener una fase llamada 'Divergencia'"*), basta con escribirlo en texto plano en ese archivo `knowledge_base.md`. La IA lo leerá e incorporará esas reglas automáticamente en todos los nuevos proyectos generados, **sin necesidad de reprogramar el código**.
