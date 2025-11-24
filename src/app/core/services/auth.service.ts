import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, tap, throwError, of } from 'rxjs';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { AuthResponse, LoginRequest, RegisterRequest, UpdateUser, User } from '../../entities/user/user.model';
import { NotificationService } from './notification.service';
import { StorageService } from './storage.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'auth_token';

  private isAuthenticatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private currentUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private api: ApiService,
    private router: Router,
    private notificationService: NotificationService,
    private storage: StorageService
  ) {
    this.listenToStorage();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        this.setToken(response.access_token);
        this.isAuthenticatedSubject.next(true);
        this.fetchCurrentUser().subscribe(user => {
          this.currentUserSubject.next(user);
        });
      }),
      catchError(error => {
        console.error('Ошибка при логине', error);
        this.notificationService.error(error.error?.detail?.[0]?.msg ?? error.error?.message ?? error.message, 'Ошибка при логине');
        return throwError(() => error);
      })
    );
  }

  register(credentials: RegisterRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse>(`${environment.apiUrl}/auth/register`, credentials).pipe(
      tap(response => {
        this.setToken(response.access_token);
        this.isAuthenticatedSubject.next(true);
        this.fetchCurrentUser().subscribe(user => {
          this.currentUserSubject.next(user);
        });
      }),
      catchError(error => {
        console.error('Ошибка при регистрации', error);
        this.notificationService.error(error.error?.detail?.[0]?.msg ?? error.error?.message ?? error.message, 'Ошибка при регистрации');
        return throwError(() => error);
      })
    );
  }

  private setToken(token: string): void {
    this.storage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return this.storage.getItem<string>(this.tokenKey);
  }

  private fetchCurrentUser(): Observable<User> {
    return this.api.get<User>(`${environment.apiUrl}/profile/me`);
  }

  initialize(): Promise<void> {
    return new Promise((resolve) => {
      const token = this.getToken();

      if (token) {
        this.fetchCurrentUser().pipe(
          tap(user => {
            this.isAuthenticatedSubject.next(true);
            this.currentUserSubject.next(user);
            resolve();
          }),
          catchError(error => {
            this.isAuthenticatedSubject.next(false);
            this.currentUserSubject.next(null);
            this.storage.removeItem(this.tokenKey);
            resolve();
            return of(null);
          })
        ).subscribe();
      } else {
        this.isAuthenticatedSubject.next(false);
        this.currentUserSubject.next(null);
        resolve();
      }
    });
  }

  logout(): void {
    this.storage.removeItem(this.tokenKey);
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  private listenToStorage(): void {
    window.addEventListener('storage', event => {
      if (event.key === this.tokenKey) {
        const token = this.getToken();
        if (token) {
          this.fetchCurrentUser().pipe(
            tap(user => {
              this.isAuthenticatedSubject.next(true);
              this.currentUserSubject.next(user);
              this.router.navigate(['']);
            }),
            catchError(error => {
              this.isAuthenticatedSubject.next(false);
              this.currentUserSubject.next(null);
              this.router.navigate(['/login']);
              return of(null);
            })
          ).subscribe();
        } else {
          this.isAuthenticatedSubject.next(false);
          this.currentUserSubject.next(null);
          this.router.navigate(['/login']);
        }
      }
    });
  }

  updateUser(user: User): void {
    this.currentUserSubject.next(user);
  }

  refreshUser(): Observable<User> {
    return this.fetchCurrentUser().pipe(
      tap(user => {
        this.currentUserSubject.next(user);
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  updateProfile(data: UpdateUser): Observable<User> {
    return this.api.patch<User>(`${environment.apiUrl}/profile/me`, data).pipe(
      tap(updated => {
        this.currentUserSubject.next(updated);
      }),
      catchError(error => {
        console.error('Ошибка обновления профиля', error);
        this.notificationService.error(error.error?.detail?.[0]?.msg ?? error.error?.message ?? error.message, 'Ошибка при обновлении профиля');
        return throwError(() => error);
      })
    );
  }
}
