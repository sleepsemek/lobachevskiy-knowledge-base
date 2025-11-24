import {inject, Injectable } from "@angular/core";
import {ApiService} from './api.service';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {Collection, CreateCollectionRequest} from '../../entities/collections/collection.model';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  private api = inject(ApiService);

  getCollections(): Observable<Collection[]> {
    return this.api.get<Collection[]>(`${environment.apiUrl}/collections`);
  }

  createCollection(collection: CreateCollectionRequest): Observable<Collection> {
    return this.api.post<Collection>(`${environment.apiUrl}/collections`, collection);
  }
}
