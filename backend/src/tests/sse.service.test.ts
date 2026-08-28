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

  it('debería agregar un cliente adicional para el mismo usuario', () => {
    const resMock1 = { write: vi.fn() } as any;
    const resMock2 = { write: vi.fn() } as any;
    addClient('user4', 'client4a', resMock1);
    addClient('user4', 'client4b', resMock2);
    
    sendToUser('user4', { msg: 'hello' });
    expect(resMock1.write).toHaveBeenCalled();
    expect(resMock2.write).toHaveBeenCalled();
  });

  it('debería eliminar un cliente pero mantener los demás si hay más de uno', () => {
    const resMock1 = { write: vi.fn() } as any;
    const resMock2 = { write: vi.fn() } as any;
    addClient('user5', 'client5a', resMock1);
    addClient('user5', 'client5b', resMock2);
    
    removeClient('user5', 'client5a');
    sendToUser('user5', { msg: 'hello' });
    expect(resMock1.write).not.toHaveBeenCalled();
    expect(resMock2.write).toHaveBeenCalled();
  });

  it('no debería fallar al eliminar un cliente inexistente', () => {
    expect(() => removeClient('user3', 'client3')).not.toThrow();
  });
});
