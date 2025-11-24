import {Component, inject, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FqButtonComponent } from '../../shared/ui/fq-button/fq-button.component';
import { FqInputComponent } from '../../shared/ui/fq-input/fq-input.component';
import { FqFileUploadComponent, UploadedFileItem } from '../../shared/ui/fq-file-upload/fq-file-upload.component';
import { UploadService } from '../../core/services/upload.service';
import {FqSelect} from '../../shared/ui/fq-select/fq-select.component';
import {DepartmentService} from '../../core/services/department.service';

@Component({
  selector: 'app-upload-page',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    FqButtonComponent,
    FqInputComponent,
    FqFileUploadComponent,
    FqSelect
  ],
  templateUrl: './upload-page.component.html',
  styleUrl: './upload-page.component.scss',
})
export class UploadPageComponent implements OnInit {
  @ViewChild('fileUploadComponent') fileUploadComponent!: FqFileUploadComponent;
  loading = false;

  private fb = inject(FormBuilder);
  private uploadService = inject(UploadService);
  private departmentService = inject(DepartmentService);
  readonly departments = this.departmentService.departments;
  readonly loadingDepartments = this.departmentService.loadingDepartments;

  ngOnInit(): void {
    this.departmentService.loadDepartments().subscribe();
  }

  form = this.fb.group({
    title: this.fb.control<string>('', Validators.required),
    department_id: this.fb.control<number | null>(null, Validators.required),
    tags: this.fb.control<string>(''),
    files: this.fb.control<UploadedFileItem[]>([], Validators.required),
  });

  uploadedFile: UploadedFileItem | null = null;

  onFileSelected(file: UploadedFileItem | null) {
    this.uploadedFile = file;
    this.form.patchValue({ files: file ? [file] : [] });
  }

  onSubmit() {
    if (this.form.invalid || !this.uploadedFile) return;

    this.loading = true;

    this.uploadService.uploadDocument({
      title: this.form.value.title!,
      department_id: Number(this.form.value.department_id),
      tags: this.form.value.tags?.split(',').map(t => t.trim()).filter(Boolean) ?? null,
      files: [this.uploadedFile]
    }).subscribe({
      next: () => {
        this.loading = false;
        this.form.reset();
        this.uploadedFile = null;
        this.fileUploadComponent.reset();
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
      }
    });
  }
}
