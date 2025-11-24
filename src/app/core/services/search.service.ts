import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SearchResult, SearchRequest, SearchResponse } from '../../entities/search/search.model';
import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private readonly searchResults = signal<SearchResult[]>([]);
  private readonly searchLoading = signal(false);
  private readonly currentQueryId = signal<string | null>(null);
  private readonly currentSummary = signal<string | null>(null);

  readonly results = this.searchResults.asReadonly();
  readonly loading = this.searchLoading.asReadonly();
  readonly queryId = this.currentQueryId.asReadonly();
  readonly summary =this.currentSummary.asReadonly();

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
  ) {}

  search(request: SearchRequest) {
    this.searchLoading.set(true);

    this.http.post<SearchResponse>(`${environment.apiUrl}/documents/search`, {
      ...request,
      query: request.query,
      date_from: request.date_from,
      date_to: request.date_to,
      department_ids: request.department_ids,
      only_active: request.only_active
    }).subscribe({
      next: (response) => {
        this.searchResults.set(response.items);
        this.currentQueryId.set(response.query_id);
        this.searchLoading.set(false);
        this.currentSummary.set(response.answer);

        if (response.items.length === 0) {
          this.notificationService.error('Попробуйте изменить ваш запрос', 'В базе документов не нашлось ничего подходящего');
        }
      },
      error: (error) => {
        this.notificationService.error(
          error.error?.detail?.[0]?.msg ?? error.error?.message ?? error.message,
          'Ошибка при поиске'
        );
        this.searchLoading.set(false);
        console.error('Search error:', error);
      }
    });
  }

  clearResults() {
    this.searchResults.set([]);
    this.currentQueryId.set(null);
  }
}
