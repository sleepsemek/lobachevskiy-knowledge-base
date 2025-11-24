import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import {UpdateUser, User, UserRecentAction, UserRecentActions, UserStatistics} from '../../entities/user/user.model';
import {FqCardComponent} from '../../shared/ui/fq-card/fq-card.component';
import {FqButtonComponent} from '../../shared/ui/fq-button/fq-button.component';
import {FqBadgeComponent} from '../../shared/ui/fq-badge/fq-badge.component';
import {Subject, takeUntil} from 'rxjs';
import {FqSpinnerComponent} from '../../shared/ui/fq-spinner/fq-spinner.component';
import {EditUserDialogComponent} from './edit-user-dialog/edit-user-dialog.component';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FqCardComponent,
    FqButtonComponent,
    FqBadgeComponent,
    FqSpinnerComponent,
    EditUserDialogComponent,
    DatePipe,
  ],
  templateUrl: 'profile-page.component.html',
  styleUrl: 'profile-page.component.scss',
})
export class ProfilePageComponent implements OnInit {
  private destroy$ = new Subject<void>();

  isUserLoading = true;
  isStatisticsLoading = true;
  isSaving = false;
  userData: User | null = null;
  userStatistics: UserStatistics | null = null;
  userRecentActions: UserRecentActions | null = null;
  editOpen = false;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadProfileData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openEdit(): void {
    this.editOpen = true;
  }

  onSave(data: UpdateUser) {
    this.isSaving = true;

    this.authService.updateProfile(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedUser) => {
          this.userData = updatedUser;
          this.editOpen = false;
          this.isSaving = false;
        },
        error: () => {
          this.isSaving = false;
        }
      });
  }

  loadProfileData(): void {
    this.isUserLoading = true;
    this.isStatisticsLoading = true;

    this.authService.refreshUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          this.userData = user;
          this.isUserLoading = false;
          this.loadUserStatistics();
          this.loadUserRecentActions();
        },
        error: (error) => {
          this.isUserLoading = false;
          this.isStatisticsLoading = false;
        }
      });
  }

  loadUserStatistics(): void {
    this.userService.getUserStatistics()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (statistics) => {
          this.userStatistics = statistics;
          this.checkStatisticsDataLoaded();
        },
        error: (error) => {
          this.checkStatisticsDataLoaded();
        }
      });
  }

  loadUserRecentActions(): void {
    this.userService.getUserRecentActions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (recentActions) => {
          this.userRecentActions = recentActions;
          this.checkStatisticsDataLoaded();
        },
        error: (error) => {
          this.checkStatisticsDataLoaded();
        }
      });
  }

  private checkStatisticsDataLoaded(): void {
    if (this.userStatistics !== undefined && this.userRecentActions !== undefined) {
      this.isStatisticsLoading = false;
    }
  }

  getInitials(user: User): string {
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  getFullName(user: User): string {
    const parts = [user.last_name, user.first_name, user.middle_name].filter(Boolean);
    return parts.join(' ');
  }
}
