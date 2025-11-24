import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { UploadedFileItem } from '../../shared/ui/fq-file-upload/fq-file-upload.component';
import { NotificationService } from './notification.service';

export interface UploadPayload {
  title: string;
  department_id: number;
  tags: string[] | null;
  files: UploadedFileItem[];
}

@Injectable({ providedIn: 'root' })
export class UploadService {
  private notifications = inject(NotificationService);

  constructor(private apiService: ApiService) {}

  uploadDocument(data: UploadPayload): Observable<any> {
    const form = new FormData();

    form.append('title', data.title);
    form.append('department_id', String(data.department_id));
    form.append('tags', JSON.stringify(data.tags ?? []));

    const firstFile = data.files[0]?.file;

    if (firstFile) {
      form.append('file', firstFile);
    }

    return this.apiService
      .post(`${environment.apiUrl}/documents/upload`, form)
      .pipe(
        tap(() => {
          this.notifications.success('Документ успешно загружен');
        }),
        catchError(err => {
          this.notifications.error('Не удалось загрузить документ');
          return throwError(() => err);
        })
      );
  }
}
