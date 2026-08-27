import type { Response } from 'express';

interface Client {
  id: string;
  res: Response;
}

const clients: Record<string, Client[]> = {};

export const addClient = (userId: string, clientId: string, res: Response) => {
  if (!clients[userId]) {
    clients[userId] = [];
  }
  clients[userId].push({ id: clientId, res });
};

export const removeClient = (userId: string, clientId: string) => {
  if (clients[userId]) {
    clients[userId] = clients[userId].filter(c => c.id !== clientId);
    if (clients[userId].length === 0) {
      delete clients[userId];
    }
  }
};

export const sendToUser = (userId: string, data: any) => {
  const userClients = clients[userId];
  if (userClients && userClients.length > 0) {
    userClients.forEach(client => {
      client.res.write(`data: ${JSON.stringify(data)}\n\n`);
    });
  }
};
