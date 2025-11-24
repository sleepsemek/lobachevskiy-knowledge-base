import {Component, computed, inject, signal} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {RelatedDocument} from '../../../entities/document/document.model';
import {RelatedDocumentsService} from '../../../core/services/related-documents.service';
import {FqInputComponent} from '../../../shared/ui/fq-input/fq-input.component';
import {FqBadgeComponent} from '../../../shared/ui/fq-badge/fq-badge.component';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-related-document-page',
  imports: [
    FqInputComponent,
    FqBadgeComponent,
    DatePipe,
    RouterLink
  ],
  templateUrl: './related-documents-page.component.html',
  styleUrl: './related-documents-page.component.scss',
})
export class RelatedDocumentsPageComponent {
  private route = inject(ActivatedRoute);
  private relatedDocumentsService = inject(RelatedDocumentsService);

  documents = signal<RelatedDocument[]>([]);
  loading = signal(true);
  searchQuery = signal('');

  filteredDocuments = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const docs = this.documents();

    if (!query) {
      return docs;
    }

    return docs.filter(doc =>
      doc.title.toLowerCase().includes(query)
    );
  })

  ngOnInit(): void {
    const documentId = this.route.snapshot.paramMap.get('id');

    if (documentId) {
      this.loadRelatedDocuments(documentId);
    }
  }

  private loadRelatedDocuments(documentId: string): void {
    this.loading.set(true);

    this.relatedDocumentsService.getRelatedDocuments(documentId).subscribe({
      next: (documents) => {
        this.documents.set(documents);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading related documents:', error);
        this.loading.set(false);
        this.documents.set([]);
      }
    });
  }

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
  }
}
