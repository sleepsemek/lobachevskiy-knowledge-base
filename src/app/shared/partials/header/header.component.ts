import {Component, inject} from '@angular/core';
import {AsyncPipe, NgOptimizedImage} from '@angular/common';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {AuthService} from '../../../core/services/auth.service';
import {UserMenuComponent} from '../../../features/user-menu/user-menu.component';

@Component({
  selector: 'app-header',
  imports: [
    NgOptimizedImage,
    RouterLink,
    UserMenuComponent,
    AsyncPipe,
    RouterLinkActive
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly user$ = this.authService.currentUser$;

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onProfile() {
    this.router.navigate(['/profile']);
  }

  onUpload() {
    this.router.navigate(['/upload']);
  }

  onCollections() {
    this.router.navigate(['/collections']);
  }
}
