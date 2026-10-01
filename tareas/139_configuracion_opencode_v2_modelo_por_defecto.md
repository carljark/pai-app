# 139. Configuración de OpenCode V2

## Propósito

Adaptar la configuración del workspace a los campos nativos de OpenCode V2 y establecer Gemma 4 31B IT Free como modelo predeterminado, conservando las instrucciones del agente de desarrollo.

## Arquitectura y flujo

OpenCode V2 toma el modelo predeterminado de `model` en la raíz del archivo. La configuración del agente principal se declara bajo `agents.build`; el campo `system` conserva el prompt que antes estaba situado en `agent.system_prompt`. Se mantiene `enabled_providers` para restringir la selección al proveedor OpenRouter, sintaxis V1 que V2 todavía soporta mediante su mecanismo de políticas.

## Archivos modificados

- `opencode.json`: migración del modelo predeterminado y del prompt al formato nativo V2.

## Decisiones y limitaciones

- Se retiró `models.default`, `models.fallback` y `models.allowed`: no son la forma nativa V2 documentada para fijar modelo predeterminado o filtrar modelos.
- OpenCode V2 no documenta un límite de gasto por sesión en la configuración. Por tanto, no se conserva `agent.max_session_cost: 0.50` como si fuera efectivo.
- La política `enabled_providers` puede restringir proveedores, pero no crea una allowlist estricta de seis modelos dentro de OpenRouter. La configuración del catálogo con `providers.openrouter.models` sirve para añadir o personalizar modelos, no para excluir automáticamente todos los demás. Por eso no se afirma que el selector quede limitado a esos seis modelos.
- `max_tokens_per_step` tampoco se conserva: no es el campo V2 para el límite de pasos y convertirlo a `steps` cambiaría su significado.
- Fuente consultada: documentación oficial OpenCode V2 de configuración, modelos, proveedores, agentes, políticas y migración desde V1 (`https://opencode.ai/v2/docs/`).
