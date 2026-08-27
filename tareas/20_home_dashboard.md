# 20. Página de Inicio (Home Dashboard)

## Propósito
Se ha creado una página de inicio que se muestra al usuario nada más hacer login o al refrescar el navegador. El objetivo es proporcionar un punto de entrada profesional y orientado al usuario, en lugar de aterrizar directamente en el formulario del generador sin contexto previo.

## Arquitectura / Flujo

```
Login exitoso
    └─► currentView() = 'home'  (valor por defecto del signal en app.ts)
            └─► <app-home-dashboard> se renderiza en app.html
                    ├─► (navigate) output → switchView(view)
                    └─► (openProject) output → viewPastProject(project)
```

El componente es completamente aislado dentro de la carpeta features/home/, siguiendo la arquitectura Feature-Sliced Design del proyecto. No contiene lógica propia en app.ts: solo se añadió el valor 'home' al tipo del signal currentView y el bloque @if en el template.

## Estructura de Carpetas Creada

```
frontend/src/app/features/home/
└── components/
    └── home-dashboard/
        └── home-dashboard.component.ts
```

## Archivos Modificados

| Archivo | Cambio |
|---|---|
| features/home/components/home-dashboard/home-dashboard.component.ts | **Creado** — componente completo |
| app.ts | Importación del componente, tipo de currentView ampliado a 'home', valor por defecto cambiado a 'home', switchView() actualizado |
| app.html | Bloque @if (currentView() === 'home') añadido, botón "Inicio" en el sidebar |

## Contenido del Home Dashboard

1. **Hero Section** — Icono, título "Plataforma de Proyectos Interdisciplinares", saludo personalizado con el nombre del usuario autenticado, descripción del propósito, pills de características (IA Generativa, Exporta a Word, Bilingüe, FP/ESO).
2. **CTAs** — Dos botones grandes: "Nuevo Proyecto" (primario, violeta) y "Ver Historial" (secundario, borde). Emiten el output navigate que app.ts captura para llamar a switchView().
3. **Actividad Reciente** — Carga los últimos 5 proyectos del historial (ordenados por fecha descendente). Cada proyecto se muestra como una tarjeta interactiva con: estado (con badge de color), módulos, nivel educativo y fecha. Al hacer clic se emite el output openProject que abre el proyecto en el Taller Editor. Si no hay proyectos, muestra un estado vacío con ilustración y CTA.

## Detalles Técnicos

- **Framework**: Angular 18 Signals (computed, effect, output, inject)
- **Patrones**: Standalone component, sin ngOnInit (se usa effect() en el constructor para cargar el historial al montar la vista)
- **Comunicación con el padre**: Via output<AppView>() y output<any>() sin acoplamiento directo a app.ts
- **Estilos**: Inline scoped styles dentro del propio componente para máximo aislamiento; incluye diseño responsive con grid auto-fill para las tarjetas y media queries para móvil
- **Inyección de dependencias**: ProjectsFacade (historial + estado) y AuthFacade (nombre del usuario)
