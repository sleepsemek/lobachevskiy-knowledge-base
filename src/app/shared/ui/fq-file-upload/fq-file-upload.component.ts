import {Component, Output, EventEmitter, HostListener, Input, ViewChild, ElementRef} from '@angular/core';

export interface UploadedFileItem {
  file: File;
  id: string;
}

@Component({
  selector: 'fq-file-upload',
  templateUrl: './fq-file-upload.component.html',
  styleUrl: './fq-file-upload.component.scss'
})
export class FqFileUploadComponent {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  isDragOver = false;
  uploadedFile: UploadedFileItem | null = null;
  validationErrors: string[] = [];

  @Input() maxFileSize = 20 * 1024 * 1024; // 20 мегов
  @Input() allowedExtensions = ['pdf', 'docx', 'odf', 'odt', 'png', 'jpg', 'html'];
  @Output() fileSelected = new EventEmitter<UploadedFileItem | null>();

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    if (!event.dataTransfer?.files) return;
    this.processFile(event.dataTransfer.files[0]);
  }

  triggerFileInput(): void {
    const input: HTMLElement | null = document.getElementById('fileInput');
    input?.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.uploadedFile = file ? { file, id: crypto.randomUUID() } : null;
    this.fileSelected.emit(this.uploadedFile);
  }

  private processFile(file: File) {
    this.validationErrors = [];

    const ext = this.getExtension(file.name);
    if (!this.allowedExtensions.includes(ext)) {
      this.validationErrors.push(`Формат файла "${file.name}" не поддерживается`);
      this.fileSelected.emit(null);
      return;
    }

    if (file.size > this.maxFileSize) {
      this.validationErrors.push(
        `Файл "${file.name}" превышает максимальный размер (${this.formatFileSize(this.maxFileSize)})`
      );
      this.fileSelected.emit(null);
      return;
    }

    this.uploadedFile = { file, id: crypto.randomUUID() };
    this.fileSelected.emit(this.uploadedFile);
  }

  removeFile(): void {
    this.uploadedFile = null;
    this.fileSelected.emit(null);
  }

  reset() {
    this.uploadedFile = null;
    this.fileSelected.emit(null);
    this.fileInputRef.nativeElement.value = '';
  }

  private getExtension(name: string): string {
    return name.split('.').pop()?.toLowerCase() || '';
  }

  formatFileSize(size: number): string {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / 1024 / 1024).toFixed(1)} MB`;
  }
}

