Para poner en marcha la **versión más sencilla posible (MVP)** de la arquitectura **PAI** (Frontend Angular + Backend Node/Express + Base de datos) utilizando ****antigravity-cli****, podemos estructurar un monorepo o un conjunto de paquetes mínimos desacoplados.  
  
****antigravity-cli**** es la herramienta de ejecución de tareas y prototipado rápido de tu entorno de desarrollo. A continuación tienes la guía paso a paso para inicializar y conectar la pila completa de forma rápida.  
****antigravity-cli**** es la herramienta de ejecución de tareas y prototipado rápido de tu entorno de desarrollo. A continuación tienes la guía paso a paso para inicializar y conectar la pila completa de forma rápida.  
  
## 1. Estructura de la Aplicación Mínima (MVP)  
La versión mínima de la PAI necesita únicamente:  
  
1. **Base de Datos (MongoDB / Docker):** Para almacenar de forma flexible los proyectos generados y los RAs.   
2. **Backend (Node + Express + TypeScript):** Una API REST con 2 endpoints esenciales (GET /api/ras para obtener RAs y POST /api/projects/generate para invocar a la IA).   
3. **Frontend (Angular):** Una pantalla de formulario simple para seleccionar 2 módulos de FP y los RAs a combinar.   
## 2. Inicialización Paso a Paso con antigravity-cli  
**1.Crear la estructura del proyecto:**Monorepo ligero o carpetas separadas.  
Crea la carpeta raíz del proyecto e inicializa los entornos para el backend y el frontend:  
  
Bash  
##   
##   
##   
##   
mkdir pai-app && cd pai-app  
**2.Desplegar la Base de Datos:**MongoDB vía Docker con antigravity-cli.  
Levanta una instancia local ligera de MongoDB para desarrollo rápido:  
  
Bash  
Bash  
##   
##   
##   
##   
# Si antigravity-cli gestiona contenedores locales / nerdctl  
antigravity run service mongodb --port 27017:27017 -d mongo:latest  
**3.Generar el Backend (Node + Express):**TypeScript y estructura básica.  
Inicializa el módulo del backend en la carpeta backend:  
Inicializa el módulo del backend en la carpeta backend:  
  
Bash  
##   
##   
##   
##   
mkdir backend && cd backend  
npm init -y  
npm install express mongoose cors dotenv  
npm install -D typescript @types/node @types/express ts-node-dev  
npx tsc --init  
cd ..  
**4.Generar el Frontend (Angular):**Interfaz guiada del docente.  
Crea la aplicación frontend con Angular CLI utilizando la integración de antigravity-cli:  
Crea la aplicación frontend con Angular CLI utilizando la integración de antigravity-cli:  
  
Bash  
Bash  
##   
##   
##   
##   
# Usando Angular CLI directamente o a través del runner de antigravity-cli  
antigravity exec ng new frontend --routing --style=css --standalone  
## 3. Código Mínimo Funcional (Puntos de Entrada)  
**A. Backend Mínimo (backend/src/server.ts)**  
Servidor Node/Express en TypeScript que expone la API REST mínima:  
  
TypeScript  
TypeScript  
##   
##   
##   
##   
##   
##   
import express from 'express';  
import cors from 'cors';  
import cors from 'cors';  
import mongoose from 'mongoose';  
  
const app = express();  
const app = express();  
app.use(cors());  
app.use(express.json());  
  
// Conexión a Base de Datos local  
// Conexión a Base de Datos local  
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pai_db')  
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pai_db')  
  .then(() => console.log('MongoDB Conectado'))  
  .then(() => console.log('MongoDB Conectado'))  
  .catch(err => console.error(err));  
  .catch(err => console.error(err));  
  
// Modelo de Proyecto Mínimo  
const ProjectSchema = new mongoose.Schema({  
  title: String,  
  modules: [String],  
  modules: [String],  
  ras: [String],  
  ras: [String],  
  generatedContent: Object,  
  createdAt: { type: Date, default: Date.now }  
  createdAt: { type: Date, default: Date.now }  
});  
const Project = mongoose.model('Project', ProjectSchema);  
  
// Endpoint 1: Obtener RAs (Simulados para el MVP)  
app.get('/api/ras', (req, res) => {  
app.get('/api/ras', (req, res) => {  
  res.json([  
    { id: 'RA1', module: 'Atención al Cliente', description: 'Aplica técnicas de comunicación verbal.' },  
    { id: 'RA1', module: 'Atención al Cliente', description: 'Aplica técnicas de comunicación verbal.' },  
    { id: 'RA2', module: 'Maquillaje', description: 'Elabora bocetos y diseños según especificaciones.' }  
    { id: 'RA2', module: 'Maquillaje', description: 'Elabora bocetos y diseños según especificaciones.' }  
  ]);  
});  
  
// Endpoint 2: Generar y Guardar Proyecto  
app.post('/api/projects/generate', async (req, res) => {  
app.post('/api/projects/generate', async (req, res) => {  
  const { selectedRas, methodology } = req.body;  
  const { selectedRas, methodology } = req.body;  
    
  // En la versión MVP, simulamos o enviamos la petición rápida a Gemini / LLM  
  const mockGeneratedProject = {  
  const mockGeneratedProject = {  
    title: "Proyecto Integrado: Stand Interactivo de Belleza",  
    title: "Proyecto Integrado: Stand Interactivo de Belleza",  
    challenge: "Diseñar un servicio de maquillaje aplicando protocolos de comunicación real.",  
    challenge: "Diseñar un servicio de maquillaje aplicando protocolos de comunicación real.",  
    tasks: ["Bocetar propuesta", "Simulación de venta y atención"],  
    rubric: "Evaluación conjunta de RAs seleccionados."  
  };  
  
  const newProject = await Project.create({  
    modules: ['Atención al Cliente', 'Maquillaje'],  
    modules: ['Atención al Cliente', 'Maquillaje'],  
    ras: selectedRas,  
    ras: selectedRas,  
    generatedContent: mockGeneratedProject  
  });  
  
  res.status(201).json(newProject);  
});  
  
const PORT = process.env.PORT || 3000;  
const PORT = process.env.PORT || 3000;  
app.listen(PORT, () => console.log(`Backend PAI escuchando en puerto ${PORT}`));  
**B. Servicio Frontend de Angular (frontend/src/app/services/pai.service.ts)**  
TypeScript  
##   
##   
##   
##   
##   
##   
import { Injectable, inject } from '@angular/core';  
import { HttpClient } from '@angular/common/http';  
import { Observable } from 'rxjs';  
import { Observable } from 'rxjs';  
  
@Injectable({ providedIn: 'root' })  
@Injectable({ providedIn: 'root' })  
export class PaiService {  
  private http = inject(HttpClient);  
  private http = inject(HttpClient);  
  private apiUrl = 'http://localhost:3000/api';  
  
  getRas(): Observable<any[]> {  
  getRas(): Observable<any[]> {  
    return this.http.get<any[]>(`${this.apiUrl}/ras`);  
    return this.http.get<any[]>(`${this.apiUrl}/ras`);  
  }  
  
  generateProject(selectedRas: string[], methodology: string): Observable<any> {  
  generateProject(selectedRas: string[], methodology: string): Observable<any> {  
    return this.http.post<any>(`${this.apiUrl}/projects/generate`, { selectedRas, methodology });  
  }  
}  
## 4. Ejecución en Paralelo desde antigravity-cli  
Para poner en marcha todo el entorno de desarrollo (Backend, Frontend y DB) con un solo comando o tarea, puedes configurar la plantilla de scripts en el pipeline de ****antigravity-cli**** o mediante un archivo de orquestación local:  
  
Bash  
##   
##   
##   
##   
# Lanzar el entorno de desarrollo completo  
antigravity dev --parallel \  
  --cmd "cd backend && npm run dev" \  
  --cmd "cd backend && npm run dev" \  
  --cmd "cd frontend && npm start"  
  --cmd "cd frontend && npm start"  
## Siguientes Pasos Recomendados  
Para evolucionar rápidamente esta versión mínima funcional a la arquitectura completa descrita en la PAI:  
  
1. **Conectar la API de IA real:** Sustituir la respuesta simulada (mockGeneratedProject) por la llamada real al modelo de lenguaje inyectando el prompt oculto.   
2. **Cargar los RAs reales:** Importar un archivo JSON/CSV a MongoDB con el catálogo oficial de módulos y RAs del BOE.  
  
