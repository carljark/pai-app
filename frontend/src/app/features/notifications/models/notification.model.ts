export interface RawNotificationEvent {
  type: string;
  projectId?: string;
  project?: any;
  error?: string;
  status?: string;
  phase?: string;
  rasCount?: number;
  message?: string;
  title?: string;
  userName?: string;
  modules?: string[];
  generationTimeMs?: number;
  generationStartedAt?: Date | string;
  notification?: any;
}

export interface AppNotification {
  id: string;
  type: 'COMPLETED' | 'ERROR' | 'STATUS' | 'INFO';
  title: string;
  message: string;
  projectId?: string;
  userId?: string;
  userName?: string;
  modules?: string[];
  rasCount?: number;
  phase?: string;
  status?: string;
  generationTimeMs?: number;
  generationStartedAt?: Date | string;
  timestamp: Date;
  updatedAt?: Date;
  read: boolean;
}

