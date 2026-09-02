# Documento de Diseño Técnico: Arquitectura de Software, Patrones de Diseño y Gestión de Estilos

**Número de Tarea:** 64  
**Fecha:** 2026-09-02  
**Estado:** Documentado y Verificado  
**Autor:** Antigravity (Senior Full-Stack AI Engineer)

---

## 1. Propósito

El propósito de este documento es detallar y formalizar las decisiones de arquitectura de software, organización del código y estrategia de estilos empleadas en **PAI App (Plappin)**. 

Se analiza:
1. La estrategia y justificación del sistema modular de estilos (Sass 7-1 vs Encapsulación por Componentes).
2. El patrón de arquitectura en el Frontend (**Vertical Slices / Feature-Sliced Design** combinado con **Fachadas Reactivas mediante Signals**).
3. El patrón de arquitectura en el Backend (**Clean Architecture / Arquitectura Hexagonal - Puertos y Adaptadores**).

---

## 2. Estrategia de Estilos y Maquetación

### 2.1. Arquitectura Modular Sass (Atomic Shell Architecture)

El proyecto utiliza una variante de la convención **Sass 7-1 Pattern** en `frontend/src/styles/` para gestionar la estructura global y los *Design Tokens* de la aplicación:

```
frontend/src/styles/
├── _variables.scss    # Tokens de diseño (paleta de colores, tipografías, elevaciones, espaciados)
├── _mixins.scss       # Mixins reutilizables y utilidades responsive (@include mq(md))
├── _base.scss         # Resets CSS, box-sizing, tipografías base del documento
├── _layout.scss       # Andamiaje y estructura del cascarón global (Shell de la aplicación)
└── _components.scss   # Componentes y utilidades transversales (tooltips, modales globales, botones base)
```

### 2.2. Justificación: ¿Por qué estilos en `_layout.scss` vs estilos por componente?

El criterio de separación responde al principio de **Responsabilidad Única y Contexto de Apilamiento (Stacking Context)**:

1. **Estilos del Armazón Global (`_layout.scss`):**
   - Controlan el contenedor raíz `.app-layout`, la cuadrícula general, el comportamiento de la ventana y el `.app-sidebar`.
   - El sidebar **no es un elemento aislado**: determina el ancho disponible de toda la pantalla, la posición `sticky`, el cálculo de viewport (`100vh`) y la propagación de eventos de scroll entre la barra lateral y el cuerpo principal (`.app-main`).
   - Ubicar la maquetación del Shell en `_layout.scss` previene inconsistencias de scroll horizontal o desbordamiento en distintas resoluciones.

2. **Estilos Encapsulados (Scoped per Component):**
   - Todo elemento que pertenezca a la lógica interna de una funcionalidad se aísla dentro del componente mediante la propiedad `styles: [...]` de Angular o su respectivo `.scss` local (ej. `mapa-intermodular-view.component.ts`, `taller-view.component.html`, `auth-form.component.ts`).
   - Esto evita colisiones de nombres y asegura que los estilos internos viajen junto a su componente.

---

## 3. Arquitectura del Frontend: *Vertical Slices + Facade Pattern*

El frontend prescinde de la clásica organización horizontal por capas técnicas monolíticas (`controllers/`, `services/`, `views/`) y adopta una arquitectura de **Vertical Slices (Feature-Sliced Design)**.

```
frontend/src/app/
├── features/                      # Dominios de negocio aislados (Vertical Slices)
│   ├── auth/                      # Autenticación, JWT, roles y perfiles
│   ├── curriculum/                # Selección de RAs, CEs y niveles educativos
│   ├── generator/                 # Asistente y formulario de generación de proyectos
│   ├── history/                   # Histórico, búsqueda y filtrado de proyectos
│   ├── home/                      # Dashboard principal y accesos rápidos
│   ├── mapa-intermodular/         # Visualizador interactivo de coincidencias curriculares FPB
│   ├── notifications/             # Sistema de notificaciones en tiempo real
│   ├── projects/                  # Persistencia y gestión de proyectos
│   ├── taller/                    # Entorno de trabajo, editor y asistente IA conversacional
│   └── admin/                     # Dashboard de administración y gestión de usuarios
│
├── layout/                        # Componentes estructurales del shell (Sidebar, Header)
├── services/                      # Servicios de infraestructura cliente (PaiService, LayoutService, TranslationService)
└── models/                        # Tipos globales transversales
```

### 3.1. Anatomía Interna de cada Vertical Slice

Cada feature contiene las 4 capas de Clean Architecture adaptadas a cliente:

```
feature-name/
├── models/       # Interfaces y tipos puros de dominio (Inmutables)
├── mappers/      # Mappers puros: Transforman DTOs de red a entidades de dominio de cliente
├── services/     # Fachadas (@Injectable): Gestionan el estado reactivo con Signals
└── components/   # Componentes Standalone: Presentación pura y enlace con la Fachada
```

### 3.2. Gestión de Estado con Angular 18 Signals (Sin Lifecycle Hooks)

- Se eliminó el uso de `ngOnInit` y suscripciones imperativas (`subscribe`) a favor de **Angular 18 Signals** primitivas:
  - `signal<T>()`: Estado mutable reactivo.
  - `computed<T>()`: Valores derivados calculados bajo demanda con memoización automática.
  - `effect()`: Sincronización de efectos secundarios controlados (ej. persistencia local).
- **Patrón Fachada (`*Facade`):** Los componentes no consumen servicios HTTP directamente. Toda interacción pasa por su fachada (ej. `MapaIntermodularFacade`, `ProjectsFacade`, `TallerFacade`), desacoplando la vista de la infraestructura de red.

---

## 4. Arquitectura del Backend: *Clean Architecture / Hexagonal (Puertos y Adaptadores)*

El backend en Node.js / Express y TypeScript sigue los principios de Clean Architecture:

```
backend/src/
├── routes/          # Adaptadores Primarios (Controladores HTTP Express REST)
├── services/        # Núcleo de Casos de Uso y Dominio (Lógica de negocio pura)
├── models/          # Adaptadores Secundarios (Esquemas Mongoose / Entidades MongoDB)
├── middlewares/     # Componentes Transversales (Auth JWT, Rate Limiter, Audit Logger)
└── config/          # Infraestructura y configuración de entorno
```

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 FRONTEND (Angular 18)                                  │
│                 Patrón: Vertical Slices (FSD) + Fachadas Reactivas                     │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
        ┌───────────────────────────────────┼───────────────────────────────────┐
        ▼                                   ▼                                   ▼
 ┌──────────────┐                   ┌──────────────┐                    ┌──────────────┐
 │   Vistas /   │  Consume Signals  │  Fachadas    │   Transforma DTOs  │   Mappers    │
 │ Componentes  │ ◄───────────────  │ (*.facade)   │ ◄────────────────  │ (*.mapper)   │
 └──────────────┘                   └───────┬──────┘                    └──────────────┘
                                            │
                                            ▼ Peticiones HTTP
                                    ┌──────────────┐
                                    │  PaiService  │ (Cliente HTTP / Interceptores)
                                    └───────┬──────┘
                                            │
════════════════════════════════════════════╪═════════════════════════════════════════════
                              API REST / JSON (HTTP)
════════════════════════════════════════════╪═════════════════════════════════════════════
                                            │
┌───────────────────────────────────────────┴────────────────────────────────────────────┐
│                                 BACKEND (Node / Express)                               │
│              Patrón: Clean Architecture / Hexagonal (Puertos y Adaptadores)            │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
                                ┌──────────────────────┐
                                │ Controladores/Rutas  │ (Primary Adapters: Express)
                                └───────────┬──────────┘
                                            │
                                            ▼
                                ┌──────────────────────┐
                                │ Servicios de Dominio │ (Core Use Cases / Lógica Pura)
                                │  · ai.service        │
                                │  · fpb.service       │
                                │  · export.service    │
                                └─────┬──────────┬─────┘
                                      │          │
                 ┌────────────────────┘          └────────────────────┐
                 ▼                                                    ▼
      ┌──────────────────────┐                             ┌──────────────────────┐
      │  Modelos / Mongoose  │ (Secondary Adapter)         │   Google Gemini SDK  │ (External Infra)
      │  Base de Datos Mongo │                             │   Modelos de IA      │
      └──────────────────────┘                             └──────────────────────┘
```

### 4.1. Separación de Responsabilidades

1. **Adaptadores de Entrada (Primary Adapters - `routes/`):** Validan parámetros de entrada, gestionan códigos de estado HTTP y delegan la ejecución al servicio correspondiente.
2. **Casos de Uso / Dominio (`services/`):**
   - `ai.service.ts`: Orquestación de prompts, llamadas al modelo de IA y reescritura de proyectos.
   - `fpb.service.ts`: Consultas y filtrado de coincidencias curriculares.
   - `export.service.ts`: Generación de documentos `.docx` y `.scorm`.
   - `auditLogger.ts`: Registro inmutable de actividad de usuarios.
3. **Adaptadores de Salida (Secondary Adapters - `models/`):** Entidades y esquemas de persistencia en MongoDB (`User`, `Project`, `RA`, `CE`, `FpbMatch`, `Settings`, `ActivityLog`, `Migration`).

---

## 5. Tabla Resumen de Capas y Patrones

| Capa | Ubicación | Patrón de Diseño | Responsabilidad |
|---|---|---|---|
| **Shell UI (Global)** | `frontend/src/styles/` | *Sass 7-1 (Atomic Shell)* | Estructura de ventana (`100vh`), layout de la app y tokens de diseño. |
| **Vistas (Features)** | `frontend/src/app/features/` | *Vertical Slices (FSD)* | Módulos aislados por dominio de negocio (*taller, mapa, auth, generator...*). |
| **Estado Cliente** | `*.facade.ts` | *Facade + Angular Signals* | Estado reactivo local sin ciclos de vida obsoletos (`ngOnInit`). |
| **API REST** | `backend/src/routes/` | *Primary Adapters* | Validación de entradas, endpoints HTTP y códigos de estado. |
| **Casos de Uso** | `backend/src/services/` | *Domain / Use Cases* | Lógica de generación IA, filtrado curricular y exportación a Word/SCORM. |
| **Persistencia** | `backend/src/models/` | *Secondary Adapters* | Esquemas Mongoose y colecciones de MongoDB (`users`, `projects`, etc.). |

---

## 6. Beneficios de esta Arquitectura

| Aspecto | Implementación | Beneficio |
|---|---|---|
| **Mantenibilidad** | Vertical Slices en frontend | Modificar una funcionalidad (ej. *Mapa Intermodular*) no impacta ni requiere tocar otras partes del sistema. |
| **Rendimiento** | Angular Signals | Detección de cambios granular (Fine-grained reactivity) sin sobrecargar la zona de Angular (Zoneless-ready). |
| **Testabilidad** | Inyección de Dependencias + Fachadas | Cobertura de tests unitarios superior al **95%** en Statements, Branches, Functions y Lines. |
| **Escalabilidad** | Clean Architecture en Backend | Capacidad de sustituir proveedores externos (ej. cambiar Gemini por otro LLM o añadir microservicios) sin alterar los modelos de dominio. |

---

## 6. Archivos Implicados

- [`frontend/src/styles/_layout.scss`](file:///Users/csgj/dev/pai-app/frontend/src/styles/_layout.scss): Andamiaje del armazón, scroll lateral y responsividad.
- [`frontend/src/styles/_variables.scss`](file:///Users/csgj/dev/pai-app/frontend/src/styles/_variables.scss): Design tokens globales.
- [`frontend/src/app/layout/components/sidebar/sidebar.component.ts`](file:///Users/csgj/dev/pai-app/frontend/src/app/layout/components/sidebar/sidebar.component.ts): Componente de barra lateral con navegación y enlaces reactivos.
- [`frontend/src/app/features/`](file:///Users/csgj/dev/pai-app/frontend/src/app/features): Estructura de Vertical Slices (`auth`, `curriculum`, `generator`, `history`, `home`, `mapa-intermodular`, `notifications`, `projects`, `taller`, `admin`).
- [`backend/src/services/`](file:///Users/csgj/dev/pai-app/backend/src/services): Lógica de casos de uso desacoplada del protocolo de transporte.
