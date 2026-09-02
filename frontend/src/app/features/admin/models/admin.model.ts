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

export interface UsageSummary {
  totalUsageSeconds: number;
  totalSessions: number;
  totalDocxExports: number;
  totalPdfExports: number;
  totalProjectsGenerated: number;
  totalUsers: number;
}

export interface UserMetric {
  userId: string;
  name: string;
  email: string;
  role: 'pending' | 'teacher' | 'admin';
  canUseAi: boolean;
  createdAt: string;
  totalDurationSeconds: number;
  sessionCount: number;
  lastActive: string;
  docxExportsCount: number;
  pdfExportsCount: number;
  projectsGeneratedCount: number;
}

export interface ExportTimelineItem {
  _id: string;
  userId: { _id: string; name: string; email: string };
  action: string;
  projectId?: { _id: string; title: string };
  details?: { projectTitle?: string; format?: string };
  createdAt: string;
}

export interface AnalyticsData {
  summary: UsageSummary;
  userMetrics: UserMetric[];
  exportTimeline: ExportTimelineItem[];
}

