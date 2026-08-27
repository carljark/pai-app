import { AuthMapper } from './auth.mapper';
import { User } from '../models/auth.model';

describe('AuthMapper', () => {
  it('fromStorage should return null if no userStr', () => {
    expect(AuthMapper.fromStorage(null)).toBeNull();
    expect(AuthMapper.fromStorage('')).toBeNull();
  });

  it('fromStorage should return mapped user when valid JSON is provided', () => {
    const userStr = JSON.stringify({
      _id: '123',
      name: 'John',
      email: 'john@test.com',
      role: 'admin',
      canUseAi: true
    });
    const user = AuthMapper.fromStorage(userStr);
    expect(user).toEqual({
      _id: '123',
      name: 'John',
      email: 'john@test.com',
      role: 'admin',
      canUseAi: true
    });
  });

  it('fromStorage should return default values if missing fields', () => {
    const userStr = JSON.stringify({
      _id: '123'
    });
    const user = AuthMapper.fromStorage(userStr);
    expect(user).toEqual({
      _id: '123',
      name: 'Anónimo',
      email: '',
      role: 'pending',
      canUseAi: false
    });
  });

  it('fromStorage should return null if JSON is invalid', () => {
    expect(AuthMapper.fromStorage('invalid-json')).toBeNull();
  });

  it('toStorage should stringify the user', () => {
    const user: User = {
      _id: '123',
      name: 'John',
      email: 'j@test.com',
      role: 'admin',
      canUseAi: true
    };
    expect(AuthMapper.toStorage(user)).toBe(JSON.stringify(user));
  });
});
