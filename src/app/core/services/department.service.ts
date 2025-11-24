import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Department } from '../../entities/departments/department.model';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  readonly departments = signal<Department[]>([]);
  readonly loadingDepartments = signal<boolean>(false);

  constructor(private apiService: ApiService) {}

  loadDepartments(): Observable<Department[]> {
    this.loadingDepartments.set(true);

    return this.apiService.get<Department[]>(`${environment.apiUrl}/departments`).pipe(
      tap({
        next: (departments) => {
          this.departments.set(departments);
          this.loadingDepartments.set(false);
        },
        error: (error) => {
          console.error('Ошибка загрузки подразделений:', error);
          this.loadingDepartments.set(false);
          this.departments.set([]);
        }
      })
    );
  }
}
