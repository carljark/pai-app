import type { Response } from 'express';

interface Client {
  id: string;
  res: Response;
  heartbeat?: any;
}

const clients: Record<string, Client[]> = {};
const HEARTBEAT_MS = 25_000;

const startHeartbeat = (userId: string, client: Client) => {
  const timer: any = setInterval(() => {
    try {
      client.res.write(': ping\n\n');
    } catch {
      removeClient(userId, client.id);
    }
  }, HEARTBEAT_MS);
  // No mantener el proceso vivo solo por el heartbeat
  timer.unref?.();
  client.heartbeat = timer;
};

const writeTo = (userId: string, client: Client, data: any) => {
  try {
    client.res.write(`data: ${JSON.stringify(data)}\n\n`);
  } catch {
    removeClient(userId, client.id);
  }
};

export const addClient = (userId: string, clientId: string, res: Response) => {
  if (!clients[userId]) {
    clients[userId] = [];
  }
  const client: Client = { id: clientId, res };
  clients[userId].push(client);
  startHeartbeat(userId, client);
};

export const removeClient = (userId: string, clientId: string) => {
  if (!clients[userId]) return;
  clients[userId].forEach(c => {
    if (c.id === clientId && c.heartbeat) {
      clearInterval(c.heartbeat);
    }
  });
  clients[userId] = clients[userId].filter(c => c.id !== clientId);
  if (clients[userId].length === 0) {
    delete clients[userId];
  }
};

export const sendToUser = (userId: string, data: any) => {
  const userClients = clients[userId];
  if (userClients && userClients.length > 0) {
    userClients.forEach(client => writeTo(userId, client, data));
  }
};

export const broadcast = (data: any) => {
  Object.entries(clients).forEach(([userId, userClients]) => {
    userClients.forEach(client => writeTo(userId, client, data));
  });
};
