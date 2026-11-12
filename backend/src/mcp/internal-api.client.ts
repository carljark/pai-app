import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../middlewares/auth.middleware';
import type { ResolvedToken } from '../services/api-token.service';

/** Duración del JWT interno con el que las herramientas MCP llaman a la API como el usuario. */
export const INTERNAL_TOKEN_TTL = '5m';

let baseUrlOverride: string | null = null;

/** Los tests apuntan el cliente al puerto efímero en el que escucha la app. */
export const setInternalApiBaseUrl = (url: string | null): void => {
  baseUrlOverride = url;
};

const baseUrl = (): string => baseUrlOverride ?? `http://127.0.0.1:${process.env.PORT || 3000}`;

export interface ApiResponse {
  ok: boolean;
  status: number;
  data: any;
  /** Mensaje de error de la API (`{ error }`) cuando `ok` es `false`. */
  error?: string;
}

export interface InternalApi {
  request(method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', path: string, options?: { query?: Record<string, unknown>; body?: unknown }): Promise<ApiResponse>;
}

const buildUrl = (path: string, query: Record<string, unknown> = {}): string => {
  const url = new URL(path, baseUrl());
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, String(value));
  }
  return url.toString();
};

const parseBody = async (response: Response): Promise<any> => {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
};

/**
 * Cliente de la API REST de Plappin con la identidad del usuario del token. Las herramientas MCP
 * pasan así por los mismos middlewares y validaciones que la web (permisos, IA, turno de edición…).
 */
export const createInternalApi = (user: ResolvedToken['user']): InternalApi => {
  const token = jwt.sign(
    { _id: user._id, role: user.role, name: user.name, email: user.email, canUseAi: user.canUseAi },
    JWT_SECRET,
    { expiresIn: INTERNAL_TOKEN_TTL }
  );
  return {
    async request(method, path, options = {}) {
      const response = await fetch(buildUrl(path, options.query), {
        method,
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        ...(options.body !== undefined ? { body: JSON.stringify(options.body) } : {})
      });
      const data = await parseBody(response);
      if (response.ok) return { ok: true, status: response.status, data };
      const error = typeof data?.error === 'string' ? data.error : `Error ${response.status}`;
      return { ok: false, status: response.status, data, error };
    }
  };
};
