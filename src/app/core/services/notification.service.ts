import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly notifications = signal<Notification[]>([]);

  readonly currentNotifications = this.notifications.asReadonly();

  show(notification: Omit<Notification, 'id'>) {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotification: Notification = { ...notification, id };

    this.notifications.update(notifications => [...notifications, newNotification]);

    if (notification.duration !== 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, notification.duration || 5000);
    }
  }

  dismiss(id: string) {
    this.notifications.update(notifications =>
      notifications.filter(n => n.id !== id)
    );
  }

  success(message: string, title?: string) {
    this.show({ type: 'success', title: title || 'Успех', message });
  }

  error(message: string, title?: string) {
    this.show({ type: 'error', title: title || 'Ошибка', message });
  }

  warning(message: string, title?: string) {
    this.show({ type: 'warning', title: title || 'Предупреждение', message });
  }

  info(message: string, title?: string) {
    this.show({ type: 'info', title: title || 'Информация', message });
  }
}
