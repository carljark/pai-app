# Tarea 72: Desacoplamiento de Credenciales Específicas en Auth y Limpieza de Tests

## Propósito
Eliminar el acoplamiento y referencias estáticas a correos específicos (`eva@plappin.org` / `eva@plapping.org`) en el controlador de autenticación ([backend/src/controllers/auth.controller.ts](file:///Users/csgj/dev/pai-app/backend/src/controllers/auth.controller.ts)) y en la suite de pruebas unitarias ([backend/src/tests/auth.test.ts](file:///Users/csgj/dev/pai-app/backend/src/tests/auth.test.ts)). 

Como señaló correctamente el usuario, las credenciales del usuario administrador inicial se definen externamente mediante variables de entorno en el archivo `.env` (`ADMIN_EMAIL`, `ADMIN_PASSWORD`) para que las migraciones las creen al arrancar el contenedor. Por tanto, el controlador y las pruebas de autenticación deben operar con independencia total de cualquier cuenta o dominio particular.

---

## Modificaciones Realizadas

1. **[backend/src/controllers/auth.controller.ts](file:///Users/csgj/dev/pai-app/backend/src/controllers/auth.controller.ts):**
   - Se removió la normalización especial que interceptaba correos puntuales con operadores `$in`.
   - Se restableció la consulta directa y genérica:
     ```typescript
     export const login = async (req: Request, res: Response) => {
       try {
         const { email, password } = req.body;
         const user = await User.findOne({ email });
         if (!user) {
           return res.status(400).json({ error: 'Credenciales inválidas' });
         }
         ...
     ```

2. **[backend/src/tests/auth.test.ts](file:///Users/csgj/dev/pai-app/backend/src/tests/auth.test.ts):**
   - Se eliminó el caso de prueba específico que registraba e iniciaba sesión probando combinaciones de un usuario concreto.
   - Las pruebas de autenticación se mantienen genéricas (probando registro, login correcto, fallo de credenciales, roles pendientes y middlewares con usuarios de prueba efímeros).

---

## Verificación
- **Backend Tests:** Se ejecutaron los 13 archivos de prueba de backend con **69 tests** pasando al 100% sin dependencias de nombres de usuario hardcodeados.
- **Frontend Tests:** Se mantienen los 27 archivos y 289 tests pasando con cobertura completa.
