export interface User {
  _id?: string;
  name: string;
  email: string;
  role?: 'pending' | 'teacher' | 'admin';
  canUseAi?: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email?: string;
  password?: string;
}

export interface RegisterData {
  name?: string;
  email?: string;
  password?: string;
}
