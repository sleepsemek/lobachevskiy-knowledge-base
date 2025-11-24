import {Component, EventEmitter, inject, Input, Output, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FqDialogComponent } from '../../../shared/ui/fq-dialog/fq-dialog.component';
import { FqButtonComponent } from '../../../shared/ui/fq-button/fq-button.component';
import {FqSelect, SelectOption} from '../../../shared/ui/fq-select/fq-select.component';
import {environment} from '../../../../environments/environment';
import {ApiService} from '../../../core/services/api.service';

export interface Collection {
  id: number;
  name: string;
  description?: string;
}

@Component({
  selector: 'app-add-to-collection-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FqDialogComponent,
    ReactiveFormsModule,
    FqButtonComponent,
    FqSelect
  ],
  templateUrl: './add-to-collection-dialog.component.html',
  styleUrl: './add-to-collection-dialog.component.scss',
})
export class AddToCollectionDialogComponent implements OnInit, OnChanges {
  @Input() open = false;
  @Input() documentId!: string;
  @Output() save = new EventEmitter<{ collectionId: number }>();
  @Output() closed = new EventEmitter<void>();
  @Input() saving: boolean = false;

  form: FormGroup;
  collections: SelectOption[] = [];
  loading = false;
  error = '';

  private fb = inject(FormBuilder);
  private api = inject(ApiService);

  constructor() {
    this.form = this.fb.group({
      collectionId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.open) {
      this.loadCollections();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['open'] && this.open && this.collections.length === 0) {
      this.loadCollections();
    }
  }

  loadCollections(): void {
    this.loading = true;
    this.error = '';

    this.api.get<Collection[]>(`${environment.apiUrl}/collections`).subscribe({
      next: (collections) => {
        this.collections = collections.map(collection => ({
          id: collection.id,
          name: collection.name
        }));
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Не удалось загрузить список подборок';
        this.loading = false;
        console.error('Error loading collections:', error);
      }
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.save.emit({
        collectionId: this.form.value.collectionId
      });
    }
  }

  onClosed(): void {
    this.form.reset();
    this.error = '';
    this.closed.emit();
  }

  onOpenChange(open: boolean): void {
    if (open && this.collections.length === 0) {
      this.loadCollections();
    }
  }
}
