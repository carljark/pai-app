import { User } from '../models/auth.model';

export class AuthMapper {
  static fromStorage(userStr: string | null): User | null {
    if (!userStr) return null;
    try {
      const parsed = JSON.parse(userStr);
      return {
        _id: parsed._id,
        name: parsed.name || 'Anónimo',
        email: parsed.email || '',
        role: parsed.role || 'pending',
        canUseAi: !!parsed.canUseAi
      };
    } catch {
      return null;
    }
  }

  static toStorage(user: User): string {
    return JSON.stringify(user);
  }
}
