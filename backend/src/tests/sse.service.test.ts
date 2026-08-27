import { describe, it, expect, vi } from 'vitest';
import { addClient, removeClient, sendToUser } from '../services/sse.service';

describe('SSE Service', () => {
  it('debería agregar un cliente', () => {
    const resMock = { write: vi.fn() } as any;
    addClient('user1', 'client1', resMock);
    sendToUser('user1', { test: true });
    expect(resMock.write).toHaveBeenCalledWith('data: {"test":true}\n\n');
  });

  it('debería eliminar un cliente', () => {
    const resMock = { write: vi.fn() } as any;
    addClient('user2', 'client2', resMock);
    removeClient('user2', 'client2');
    sendToUser('user2', { test: true });
    expect(resMock.write).not.toHaveBeenCalled();
  });

  it('no debería fallar al eliminar un cliente inexistente', () => {
    expect(() => removeClient('user3', 'client3')).not.toThrow();
  });
});
