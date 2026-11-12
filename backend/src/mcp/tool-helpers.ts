import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { ZodRawShape } from 'zod';
import { ActivityLog } from '../models/ActivityLog';
import type { ApiResponse, InternalApi } from './internal-api.client';
import type { ResolvedToken } from '../services/api-token.service';

/** Lo que necesita cada herramienta: la API con la identidad del usuario y quién llama. */
export interface McpContext {
  api: InternalApi;
  user: ResolvedToken['user'];
  tokenName: string;
}

/** `read` no cambia nada; `write` cambia datos; `destructive` borra o quita algo (el cliente pide confirmación). */
export type ToolKind = 'read' | 'write' | 'destructive';

export interface ToolDefinition {
  name: string;
  title: string;
  description: string;
  kind: ToolKind;
  input?: ZodRawShape;
  run: (args: any, ctx: McpContext) => Promise<CallToolResult>;
}

export const jsonResult = (data: unknown): CallToolResult => ({
  content: [{ type: 'text', text: typeof data === 'string' ? data : JSON.stringify(data, null, 2) }]
});

export const errorResult = (message: string): CallToolResult => ({
  content: [{ type: 'text', text: message }],
  isError: true
});

/** Resultado de una llamada a la API: los datos (transformados) o el error tal cual lo da la web. */
export const apiResult = (response: ApiResponse, transform: (data: any) => unknown = (data) => data): CallToolResult =>
  response.ok ? jsonResult(transform(response.data)) : errorResult(`Error ${response.status}: ${response.error}`);

/** Deja constancia de las herramientas que cambian datos, con el token que las usó. */
const logToolUse = async (tool: ToolDefinition, ctx: McpContext): Promise<void> => {
  if (tool.kind === 'read') return;
  await new ActivityLog({ userId: ctx.user._id, action: 'MCP_TOOL', details: { tool: tool.name, tokenName: ctx.tokenName } })
    .save()
    .catch((error) => console.error('[MCP] No se pudo registrar el uso de la herramienta:', error));
};

const annotationsOf = (tool: ToolDefinition) => ({
  title: tool.title,
  readOnlyHint: tool.kind === 'read',
  destructiveHint: tool.kind === 'destructive',
  openWorldHint: false
});

export const registerTools = (server: McpServer, tools: ToolDefinition[], ctx: McpContext): void => {
  for (const tool of tools) {
    const config = { title: tool.title, description: tool.description, annotations: annotationsOf(tool), ...(tool.input ? { inputSchema: tool.input } : {}) };
    server.registerTool(tool.name, config, (async (args: any) => {
      const result = await tool.run(args ?? {}, ctx);
      if (!result.isError) await logToolUse(tool, ctx);
      return result;
    }) as any);
  }
};
