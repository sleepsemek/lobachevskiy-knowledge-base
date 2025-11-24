import {Injectable, signal} from '@angular/core';
import {ApiService} from './api.service';
import {Observable, tap} from 'rxjs';
import {environment} from '../../../environments/environment';
import {FileTypes} from '../../entities/document/document.model';

@Injectable({
  providedIn: 'root'
})
export class FileTypesService {
  readonly fileTypes = signal<FileTypes | null>(null);
  readonly loadingFileTypes = signal<boolean>(false);

  constructor(private apiService: ApiService) {}

  loadFileTypes(): Observable<FileTypes> {
    this.loadingFileTypes.set(true);

    return this.apiService.get<FileTypes>(`${environment.apiUrl}/documents/file-type/get`).pipe(
      tap({
        next: (fileTypes) => {
          this.fileTypes.set(fileTypes);
          this.loadingFileTypes.set(false);
        },
        error: (error) => {
          console.error('Ошибка загрузки типов файлов:', error);
          this.loadingFileTypes.set(false);
          this.fileTypes.set(null);
        }
      })
    );
  }
}
