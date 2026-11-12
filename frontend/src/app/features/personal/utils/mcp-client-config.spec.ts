import { describe, it, expect } from 'vitest';
import { MCP_CLIENTS, mcpClientConfig, mcpServerUrl } from './mcp-client-config';

describe('mcp-client-config', () => {
  const url = mcpServerUrl('https://plappin.org');

  it('construye la URL del servidor en el mismo dominio', () => {
    expect(url).toBe('https://plappin.org/api/mcp');
  });

  it('genera el comando de Claude Code', () => {
    expect(mcpClientConfig('claudeCode', url, 'plp_x')).toBe(
      'claude mcp add --transport http plappin https://plappin.org/api/mcp --header "Authorization: Bearer plp_x"',
    );
  });

  it('genera la configuración de Claude Desktop (mcp-remote) y de Gemini CLI', () => {
    const desktop = JSON.parse(mcpClientConfig('claudeDesktop', url, 'plp_x'));
    expect(desktop.mcpServers.plappin.args).toEqual([
      '-y',
      'mcp-remote',
      url,
      '--header',
      'Authorization: Bearer plp_x',
    ]);
    const gemini = JSON.parse(mcpClientConfig('geminiCli', url, 'plp_x'));
    expect(gemini.mcpServers.plappin).toEqual({
      httpUrl: url,
      headers: { Authorization: 'Bearer plp_x' },
    });
    expect(MCP_CLIENTS).toHaveLength(5);
  });

  it('genera la configuración de LibreChat y los datos genéricos de cualquier cliente', () => {
    const librechat = mcpClientConfig('librechat', url, 'plp_x');
    expect(librechat).toContain('type: streamable-http');
    expect(librechat).toContain(`url: ${url}`);
    expect(librechat).toContain('Authorization: "Bearer plp_x"');
    expect(mcpClientConfig('other', url, 'plp_x')).toBe(
      `URL: ${url}\nTransport: Streamable HTTP\nAuthorization: Bearer plp_x`,
    );
  });
});
