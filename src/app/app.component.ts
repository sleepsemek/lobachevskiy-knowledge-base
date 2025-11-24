import {Component, inject, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {CommonModule} from '@angular/common';
import {NotificationService} from './core/services/notification.service';
import {LayoutComponent} from './shared/partials/layout/layout.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, LayoutComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  readonly notificationService = inject(NotificationService);
}
