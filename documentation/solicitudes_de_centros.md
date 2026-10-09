# Solicitudes de centros

Un docente pide desde la aplicación su centro y los ciclos que imparte. La aplicación le dice al momento cuáles ya están en Plappin, el administrador gestiona las solicitudes y los ciclos que faltan se incorporan desde Claude Code con la skill `procesar-solicitudes`. Plan: `planes/218_plan_solicitudes_de_centros.md`; tarea 218.

Los ciclos son globales: un ciclo que se incorpora por la solicitud de un centro queda disponible para todos. El centro se guarda como texto en la solicitud; no es una entidad asignada a los usuarios.

## Flujo

1. El docente abre **Solicitar centro** (vista `solicitudes`, entrada en la barra lateral). Rellena el centro (nombre obligatorio, municipio y web opcionales) y elige ciclos de la oferta. Puede buscar por nombre, familia o código y filtrar por grado. Los ciclos que no aparecen se escriben en «Otros ciclos», uno por línea.
2. Al enviarla se guarda una solicitud `pendiente`. Cada ciclo queda como `disponible`, si el catálogo ya lo incorpora, o como `pendiente`.
3. El administrador la ve en el panel de administración («Solicitudes de centros»). Ahí cambia el estado de la solicitud y de cada ciclo, anota el número de tarea y escribe notas. Cada cambio se guarda al momento.
4. En Claude Code, `procesar-solicitudes` lee las solicitudes abiertas de producción con `scripts/solicitudes-pendientes.sh` (solo lectura) e incorpora los ciclos que elija el usuario con `agregar-ciclo-educativo`.
5. Cuando cambia el estado de la solicitud (`en_curso`, `completada` o `descartada`), el docente recibe una notificación `INFO` en el idioma en que la envió.

## Oferta de ciclos

`backend/src/data/oferta-fp-ib.json` contiene 117 ciclos (19 de grado básico, 38 de grado medio y 60 de grado superior) con estos campos: `codigo`, `etapa`, `familia_es`, `familia_ca`, `nombre_es` y `nombre_ca`. `backend/src/data/oferta-fp-ib.ts` la carga y la cruza con el catálogo.

- **Catalán y códigos:** páginas de familias profesionales de FP Illes Balears (<https://www.caib.es/sites/fp/ca/per_familia_professional/>). Cada familia enlaza sus ciclos como `contenido.do?idsite=12786&cont=N`, y el texto del enlace es «`<código>` Tècnic … en `<nombre>`». El segundo carácter numérico del código da el grado: 1 = básico, 2 = medio, 3 = superior. No se incluyen los cursos de especialización (código 4x). La CAIB devuelve «Error de Pàgina» a menudo: hay que reintentar.
- **Castellano:** tablas de ciclos por familia de TodoFP (<https://www.todofp.es/que-estudiar/familias-profesionales.html>). El emparejamiento se hace por grado y por parecido del nombre, y después se revisa a mano. Hubo que corregir dos casos:
  - IMA12 «Manteniment d'habitatges» es «Mantenimiento de Viviendas»;
  - la familia del FME11, que TodoFP lista también en Instalación y Mantenimiento.
- **Nombres catalanes:** se mantiene el texto de la CAIB y solo se normaliza el uso de mayúsculas de algunos ciclos. También se corrige «Guía» → «Guia» (AFD21) y «Ensenyament i Animació Socioesportiva» → «Ensenyament i animació socioesportiva» (AFD31), como en el catálogo.
- No hay versión castellana de la web de la CAIB.

`codigoCaib` en `backend/src/data/niveles.ts` enlaza cada ciclo de FP del catálogo con su código de la oferta:

| `tipoNivel` | `codigoCaib` |
|---|---|
| `FP_BASICA` | IMP11 |
| `CFGM_ESTETICA` | IMP21 |
| `CFGM_PELUQUERIA` | IMP22 |
| `CFGM_ATENCION_DEPENDENCIA` | SSC21 |
| `CFGM_GUIA_MEDIO_NATURAL` | AFD21 |
| `CFGM_CUIDADOS_AUXILIARES_ENFERMERIA` | SAN23 |
| `CFGS_EDUCACION_INFANTIL` | SSC31 |
| `CFGS_ACONDICIONAMIENTO_FISICO` | AFD32 |
| `CFGS_ANIMACION_SOCIODEPORTIVA` | AFD31 |
| `CFGS_INTEGRACION_SOCIAL` | SSC33 |

Todo ciclo de FP nuevo debe llevar su `codigoCaib`; lo comprueba `backend/src/tests/solicitudes.test.ts`.

## Modelo (`backend/src/models/Solicitud.ts`, colección `solicitudes`)

- Docente: `userId`, `userName`, `userEmail` y `idioma` (`es` o `ca`, el de la interfaz al enviarla).
- `centro { nombre, municipio, web }` y `comentario`.
- `ciclos[]`: cada uno con `_id`, `codigo` (de la oferta) **o** `nombre` (escrito a mano), `estado` (`disponible`, `pendiente`, `incorporado` o `descartado`) y `tarea`.
- `status`: `pendiente`, `en_curso`, `completada` o `descartada`. Además, `adminNotes` y las fechas.

Las respuestas añaden a cada ciclo sus nombres y su grado de la oferta y el `tipoNivel` que ya lo incorpora. Un ciclo guardado como `pendiente` se devuelve como `disponible` en cuanto el catálogo lo incorpora.

## API

| Ruta | Quién | Qué hace |
|---|---|---|
| `GET /api/solicitudes/oferta` | docentes aprobados | Oferta con `disponible: tipoNivel \| null` |
| `POST /api/solicitudes` | docentes aprobados | Crea una solicitud. 400 sin nombre de centro o sin ciclos; 409 con 5 solicitudes abiertas |
| `GET /api/solicitudes/mias` | docentes aprobados | Solicitudes propias |
| `GET /api/admin/solicitudes` | administradores | Todas las solicitudes |
| `PATCH /api/admin/solicitudes/:id` | administradores | `status`, `adminNotes` y `ciclos: [{ _id, estado?, tarea? }]`; avisa al docente si cambia `status` |

Las longitudes están acotadas (centro, 120 caracteres; comentario, 1000; hasta 30 ciclos de la oferta y 10 escritos a mano), y los ciclos repetidos o los códigos que no existen se descartan.

## Lectura desde Claude Code

`scripts/solicitudes-pendientes.sh` ejecuta por SSH `backend/scripts/solicitudes-pendientes.ts` dentro del contenedor `pai_backend_prod`. El script usa `resumenPendientes()` del servicio y no escribe nada. Los cambios de estado los hace el administrador desde la aplicación.

## Frontend

- `features/solicitudes/`:
  - `SolicitudesService`, con signals;
  - `solicitudes-view`, la pantalla;
  - `solicitud-form`, el formulario;
  - `oferta-selector`, con buscador, filtro por grado y la marca «Disponible»;
  - `mis-solicitudes`.
  - Los textos están en `translations.es.ts` y `translations.ca.ts` (claves `sol*`).
- `features/admin/components/admin-solicitudes/`: la gestión del administrador. Va en castellano, como el resto del panel de administración.
