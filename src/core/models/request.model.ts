/**
 * Request Status Types
 */
export type RequestStatus = 'En attente' | 'Validée' | 'Rejetée' | 'Transmise';

/**
 * Request Type Types
 */
export type RequestType = 'Erreur de saisie' | 'Absence de note' | 'Incohérence' | 'Autre';

/**
 * Request Domain Model
 */
export interface Request {
  id: string;
  studentId: string;
  studentName: string;
  email: string;
  matricule: string;
  subject: string;
  type: RequestType;
  description: string;
  status: RequestStatus;
  priority: 'low' | 'medium' | 'high';
  attachments: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

/**
 * Request DTO for API responses
 */
export interface RequestDTO {
  id: string;
  studentId: string;
  studentName: string;
  email: string;
  matricule: string;
  subject: string;
  type: RequestType;
  description: string;
  status: RequestStatus;
  priority: 'low' | 'medium' | 'high';
  attachments: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

/**
 * Create Request DTO
 */
export interface CreateRequestDTO {
  subject: string;
  type: RequestType;
  description: string;
  attachments?: string[];
  priority?: 'low' | 'medium' | 'high';
}

/**
 * Update Request DTO
 */
export interface UpdateRequestDTO {
  status?: RequestStatus;
  notes?: string;
  priority?: 'low' | 'medium' | 'high';
}

/**
 * Request Statistics
 */
export interface RequestStats {
  total: number;
  pending: number;
  validated: number;
  rejected: number;
  transmitted: number;
  bySubject: Record<string, number>;
  byType: Record<string, number>;
  averageResolutionTime?: number;
}
