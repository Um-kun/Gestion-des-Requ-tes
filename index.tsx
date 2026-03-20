import '@angular/compiler';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { AppComponent } from './src/app.component';
import { ROUTES } from './src/app.routes';
import { HTTP_INTERCEPTORS_PROVIDERS } from './src/core/interceptors';
import { APP_CONFIG_TOKEN, DEFAULT_APP_CONFIG } from './src/core/config';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(ROUTES, withHashLocation()),
    provideHttpClient(),
    HTTP_INTERCEPTORS_PROVIDERS,
    { provide: APP_CONFIG_TOKEN, useValue: DEFAULT_APP_CONFIG }
  ]
}).catch((err) => console.error(err));
