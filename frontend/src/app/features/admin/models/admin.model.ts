export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'pending' | 'teacher' | 'admin';
  canUseAi: boolean;
  createdAt: string;
}

export interface CenterSettings {
  name: string;
  context: string;
  educationalLevel: string;
}

export interface ActivityLog {
  _id: string;
  userId: { _id: string; name: string; email: string };
  action: string;
  details: any;
  projectId?: any;
  createdAt: string;
}
