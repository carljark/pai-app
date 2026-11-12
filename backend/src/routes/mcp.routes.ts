import { Router, type Response } from 'express';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { mcpAuth, type McpRequest } from '../mcp/mcp-auth.middleware';
import { buildMcpServer } from '../mcp/server';
import { createInternalApi } from '../mcp/internal-api.client';

const router = Router();

/**
 * POST /api/mcp — servidor MCP (Streamable HTTP) sin estado: cada petición crea su servidor con
 * las herramientas del usuario del token. Responde en JSON (sin SSE) para no depender del búfer
 * de los proxies. Ver documentation/servidor_mcp.md.
 */
router.post('/', mcpAuth, async (req: McpRequest, res: Response) => {
  const { user, tokenName } = req.mcp!;
  const server = buildMcpServer({ api: createInternalApi(user), user, tokenName });
  const transport = new StreamableHTTPServerTransport({ enableJsonResponse: true });
  res.on('close', () => {
    void transport.close();
    void server.close();
  });
  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error('[MCP] Error al atender la petición:', error);
    if (!res.headersSent) res.status(500).json({ error: 'Error interno del servidor MCP' });
  }
});

/** Sin sesiones ni notificaciones del servidor: no hay flujo GET ni cierre de sesión. */
const methodNotAllowed = (_req: unknown, res: Response) => {
  res.status(405).set('Allow', 'POST').json({ error: 'Método no permitido: usa POST' });
};
router.get('/', methodNotAllowed);
router.delete('/', methodNotAllowed);

export default router;
