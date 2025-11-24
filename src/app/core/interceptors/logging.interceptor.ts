import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(`Запрос: ${req.method} ${req.urlWithParams}`, req.body);

    return next.handle(req).pipe(
      tap(event => {
        console.log('Ответ:', event);
      })
    );
  }
}
