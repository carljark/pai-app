import { withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import {
  provideMarkdown,
  MARKED_OPTIONS,
  MarkedOptions,
  MarkedKatexOptions,
  KATEX_OPTIONS,
} from 'ngx-markdown';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideMarkdown({
      markedOptions: {
        provide: MARKED_OPTIONS,
        useValue: { gfm: true, breaks: true } as MarkedOptions,
      },
      katexOptions: {
        provide: KATEX_OPTIONS,
        useValue: { throwOnError: false, output: 'html' } as MarkedKatexOptions,
      },
    }),
  ],
};
