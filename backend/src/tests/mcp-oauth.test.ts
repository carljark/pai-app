import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';
import crypto from 'crypto';
import type { Server } from 'http';
import type { AddressInfo } from 'net';
import request from 'supertest';
import mongoose from 'mongoose';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { app } from '../server';
import { connectDB, closeDB, clearDB } from './testSetup';
import { createTestUser } from './testUtils';
import { OAuthGrant } from '../models/OAuthGrant';
import { OAuthRequest } from '../models/OAuthRequest';
import { setInternalApiBaseUrl } from '../mcp/internal-api.client';
import { isAllowedRedirect, consentUrl, protectedResourceMetadataUrl } from '../mcp/oauth/oauth-config';
import { oauthProvider } from '../mcp/oauth/oauth-provider';
import { resolveOAuthToken } from '../mcp/oauth/oauth-token.service';

const CLAUDE_CALLBACK = 'https://claude.ai/api/mcp/auth_callback';

let server: Server;
let baseUrl: string;

beforeAll(async () => {
  await connectDB();
  server = app.listen(0);
  baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  setInternalApiBaseUrl(baseUrl);
});
afterAll(async () => {
  setInternalApiBaseUrl(null);
  await new Promise((resolve) => server.close(resolve));
  await closeDB();
});
beforeEach(async () => await clearDB());
afterEach(() => {
  delete process.env.MCP_OAUTH_REDIRECT_ALLOWLIST;
  vi.restoreAllMocks();
});

const pkce = () => {
  const verifier = crypto.randomBytes(32).toString('base64url');
  return { verifier, challenge: crypto.createHash('sha256').update(verifier).digest('base64url') };
};

const register = (redirectUris = [CLAUDE_CALLBACK], name = 'Claude') =>
  request(app).post('/register').send({ redirect_uris: redirectUris, client_name: name, token_endpoint_auth_method: 'none' });

const authorize = (clientId: string, challenge: string, extra: Record<string, string> = {}) =>
  request(app).get('/authorize').query({
    response_type: 'code', client_id: clientId, redirect_uri: CLAUDE_CALLBACK,
    code_challenge: challenge, code_challenge_method: 'S256', state: 'xyz', ...extra
  });

const requestIdOf = (location: string | undefined) => new URL(location ?? '').searchParams.get('request')!;

const tokenRequest = (form: Record<string, string>) =>
  request(app).post('/token').type('form').send(form);

/** Flujo completo hasta el código: registro, autorización y consentimiento del docente. */
const obtainCode = async (jwt: string) => {
  const client = (await register()).body;
  const { verifier, challenge } = pkce();
  const auth = await authorize(client.client_id, challenge, { resource: `${'https://plappin.org'}/api/mcp` });
  const answer = await request(app).post(`/api/oauth/requests/${requestIdOf(auth.headers.location)}`)
    .set('Authorization', `Bearer ${jwt}`).send({ approve: true });
  const code = new URL(answer.body.redirectUrl).searchParams.get('code')!;
  return { client, verifier, code };
};

const exchange = async (jwt: string) => {
  const { client, verifier, code } = await obtainCode(jwt);
  const tokens = (await tokenRequest({ grant_type: 'authorization_code', client_id: client.client_id, code, code_verifier: verifier, redirect_uri: CLAUDE_CALLBACK })).body;
  return { client, tokens };
};

describe('OAuth: configuración', () => {
  it('permite claude.ai y loopback, y la lista configurada amplía la de claude.ai', () => {
    expect(isAllowedRedirect(CLAUDE_CALLBACK)).toBe(true);
    expect(isAllowedRedirect('https://claude.com/api/mcp/auth_callback')).toBe(true);
    expect(isAllowedRedirect('http://localhost:6274/callback')).toBe(true);
    expect(isAllowedRedirect('http://127.0.0.1:9000/cb')).toBe(true);
    expect(isAllowedRedirect('https://chatgpt.com/connector_platform_oauth_redirect')).toBe(true);
    expect(isAllowedRedirect('https://chatgpt.com/connector/oauth/abc_123-XYZ')).toBe(true);
    expect(isAllowedRedirect('https://chatgpt.com/connector/oauth/abc/../x')).toBe(false);
    expect(isAllowedRedirect('https://chatgpt.com.evil.example/connector/oauth/abc')).toBe(false);
    expect(isAllowedRedirect('https://localhost/cb')).toBe(false);
    expect(isAllowedRedirect('https://evil.example/cb')).toBe(false);
    expect(isAllowedRedirect('no es una url')).toBe(false);
    process.env.MCP_OAUTH_REDIRECT_ALLOWLIST = ' https://otro.example/cb , ';
    expect(isAllowedRedirect('https://otro.example/cb')).toBe(true);
    expect(isAllowedRedirect(CLAUDE_CALLBACK)).toBe(true);
    expect(isAllowedRedirect('https://evil.example/cb')).toBe(false);
  });

  it('construye la URL del consentimiento y de los metadatos con PUBLIC_URL', () => {
    expect(consentUrl('abc')).toBe('https://plappin.org/?view=oauth-consent&request=abc');
    process.env.PUBLIC_URL = 'http://localhost:4200';
    expect(protectedResourceMetadataUrl()).toBe('http://localhost:4200/.well-known/oauth-protected-resource/api/mcp');
    delete process.env.PUBLIC_URL;
  });
});

describe('OAuth: descubrimiento y registro', () => {
  it('el 401 del servidor MCP anuncia los metadatos del recurso protegido', async () => {
    const missing = await request(app).post('/api/mcp').send({});
    expect(missing.headers['www-authenticate']).toBe(
      'Bearer realm="plappin", resource_metadata="https://plappin.org/.well-known/oauth-protected-resource/api/mcp"'
    );
    const invalid = await request(app).post('/api/mcp').set('Authorization', 'Bearer plpa_caducado').send({});
    expect(invalid.headers['www-authenticate']).toContain('error="invalid_token"');
  });

  it('publica los metadatos del recurso y del servidor de autorización', async () => {
    const resource = await request(app).get('/.well-known/oauth-protected-resource/api/mcp');
    expect(resource.body).toMatchObject({ resource: 'https://plappin.org/api/mcp', authorization_servers: ['https://plappin.org/'] });
    const as = await request(app).get('/.well-known/oauth-authorization-server');
    expect(as.body).toMatchObject({
      issuer: 'https://plappin.org/',
      authorization_endpoint: 'https://plappin.org/authorize',
      token_endpoint: 'https://plappin.org/token',
      registration_endpoint: 'https://plappin.org/register',
      code_challenge_methods_supported: ['S256'],
      authorization_response_iss_parameter_supported: true
    });
    // ChatGPT exige que `issuer` y `authorization_servers` coincidan exactamente
    expect(resource.body.authorization_servers).toEqual([as.body.issuer]);
    const root = await request(app).get('/.well-known/oauth-protected-resource');
    expect(root.body).toEqual(resource.body);
  });

  it('registra clientes con redirecciones permitidas y rechaza el resto', async () => {
    const ok = await register();
    expect(ok.status).toBe(201);
    expect(ok.body.client_id).toBeTruthy();
    const bad = await register(['https://evil.example/cb']);
    expect(bad.status).toBe(400);
    expect(bad.body.error).toBe('invalid_redirect_uri');
  });
});

describe('OAuth: autorización y consentimiento', () => {
  it('redirige al consentimiento, muestra el cliente y emite el código al aceptar', async () => {
    const { token: jwt } = await createTestUser('teacher', 'oauth@test.com');
    const client = (await register()).body;
    const auth = await authorize(client.client_id, pkce().challenge);
    expect(auth.status).toBe(302);
    expect(auth.headers.location).toMatch(/^https:\/\/plappin\.org\/\?view=oauth-consent&request=/);
    const id = requestIdOf(auth.headers.location);

    const info = await request(app).get(`/api/oauth/requests/${id}`).set('Authorization', `Bearer ${jwt}`);
    expect(info.body).toEqual({ clientName: 'Claude', clientUri: null, redirectHost: 'claude.ai', scopes: [] });

    const answer = await request(app).post(`/api/oauth/requests/${id}`).set('Authorization', `Bearer ${jwt}`).send({ approve: true });
    const back = new URL(answer.body.redirectUrl);
    expect(back.origin + back.pathname).toBe(CLAUDE_CALLBACK);
    expect(back.searchParams.get('state')).toBe('xyz');
    expect(back.searchParams.get('iss')).toBe('https://plappin.org/');
    expect(back.searchParams.get('code')).toBeTruthy();
    expect((await request(app).post(`/api/oauth/requests/${id}`).set('Authorization', `Bearer ${jwt}`).send({ approve: true })).status).toBe(404);
  });

  it('al rechazar vuelve con access_denied y sin código; las cuentas pendientes no pueden autorizar', async () => {
    const { token: jwt } = await createTestUser('teacher', 'oauth-deny@test.com');
    const pending = await createTestUser('pending', 'oauth-pending@test.com');
    const client = (await register([CLAUDE_CALLBACK], '')).body;
    const id = requestIdOf((await authorize(client.client_id, pkce().challenge, { state: '' })).headers.location);

    expect((await request(app).get(`/api/oauth/requests/${id}`).set('Authorization', `Bearer ${jwt}`)).body.clientName).toBe('claude.ai');
    expect((await request(app).post(`/api/oauth/requests/${id}`).set('Authorization', `Bearer ${pending.token}`).send({ approve: true })).status).toBe(403);
    const answer = await request(app).post(`/api/oauth/requests/${id}`).set('Authorization', `Bearer ${jwt}`).send({ approve: false });
    expect(answer.body.redirectUrl).toBe(
      `${CLAUDE_CALLBACK}?error=access_denied&iss=${encodeURIComponent('https://plappin.org/')}`
    );
    expect(await OAuthGrant.countDocuments()).toBe(0);
  });

  it('responde 404 a peticiones inexistentes o caducadas y 500 si falla la base de datos', async () => {
    const { token: jwt } = await createTestUser('teacher', 'oauth-404@test.com');
    const auth = { Authorization: `Bearer ${jwt}` };
    expect((await request(app).get('/api/oauth/requests/nada').set(auth)).status).toBe(404);
    await OAuthRequest.create({ requestId: 'viejo', clientId: 'c', redirectUri: CLAUDE_CALLBACK, codeChallenge: 'x', expiresAt: new Date(Date.now() - 1000) });
    expect((await request(app).post('/api/oauth/requests/viejo').set(auth).send({ approve: true })).status).toBe(404);

    vi.spyOn(OAuthRequest, 'findOne').mockImplementationOnce(() => { throw new Error('caída'); });
    expect((await request(app).get('/api/oauth/requests/x').set(auth)).status).toBe(500);
    vi.spyOn(OAuthRequest, 'findOneAndDelete').mockImplementationOnce(() => { throw new Error('caída'); });
    expect((await request(app).post('/api/oauth/requests/x').set(auth).send({})).status).toBe(500);
  });
});

describe('OAuth: tokens', () => {
  it('canjea el código con PKCE una sola vez y usa el token en el servidor MCP', async () => {
    const { token: jwt, user } = await createTestUser('admin', 'oauth-token@test.com');
    const { client, verifier, code } = await obtainCode(jwt);
    const form = { grant_type: 'authorization_code', client_id: client.client_id, code, redirect_uri: CLAUDE_CALLBACK };

    expect((await tokenRequest({ ...form, code_verifier: 'incorrecto' })).body.error).toBe('invalid_grant');
    const tokens = (await tokenRequest({ ...form, code_verifier: verifier })).body;
    expect(tokens).toMatchObject({ token_type: 'Bearer', expires_in: 3600, scope: 'plappin' });
    expect(tokens.access_token).toMatch(/^plpa_/);
    expect(tokens.refresh_token).toMatch(/^plpr_/);
    expect((await tokenRequest({ ...form, code_verifier: verifier })).body.error).toBe('invalid_grant');

    const mcp = new Client({ name: 'claude-test', version: '1.0.0' });
    await mcp.connect(new StreamableHTTPClientTransport(new URL(`${baseUrl}/api/mcp`), {
      requestInit: { headers: { Authorization: `Bearer ${tokens.access_token}` } }
    }));
    const me: any = await mcp.callTool({ name: 'whoami', arguments: {} });
    expect(JSON.parse(me.content[0].text)).toMatchObject({ email: 'oauth-token@test.com', role: 'admin', tokenName: 'OAuth: Claude' });
    expect((await mcp.listTools()).tools.some((t) => t.name === 'admin_list_users')).toBe(true);
    await mcp.close();
    expect((await OAuthGrant.findOne({ userId: user._id }).lean())!.lastUsedAt).toBeTruthy();
  });

  it('rechaza el código con otra redirect_uri o caducado', async () => {
    const { token: jwt } = await createTestUser('teacher', 'oauth-redir@test.com');
    const { client, verifier, code } = await obtainCode(jwt);
    await expect(oauthProvider.exchangeAuthorizationCode(client, code, verifier, 'http://localhost/otra')).rejects.toThrow('redirect_uri');

    const second = await obtainCode(jwt);
    await OAuthGrant.updateMany({ codeHash: { $exists: true } }, { expiresAt: new Date(Date.now() - 1000) });
    await expect(oauthProvider.challengeForAuthorizationCode(second.client, second.code)).rejects.toThrow('caducado');
    await expect(oauthProvider.exchangeAuthorizationCode(second.client, second.code)).rejects.toThrow('caducado');
  });

  it('renueva con rotación del token de refresco', async () => {
    const { token: jwt } = await createTestUser('teacher', 'oauth-refresh@test.com');
    const { client, tokens } = await exchange(jwt);
    const refresh = { grant_type: 'refresh_token', client_id: client.client_id, refresh_token: tokens.refresh_token };

    const renewed = (await tokenRequest(refresh)).body;
    expect(renewed.access_token).toMatch(/^plpa_/);
    expect(renewed.access_token).not.toBe(tokens.access_token);
    expect((await tokenRequest(refresh)).body.error).toBe('invalid_grant');
    expect(await resolveOAuthToken(tokens.access_token)).toBeNull();
    expect((await resolveOAuthToken(renewed.access_token))?.user.role).toBe('teacher');
  });

  it('caducidad, revocación y usuarios borrados', async () => {
    const { token: jwt, user } = await createTestUser('teacher', 'oauth-revoke@test.com');
    const { client, tokens } = await exchange(jwt);
    expect(await resolveOAuthToken('plp_otro_tipo')).toBeNull();

    await OAuthGrant.updateOne({ userId: user._id }, { accessExpiresAt: new Date(Date.now() - 1000) });
    expect(await resolveOAuthToken(tokens.access_token)).toBeNull();
    await OAuthGrant.updateOne({ userId: user._id }, { accessExpiresAt: new Date(Date.now() + 60_000), lastUsedAt: new Date() });
    expect(await resolveOAuthToken(tokens.access_token)).not.toBeNull();

    await mongoose.model('User').updateOne({ _id: user._id }, { role: 'pending' });
    expect((await request(app).post('/api/mcp').set('Authorization', `Bearer ${tokens.access_token}`).send({})).status).toBe(403);
    await mongoose.model('User').deleteOne({ _id: user._id });
    expect(await resolveOAuthToken(tokens.access_token)).toBeNull();

    expect((await request(app).post('/revoke').type('form').send({ client_id: client.client_id, token: tokens.refresh_token })).status).toBe(200);
    expect(await OAuthGrant.countDocuments()).toBe(0);
  });
});

describe('OAuth: aplicaciones conectadas', () => {
  it('lista y desconecta las aplicaciones del docente', async () => {
    const { token: jwt } = await createTestUser('teacher', 'oauth-apps@test.com');
    const other = await createTestUser('teacher', 'oauth-apps-other@test.com');
    const { tokens } = await exchange(jwt);
    await obtainCode(jwt); // Código sin canjear: aún no es una aplicación conectada
    const auth = { Authorization: `Bearer ${jwt}` };

    const list = await request(app).get('/api/oauth/grants').set(auth);
    expect(list.body).toHaveLength(1);
    expect(list.body[0]).toMatchObject({ clientName: 'Claude', lastUsedAt: null });
    expect((await request(app).delete(`/api/oauth/grants/${list.body[0]._id}`).set('Authorization', `Bearer ${other.token}`)).status).toBe(404);
    expect((await request(app).delete(`/api/oauth/grants/${list.body[0]._id}`).set(auth)).status).toBe(200);
    expect((await request(app).delete('/api/oauth/grants/no-valido').set(auth)).status).toBe(404);
    expect(await resolveOAuthToken(tokens.access_token)).toBeNull();

    vi.spyOn(OAuthGrant, 'find').mockImplementationOnce(() => { throw new Error('caída'); });
    expect((await request(app).get('/api/oauth/grants').set(auth)).status).toBe(500);
    vi.spyOn(OAuthGrant, 'deleteOne').mockImplementationOnce(() => { throw new Error('caída'); });
    expect((await request(app).delete('/api/oauth/grants/x').set(auth)).status).toBe(500);
  });

  it('al borrar un usuario se borran sus aplicaciones conectadas', async () => {
    const admin = await createTestUser('admin', 'oauth-admin@test.com');
    const { token: jwt, user } = await createTestUser('teacher', 'oauth-del@test.com');
    await exchange(jwt);
    await request(app).delete(`/api/admin/users/${user._id}`).set('Authorization', `Bearer ${admin.token}`);
    expect(await OAuthGrant.countDocuments({ userId: user._id })).toBe(0);
  });
});
