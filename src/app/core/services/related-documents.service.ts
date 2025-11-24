import { inject, Injectable } from "@angular/core";
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { RelatedDocument } from "../../entities/document/document.model";

@Injectable({
  providedIn: 'root'
})
export class RelatedDocumentsService {
  private api = inject(ApiService);

  getRelatedDocuments(documentId: string): Observable<RelatedDocument[]> {
    return this.api.get<RelatedDocument[]>(
      `${environment.apiUrl}/documents/${documentId}/similar`
    );
  }
}
