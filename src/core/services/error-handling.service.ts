import { Injectable, inject, signal } from '@angular/core';
import { ApiError, ErrorCode } from '../models/error.model';
import { LoggerService } from './logger.service';

/**
 * Service de gestion centralisée des erreurs
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {
  private logger = inject(LoggerService);
  private errorMessage = signal<string | null>(null);
  private errors = signal<ApiError[]>([]);

  readonly error$ = this.errorMessage.asReadonly();
  readonly errors$ = this.errors.asReadonly();

  /**
   * Affiche un message d'erreur à l'utilisateur
   */
  showError(message: string, code: string = ErrorCode.UNKNOWN_ERROR): void {
    this.errorMessage.set(message);
    this.logger.error(message);
    
    // Efface le message après 5 secondes
    setTimeout(() => {
      if (this.errorMessage() === message) {
        this.errorMessage.set(null);
      }
    }, 5000);
  }

  /**
   * Gère une erreur API complète
   */
  handleError(error: any): void {
    const apiError = this.parseError(error);
    this.logger.error('API Error', apiError);
    this.showError(apiError.message);
  }

  /**
   * Parse une erreur pour extraire les informations pertinentes
   */
  private parseError(error: any): ApiError {
    if (error.error && error.error.error) {
      return {
        code: error.error.error.code || ErrorCode.UNKNOWN_ERROR,
        message: error.error.error.message || 'Une erreur est survenue',
        statusCode: error.status || 500,
        timestamp: new Date(),
        details: error.error.error.details
      };
    }

    return {
      code: ErrorCode.UNKNOWN_ERROR,
      message: error.message || 'Une erreur inconnue est survenue',
      statusCode: error.status || 500,
      timestamp: new Date()
    };
  }

  /**
   * Efface le message d'erreur
   */
  clearError(): void {
    this.errorMessage.set(null);
  }

  /**
   * Ajoute une erreur à la liste
   */
  addError(error: ApiError): void {
    this.errors.update(errors => [...errors, error]);
  }

  /**
   * Efface toutes les erreurs
   */
  clearErrors(): void {
    this.errors.set([]);
  }
}
