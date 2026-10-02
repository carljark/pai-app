import { AIProvider } from '../../projects/models/project.model';

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

/** Metadatos libres de un log; los de IA los usa el panel de actividad. */
export interface ActivityLogDetails {
  [key: string]: unknown;
  title?: string;
  error?: string;
  model?: string;
  provider?: AIProvider;
  fallbackUsed?: boolean;
  generationTimeMs?: number;
  promptChars?: number;
  instructionChars?: number;
  cascadeLog?: unknown;
  errorCascadeLog?: string[];
}

/** Proyecto poblado por `GET /api/admin/logs` (o `null` si se borró). */
export interface ActivityLogProject {
  _id: string;
  title?: string;
  status?: string;
  usedModel?: string;
  usedAiProvider?: AIProvider;
  generationTimeMs?: number;
  errorCascadeLog?: string[];
  errorDetail?: string;
  aiPromptChars?: number;
  aiInstructionChars?: number;
}

export interface ActivityLog {
  _id: string;
  userId: { _id: string; name: string; email: string };
  action: string;
  details: ActivityLogDetails;
  projectId?: ActivityLogProject | null;
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
