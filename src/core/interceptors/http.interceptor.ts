import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ErrorHandlingService } from '../services/error-handling.service';
import { LoggerService } from '../services/logger.service';

/**
 * HTTP Interceptor - Ajoute les tokens d'authentification aux requêtes
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);
  private logger = inject(LoggerService);

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request);
  }
}

/**
 * HTTP Error Interceptor - Gère les erreurs HTTP
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);
  private errorHandler = inject(ErrorHandlingService);
  private router = inject(Router);
  private logger = inject(LoggerService);

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        this.logger.error('HTTP Error', { status: error.status, url: request.url });

        switch (error.status) {
          case 401:
            // Token expiré ou invalide
            this.authService.logout();
            this.router.navigate(['/login']);
            this.errorHandler.showError('Veuillez vous reconnecter');
            break;

          case 403:
            // Accès non autorisé
            this.router.navigate(['/unauthorized']);
            this.errorHandler.showError('Vous n\'avez pas accès à cette ressource');
            break;

          case 404:
            this.logger.warn('Resource not found', { url: request.url });
            break;

          case 500:
          case 502:
          case 503:
          case 504:
            this.errorHandler.showError('Erreur serveur. Veuillez réessayer');
            break;

          default:
            this.errorHandler.handleError(error);
        }

        return throwError(() => error);
      })
    );
  }
}

/**
 * HTTP Request Logging Interceptor
 */
@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  private logger = inject(LoggerService);

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const startTime = performance.now();
    this.logger.debug(`[${request.method}] ${request.url}`);

    return next.handle(request).pipe(
      catchError(error => {
        const duration = performance.now() - startTime;
        this.logger.error(`Request failed: ${request.url}`, { duration, error });
        return throwError(() => error);
      })
    );
  }
}

export const HTTP_INTERCEPTORS_PROVIDERS = [
  { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
];
