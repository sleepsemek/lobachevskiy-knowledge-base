import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Document } from '../../entities/document/document.model';

@Injectable({ providedIn: 'root' })
export class DocumentsService {
  private readonly currentDocument = signal<Document | null>(null);
  private readonly documentLoading = signal(false);
  private readonly documentError = signal<string>('');

  readonly document = this.currentDocument.asReadonly();
  readonly loading = this.documentLoading.asReadonly();
  readonly error = this.documentError.asReadonly();

  constructor(private http: HttpClient) {}

  getDocument(id: string) {
    return this.http.get<Document>(`${environment.apiUrl}/documents/${id}`);
  }

  getDocumentPreview(id: string) {
    return this.http.get(`${environment.apiUrl}/documents/${id}/preview`, {
      responseType: 'blob'
    });
  }

  downloadDocument(id: string) {
    return this.http.get(`${environment.apiUrl}/documents/${id}/download`, {
      responseType: 'blob',
      observe: 'response'
    });
  }
}
