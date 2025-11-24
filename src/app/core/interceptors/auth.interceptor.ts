import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Router} from '@angular/router';
import {NotificationService} from '../services/notification.service';
import {inject, Injectable} from '@angular/core';
import {catchError, Observable, throwError} from 'rxjs';
import {StorageService} from '../services/storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router, private notificationService: NotificationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const storageService = inject(StorageService)

    const token = storageService.getItem<string>('auth_token')

    let authReq = req;
    if (token && token?.length > 0) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          storageService.removeItem('auth_token')

          this.notificationService.error('Сессия истекла. Пожалуйста, войдите снова.', 'Ошибка авторизации');

          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
