import {
  ApplicationConfig,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {authInitializer} from './core/initializers/auth.initializer';
import {AuthInterceptor} from './core/interceptors/auth.interceptor';
import {LoggingInterceptor} from './core/interceptors/logging.interceptor';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {providePrimeNG} from 'primeng/config';
import { ru } from 'primelocale/ru.json';
import {provideNgxMask} from 'ngx-mask';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true},
    provideAppInitializer(authInitializer),
    provideAnimationsAsync(),
    providePrimeNG({
      translation: ru,
    }),
    provideNgxMask()
  ]
};
