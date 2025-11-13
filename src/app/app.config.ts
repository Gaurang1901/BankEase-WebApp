import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { MyPreset } from '../styles';
import { routes } from './app.routes';
import {
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { authInterceptor } from './core/auth/interceptors/auth.interceptor';
import { MessageService } from 'primeng/api';
import {
  NgxUiLoaderHttpModule,
  NgxUiLoaderModule,
  NgxUiLoaderRouterModule,
} from 'ngx-ui-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: {
          darkModeSelector: '.my-app-dark',
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng',
          },
        },
      },
    }),
    provideHttpClient(
      withInterceptors([authInterceptor]),
      withInterceptorsFromDi()
    ),
    importProvidersFrom(
      NgxUiLoaderRouterModule,
      NgxUiLoaderModule.forRoot({
        fgsType: 'square-jelly-box',
        fgsColor: '#ffa700',
        pbColor: '#ffa700',
        bgsColor: '#ffa700',
      }),
      NgxUiLoaderHttpModule.forRoot({
        showForeground: true,
      })
    ),
    MessageService,
  ],
};
