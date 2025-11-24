import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { ApiService } from './api.service';
import {UserStatistics, UserRecentActions, UserRecentAction} from '../../entities/user/user.model';
import { NotificationService } from './notification.service';
import {environment} from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {

  private userStatisticsSubject: BehaviorSubject<UserStatistics | null> = new BehaviorSubject<UserStatistics | null>(null);
  private userRecentActionsSubject: BehaviorSubject<UserRecentActions | null> = new BehaviorSubject<UserRecentActions | null>(null);
  constructor(
    private api: ApiService,
    private notificationService: NotificationService
  ) {}

  getUserStatistics(): Observable<UserStatistics> {
    return this.api.get<UserStatistics>(`${environment.apiUrl}/profile/me/activity`).pipe(
      tap(statistics => {
        this.userStatisticsSubject.next(statistics);
      }),
      catchError(error => {
        console.error('Ошибка при загрузке статистики', error);
        this.notificationService.error(
          error.error.message ?? error.message,
          'Ошибка при загрузке статистики'
        );
        return throwError(() => error);
      })
    );
  }

  getUserRecentActions(): Observable<UserRecentActions> {
    return this.api.get<UserRecentActions>(`${environment.apiUrl}/profile/me/recent-actions`).pipe(
      tap(recentActions => {
        this.userRecentActionsSubject.next(recentActions);
      }),
      catchError(error => {
        console.error('Ошибка при загрузке последних действий', error);
        this.notificationService.error(
          error.error.message ?? error.message,
          'Ошибка при загрузке последних действий'
        );
        return throwError(() => error);
      })
    );
  }
}
