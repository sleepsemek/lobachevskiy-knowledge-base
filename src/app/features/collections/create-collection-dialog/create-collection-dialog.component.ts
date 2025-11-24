import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CreateCollectionRequest} from '../../../entities/collections/collection.model';
import {FqDialogComponent} from '../../../shared/ui/fq-dialog/fq-dialog.component';
import {FqInputComponent} from '../../../shared/ui/fq-input/fq-input.component';
import {FqButtonComponent} from '../../../shared/ui/fq-button/fq-button.component';

@Component({
  selector: 'app-create-collection-dialog',
  imports: [
    FqDialogComponent,
    FqInputComponent,
    ReactiveFormsModule,
    FqButtonComponent
  ],
  templateUrl: './create-collection-dialog.component.html',
  styleUrl: './create-collection-dialog.component.scss',
})
export class CreateCollectionDialogComponent {
  @Input() open = false;
  @Output() save = new EventEmitter<CreateCollectionRequest>();
  @Output() closed = new EventEmitter<void>();
  @Input() saving: boolean = false;

  form: FormGroup;
  private fb = inject(FormBuilder);

  constructor() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.save.emit(this.form.value as CreateCollectionRequest);
    }
  }

  onClosed(): void {
    this.form.reset();
    this.closed.emit();
  }
}
