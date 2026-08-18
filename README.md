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

## Despliegue en Producción (Próximos Pasos - Fase II)

Actualmente, el archivo `docker-compose.yml` está optimizado para **desarrollo ágil** (Hot Reloading). Para desplegar en un servidor de producción real (como un servidor físico en el instituto para la Fase II de IA Local), se creará una arquitectura distinta mediante un `docker-compose.prod.yml` que:
*   Compilará Angular estáticamente (`ng build`).
*   Servirá el frontend mediante un contenedor **Nginx** de alto rendimiento (Reverse Proxy).
*   Conectará el backend a modelos de lenguaje locales (LLM) alojados en el servidor en lugar de usar la API comercial de Gemini.
