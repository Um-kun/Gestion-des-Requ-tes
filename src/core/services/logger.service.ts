import { Injectable, inject } from '@angular/core';
import { ConfigService } from '../config/app.config';

/**
 * Niveaux de log
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

/**
 * Service de Logging centralisé
 * Peut être étendu pour envoyer les logs à un serveur
 */
@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private config = inject(ConfigService);
  private isDevelopment = !this.config.isProduction();

  debug(message: string, data?: any): void {
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${message}`, data);
    }
  }

  info(message: string, data?: any): void {
    console.info(`[INFO] ${message}`, data);
  }

  warn(message: string, data?: any): void {
    console.warn(`[WARN] ${message}`, data);
  }

  error(message: string, error?: any): void {
    console.error(`[ERROR] ${message}`, error);
    // Ici vous pouvez envoyer les erreurs à un service de monitoring
    // this.sendToMonitoring(message, error);
  }

  private isProduction(): boolean {
    // À adapter selon votre configuration
    return false;
  }
}
