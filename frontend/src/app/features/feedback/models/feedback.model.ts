export interface FeedbackItem {
  _id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: 'sugerencia' | 'error';
  title: string;
  description: string;
  status: 'pendiente' | 'en_revision' | 'resuelto' | 'descartado';
  adminNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFeedbackDto {
  type: 'sugerencia' | 'error';
  title: string;
  description: string;
}
