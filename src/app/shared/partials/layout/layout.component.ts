import { Component, inject } from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {AuthService} from '../../../core/services/auth.service';
import {NotificationContainerComponent} from '../../../features/notification/notification.component';
import {HeaderComponent} from '../header/header.component';
import {FooterComponent} from '../footer/footer.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    NotificationContainerComponent,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: 'layout.component.html',
  styleUrl: 'layout.component.scss',
})
export class LayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);


  logout() {
    this.authService.logout();
    this.router.navigate(['auth/login']);
  }

}
