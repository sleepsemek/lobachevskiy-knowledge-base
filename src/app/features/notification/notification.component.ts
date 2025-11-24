import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import {NotificationService} from '../../core/services/notification.service';

@Component({
  selector: 'notification-container',
  standalone: true,
  imports: [NgClass],
  templateUrl: 'notification.component.html',
  styleUrl: 'notification.component.scss'
})
export class NotificationContainerComponent {
  notificationService = inject(NotificationService);

  dismiss(id: string) {
    this.notificationService.dismiss(id);
  }
}
