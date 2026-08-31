# Tarea 45: Reemplazo del icono del Home por el logotipo de Plappin

## Propósito
El usuario solicitó que el icono SVG por defecto (el librito) situado en la sección superior (Hero) de la página de inicio (Home) fuera reemplazado por la nueva imagen del logo de Plappin con fondo transparente generada anteriormente.

## Arquitectura/Flujo
1. **Gestión de Assets:**
   - La imagen transparente previamente generada (`LOGO_transparent.png`) ha sido copiada dentro de la carpeta pública de Angular (`frontend/public/logo-transparent.png`). Esto permite que Angular sirva la imagen directamente de forma estática en producción.

2. **Modificación del Componente (HomeDashboardComponent):**
   - **HTML:** Se ha eliminado el div `.home-hero__icon` junto a su contenido SVG y se ha sustituido por un elemento `<img src="logo-transparent.png" alt="Plappin Logo" class="home-hero__logo">`.
   - **Estilos (CSS):** Se reemplazó la clase css asociada al icono antiguo, definiendo nuevas propiedades para el logo:
     - `height: 96px` (altura equilibrada para mantener legibilidad sin robar demasiado espacio vertical).
     - `width: auto` para mantener la proporción.
     - `object-fit: contain` como seguro de recorte.

## Archivos Modificados
- `frontend/public/logo-transparent.png` (Archivo nuevo añadido a estáticos).
- `frontend/src/app/features/home/components/home-dashboard/home-dashboard.component.ts`: Modificados los metadatos `template` y `styles` integrados para renderizar la nueva imagen.

## Detalles Técnicos
Al estar orquestado mediante Docker, se requiere de un `docker compose ... --build` en el servidor de producción (EC2) para que el nuevo asset de imagen sea copiado al volumen estático final que sirve la aplicación.
