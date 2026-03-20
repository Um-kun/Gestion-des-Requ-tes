import { Injectable, InjectionToken, inject } from '@angular/core';

/**
 * Configuration de l'application
 */
export interface AppConfig {
  apiUrl: string;
  environment: 'development' | 'staging' | 'production';
  maxRetries: number;
  timeout: number;
  enableLogging: boolean;
}

/**
 * Token pour l'injection de la configuration
 */
export const APP_CONFIG_TOKEN = new InjectionToken<AppConfig>('app.config');

/**
 * Service de configuration centralisée
 */
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config = inject(APP_CONFIG_TOKEN);

  getConfig(): AppConfig {
    return this.config;
  }

  getApiUrl(): string {
    return this.config.apiUrl;
  }

  getEnvironment(): string {
    return this.config.environment;
  }

  isProduction(): boolean {
    return this.config.environment === 'production';
  }

  isDevelopment(): boolean {
    return this.config.environment === 'development';
  }
}

/**
 * Configuration par défaut
 */
export const DEFAULT_APP_CONFIG: AppConfig = {
  apiUrl: 'http://localhost:3000/api',
  environment: 'development',
  maxRetries: 3,
  timeout: 30000,
  enableLogging: true
};
