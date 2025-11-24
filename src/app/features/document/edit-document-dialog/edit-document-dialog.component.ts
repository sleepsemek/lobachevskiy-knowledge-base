import {Component, EventEmitter, Input, Output, OnChanges} from '@angular/core';
import {FqButtonComponent} from "../../../shared/ui/fq-button/fq-button.component";
import {FqDialogComponent} from "../../../shared/ui/fq-dialog/fq-dialog.component";
import {FqInputComponent} from "../../../shared/ui/fq-input/fq-input.component";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {DocumentMeta} from '../../../entities/document/document.model';

@Component({
  selector: 'app-edit-document-dialog',
  imports: [
    FqButtonComponent,
    FqDialogComponent,
    FqInputComponent,
    ReactiveFormsModule
  ],
  templateUrl: './edit-document-dialog.component.html',
  styleUrl: './edit-document-dialog.component.scss',
})
export class EditDocumentDialogComponent implements OnChanges {
  @Input() document: DocumentMeta | null = null;
  @Input() open = false;
  @Output() save = new EventEmitter<DocumentMeta>();
  @Output() closed = new EventEmitter<void>();
  @Input() saving: boolean = false;

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      department_id: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      access_levels: ['', Validators.required],
      tags: ['', Validators.required],
      comment: ['', Validators.required],
    });
  }

  ngOnChanges(): void {
    if (this.document) {
      this.form.patchValue({
        title: this.document.title,
        department_id: this.document.department_id,
        category: this.document.category,
        access_levels: Array.isArray(this.document.access_levels)
          ? this.document.access_levels.join(', ')
          : this.document.access_levels,
        tags: Array.isArray(this.document.tags)
          ? this.document.tags.join(', ')
          : this.document.tags,
        comment: this.document.comment,
      });
    }
  }

  submit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;

      const documentData: DocumentMeta = {
        ...formValue,
        access_levels: this.parseStringToArray(formValue.access_levels),
        tags: this.parseStringToArray(formValue.tags)
      };

      this.save.emit(documentData);
    }
  }

  private parseStringToArray(value: string): string[] {
    if (!value) return [];
    return value.split(',').map(item => item.trim()).filter(item => item.length > 0);
  }
}
