import {Component, inject, OnInit, signal, computed} from '@angular/core';
import {DatePipe} from '@angular/common';
import {FqBadgeComponent} from '../../shared/ui/fq-badge/fq-badge.component';
import {FqButtonComponent} from '../../shared/ui/fq-button/fq-button.component';
import {FqInputComponent} from '../../shared/ui/fq-input/fq-input.component';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {Collection, CreateCollectionRequest} from '../../entities/collections/collection.model';
import {CollectionService} from '../../core/services/collections.service';
import {CreateCollectionDialogComponent} from './create-collection-dialog/create-collection-dialog.component';

@Component({
  selector: 'app-collections',
  imports: [
    RouterLink,
    FqBadgeComponent,
    FqButtonComponent,
    FqInputComponent,
    ReactiveFormsModule,
    DatePipe,
    CreateCollectionDialogComponent
  ],
  templateUrl: './collections-page.component.html',
  styleUrl: './collections-page.component.scss',
})
export class CollectionsPageComponent implements OnInit {
  private collectionService = inject(CollectionService);
  private fb = inject(FormBuilder);

  allCollections = signal<Collection[]>([]);
  searchQuery = signal<string>('');

  filteredCollections = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const collections = this.allCollections();

    if (!query) {
      return collections;
    }

    return collections.filter(collection =>
      collection.name.toLowerCase().includes(query) ||
      collection.documents.some(doc =>
        doc.title.toLowerCase().includes(query)
      ) ||
      collection.documents.some(doc =>
        doc.tags.some(tag => tag.toLowerCase().includes(query))
      )
    );
  });

  expandedCollections = signal<Set<string>>(new Set());
  loading = signal(false);
  creating = signal(false);
  error = signal<string | null>(null);
  showCreateDialog = signal(false);

  ngOnInit(): void {
    this.loadCollections();
  }

  loadCollections(): void {
    this.loading.set(true);
    this.error.set(null);

    this.collectionService.getCollections().subscribe({
      next: (collections) => {
        this.allCollections.set(collections);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set('Не удалось загрузить подборки');
        this.loading.set(false);
        console.error('Error loading collections:', error);
      }
    });
  }

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
  }

  isExpanded(collectionId: string): boolean {
    return this.expandedCollections().has(collectionId);
  }

  toggleCollection(collectionId: string): void {
    const expanded = new Set(this.expandedCollections());
    if (expanded.has(collectionId)) {
      expanded.delete(collectionId);
    } else {
      expanded.add(collectionId);
    }
    this.expandedCollections.set(expanded);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  openCreateDialog(): void {
    this.showCreateDialog.set(true);
  }

  closeCreateDialog(): void {
    this.showCreateDialog.set(false);
  }

  createCollection(collectionData: CreateCollectionRequest): void {
    this.creating.set(true);

    this.collectionService.createCollection(collectionData).subscribe({
      next: (newCollection) => {
        this.allCollections.update(collections => [...collections, newCollection]);
        this.creating.set(false);
        this.showCreateDialog.set(false);
      },
      error: (error) => {
        this.error.set('Не удалось создать подборку');
        this.creating.set(false);
        console.error('Error creating collection:', error);
      }
    });
  }
}
