export interface RawNotificationEvent {
  type: string;
  projectId?: string;
  project?: any;
  error?: string;
  status?: string;
  message?: string;
}

export interface AppNotification {
  id: string;
  type: 'COMPLETED' | 'ERROR' | 'STATUS' | 'INFO';
  title: string;
  message: string;
  projectId?: string;
  timestamp: Date;
  read: boolean;
}
