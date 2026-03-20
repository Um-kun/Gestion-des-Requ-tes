import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Request, RequestDTO, CreateRequestDTO, UpdateRequestDTO, RequestStats } from '../models/request.model';
import { ConfigService } from '../config/app.config';
import { LoggerService } from './logger.service';
import { ErrorHandlingService } from './error-handling.service';
import { of } from 'rxjs';

/**
 * Service pour les requêtes académiques
 */
@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private http = inject(HttpClient);
  private logger = inject(LoggerService);
  private errorHandler = inject(ErrorHandlingService);
  private config = inject(ConfigService);

  private requestsSignal = signal<Request[]>([
    {
      id: 'REQ-001',
      studentId: '101',
      studentName: 'Alice Martin',
      email: 'alice@university.edu',
      matricule: 'ETU202401',
      subject: 'Mathématiques',
      type: 'Erreur de saisie',
      description: 'J\'ai eu 15 et non 5.',
      status: 'En attente',
      priority: 'high',
      attachments: [],
      createdAt: new Date('2024-05-20'),
      updatedAt: new Date('2024-05-20')
    },
    {
      id: 'REQ-002',
      studentId: '102',
      studentName: 'Bob Dylan',
      email: 'bob@university.edu',
      matricule: 'ETU202402',
      subject: 'Physique',
      type: 'Absence de note',
      description: 'Note manquante au partiel.',
      status: 'Transmise',
      priority: 'medium',
      attachments: [],
      createdAt: new Date('2024-05-18'),
      updatedAt: new Date('2024-05-19')
    },
    {
      id: 'REQ-003',
      studentId: '101',
      studentName: 'Alice Martin',
      email: 'alice@university.edu',
      matricule: 'ETU202401',
      subject: 'Informatique',
      type: 'Incohérence',
      description: 'Moyenne incorrecte.',
      status: 'Validée',
      priority: 'medium',
      attachments: [],
      createdAt: new Date('2024-05-10'),
      updatedAt: new Date('2024-05-12')
    }
  ]);

  readonly requests$ = this.requestsSignal.asReadonly();

  // Statistiques
  readonly stats$ = computed(() => {
    const reqs = this.requestsSignal();
    return {
      total: reqs.length,
      pending: reqs.filter(r => r.status === 'En attente').length,
      validated: reqs.filter(r => r.status === 'Validée').length,
      rejected: reqs.filter(r => r.status === 'Rejetée').length,
      transmitted: reqs.filter(r => r.status === 'Transmise').length,
      bySubject: this.groupBy(reqs, 'subject'),
      byType: this.groupBy(reqs, 'type'),
      byPriority: this.groupByPriority(reqs)
    } as any;
  });

  /**
   * Récupère toutes les requêtes
   */
  getRequests(): Request[] {
    return this.requestsSignal();
  }

  /**
   * Récupère une requête par ID
   */
  getRequestById(id: string): Request | undefined {
    return this.requestsSignal().find(r => r.id === id);
  }

  /**
   * Crée une nouvelle requête
   */
  createRequest(data: CreateRequestDTO & { studentId: string; studentName: string; email: string; matricule: string }): Request {
    const newRequest: Request = {
      id: `REQ-${Math.floor(Math.random() * 10000)}`,
      ...data,
      status: 'En attente',
      attachments: data.attachments || [],
      priority: data.priority || 'medium',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.requestsSignal.update(requests => [newRequest, ...requests]);
    this.logger.info('Request created', { id: newRequest.id });
    return newRequest;
  }

  /**
   * Met à jour une requête
   */
  updateRequest(id: string, data: UpdateRequestDTO): void {
    this.requestsSignal.update(requests =>
      requests.map(r =>
        r.id === id
          ? {
              ...r,
              ...data,
              updatedAt: new Date(),
              resolvedAt: data.status === 'Validée' || data.status === 'Rejetée' ? new Date() : r.resolvedAt
            }
          : r
      )
    );
    this.logger.info('Request updated', { id });
  }

  /**
   * Delete une requête
   */
  deleteRequest(id: string): void {
    this.requestsSignal.update(requests => requests.filter(r => r.id !== id));
    this.logger.info('Request deleted', { id });
  }

  /**
   * Récupère les statistiques
   */
  getStats(): RequestStats {
    const reqs = this.requestsSignal();
    return {
      total: reqs.length,
      pending: reqs.filter(r => r.status === 'En attente').length,
      validated: reqs.filter(r => r.status === 'Validée').length,
      rejected: reqs.filter(r => r.status === 'Rejetée').length,
      transmitted: reqs.filter(r => r.status === 'Transmise').length,
      bySubject: this.groupBy(reqs, 'subject'),
      byType: this.groupBy(reqs, 'type')
    };
  }

  /**
   * Filtre les requêtes par statut
   */
  getRequestsByStatus(status: string): Request[] {
    return this.requestsSignal().filter(r => r.status === status);
  }

  /**
   * Filtre les requêtes par étudiant
   */
  getRequestsByStudent(studentId: string): Request[] {
    return this.requestsSignal().filter(r => r.studentId === studentId);
  }

  /**
   * Groupe les requêtes par un attribut
   */
  private groupBy(requests: Request[], key: string): Record<string, number> {
    const result: Record<string, number> = {};
    requests.forEach(r => {
      const value = (r as any)[key];
      result[value] = (result[value] || 0) + 1;
    });
    return result;
  }

  /**
   * Groupe les requêtes par priorité
   */
  private groupByPriority(requests: Request[]): Record<string, number> {
    return this.groupBy(requests, 'priority');
  }
}
