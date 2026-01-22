import { Injectable, signal, computed } from '@angular/core';

export interface Request {
  id: string;
  studentId: string;
  studentName: string;
  matricule: string;
  subject: string;
  type: 'Erreur de saisie' | 'Absence de note' | 'Incohérence' | 'Autre';
  description: string;
  status: 'En attente' | 'Validée' | 'Rejetée' | 'Transmise';
  date: string;
  attachments: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  private requestsSignal = signal<Request[]>([
    { id: 'REQ-001', studentId: '101', studentName: 'Alice Martin', matricule: 'ETU202401', subject: 'Mathématiques', type: 'Erreur de saisie', description: 'J\'ai eu 15 et non 5.', status: 'En attente', date: '2024-05-20', attachments: true },
    { id: 'REQ-002', studentId: '102', studentName: 'Bob Dylan', matricule: 'ETU202402', subject: 'Physique', type: 'Absence de note', description: 'Note manquante au partiel.', status: 'Transmise', date: '2024-05-18', attachments: false },
    { id: 'REQ-003', studentId: '101', studentName: 'Alice Martin', matricule: 'ETU202401', subject: 'Informatique', type: 'Incohérence', description: 'Moyenne incorrecte.', status: 'Validée', date: '2024-05-10', attachments: true },
    { id: 'REQ-004', studentId: '103', studentName: 'Charlie Chaplin', matricule: 'ETU202403', subject: 'Histoire', type: 'Autre', description: 'Problème de copie.', status: 'Rejetée', date: '2024-05-15', attachments: false },
    { id: 'REQ-005', studentId: '104', studentName: 'David Bowie', matricule: 'ETU202404', subject: 'Mathématiques', type: 'Erreur de saisie', description: 'Erreur transcription.', status: 'En attente', date: '2024-05-21', attachments: true },
  ]);

  readonly requests = this.requestsSignal.asReadonly();

  addRequest(req: Omit<Request, 'id' | 'status' | 'date'>) {
    const newReq: Request = {
      ...req,
      id: `REQ-${Math.floor(Math.random() * 10000)}`,
      status: 'En attente',
      date: new Date().toISOString().split('T')[0]
    };
    this.requestsSignal.update(vals => [newReq, ...vals]);
  }

  updateStatus(id: string, status: Request['status']) {
    this.requestsSignal.update(requests => 
      requests.map(r => r.id === id ? { ...r, status } : r)
    );
  }

  // Statistics
  readonly stats = computed(() => {
    const reqs = this.requestsSignal();
    return {
      total: reqs.length,
      pending: reqs.filter(r => r.status === 'En attente').length,
      validated: reqs.filter(r => r.status === 'Validée').length,
      rejected: reqs.filter(r => r.status === 'Rejetée').length,
    };
  });

  readonly subjectsStats = computed(() => {
    const reqs = this.requestsSignal();
    const counts: Record<string, number> = {};
    reqs.forEach(r => {
      counts[r.subject] = (counts[r.subject] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  });
}