/** Asistentes de IA con instrucciones de conexión al servidor MCP de Plappin. */
export type McpClientId = 'claudeCode' | 'claudeDesktop' | 'geminiCli';

export const MCP_CLIENTS: readonly McpClientId[] = ['claudeCode', 'claudeDesktop', 'geminiCli'];

/** Texto de los ejemplos mientras no se ha creado un token. */
export const TOKEN_PLACEHOLDER = 'plp_TU_TOKEN';

/** URL del servidor MCP en el mismo dominio de la aplicación. */
export const mcpServerUrl = (origin: string): string => `${origin}/api/mcp`;

const json = (value: unknown): string => JSON.stringify(value, null, 2);

/** Comando o configuración que hay que copiar en cada asistente. */
export function mcpClientConfig(client: McpClientId, url: string, token: string): string {
  const header = `Authorization: Bearer ${token}`;
  switch (client) {
    case 'claudeCode':
      return `claude mcp add --transport http plappin ${url} --header "${header}"`;
    case 'claudeDesktop':
      return json({
        mcpServers: {
          plappin: { command: 'npx', args: ['-y', 'mcp-remote', url, '--header', header] },
        },
      });
    case 'geminiCli':
      return json({
        mcpServers: { plappin: { httpUrl: url, headers: { Authorization: `Bearer ${token}` } } },
      });
  }
}
