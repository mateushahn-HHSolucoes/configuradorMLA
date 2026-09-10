import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { basicAuthInterceptor } from './interceptors/basic-auth.Interceptor';
import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  
} from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi, withInterceptors  } from '@angular/common/http';

import { PoHttpRequestModule } from '@po-ui/ng-components';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    importProvidersFrom([PoHttpRequestModule]),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
  ],
};
