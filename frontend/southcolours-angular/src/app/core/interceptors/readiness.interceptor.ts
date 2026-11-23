import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const readinessInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // If backend returns 503 Service Unavailable with setupUrl, redirect browser to Setup Wizard
      if (error.status === 503 && error.error?.setupUrl) {
        const backendOrigin = window.location.port === '4200' ? 'https://localhost:44398' : '';
        window.location.href = `${backendOrigin}${error.error.setupUrl}`;
      }
      return throwError(() => error);
    })
  );
};
