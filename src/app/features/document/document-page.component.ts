import { Component, inject, OnInit, signal, OnDestroy, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DocumentsService } from '../../core/services/documents.service';
import { Document } from '../../entities/document/document.model';
import { FqButtonComponent } from '../../shared/ui/fq-button/fq-button.component';
import { FqCardComponent } from '../../shared/ui/fq-card/fq-card.component';
import { FqBadgeComponent } from '../../shared/ui/fq-badge/fq-badge.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import {ApiService} from '../../core/services/api.service';
import {AddToCollectionDialogComponent} from './add-to-collection-dialog/add-to-collection-dialog.component';
import {environment} from '../../../environments/environment';
import {UnderscorePipe} from '../../core/pipes/underscore.pipe';

@Component({
  selector: 'app-document-page',
  standalone: true,
  imports: [DatePipe, FqButtonComponent, FqCardComponent, FqBadgeComponent, PdfViewerModule, DecimalPipe, AddToCollectionDialogComponent, UnderscorePipe],
  providers: [DatePipe],
  templateUrl: 'document-page.component.html',
  styleUrl: 'document-page.component.scss',
})
export class DocumentPageComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private documentsService = inject(DocumentsService);
  private sanitizer = inject(DomSanitizer);
  private api = inject(ApiService);
  private elementRef = inject(ElementRef);

  readonly showAddToCollectionDialog = signal(false);
  readonly addingToCollection = signal(false);

  readonly document = signal<Document | null>(null);
  readonly loading = signal(true);
  readonly downloading = signal(false);
  readonly error = signal<string>('');
  readonly safePreviewUrl = signal<string>('');
  readonly safeHtmlUrl = signal<SafeResourceUrl>('');

  readonly zoom = signal(1);
  readonly htmlZoom = signal(1);
  readonly page = signal(1);
  readonly totalPages = signal<number>(0);

  readonly selectedText = signal<string>('');
  readonly showSelectionToolbar = signal<boolean>(false);
  readonly selectionPosition = signal<{x: number, y: number}>({x: 0, y: 0});

  ngOnInit() {
    const documentId = this.route.snapshot.paramMap.get('id');
    if (documentId) {
      this.loadDocument(documentId);
    } else {
      this.error.set('ID документа не указан');
      this.loading.set(false);
    }

    document.addEventListener('click', this.handleClickOutside.bind(this));
  }

  loadDocument(id: string) {
    this.loading.set(true);
    this.documentsService.getDocument(id).subscribe({
      next: (doc) => {
        this.document.set(doc);
        if (this.isHtmlDocument()) {
          this.loadHtmlDocument(doc.document_id);
        } else {
          this.loadDocumentPreview(doc.document_id);
        }
      },
      error: (error) => {
        this.error.set('Не удалось загрузить документ');
        this.loading.set(false);
        console.error('Error loading document:', error);
      }
    });
  }

  private loadDocumentPreview(documentId: string) {
    this.documentsService.getDocumentPreview(documentId).subscribe({
      next: (blob) => {
        const blobUrl = URL.createObjectURL(blob);
        this.safePreviewUrl.set(blobUrl);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set('Не удалось загрузить превью документа');
        this.loading.set(false);
        console.error('Error loading preview:', error);
      }
    });
  }

  private loadHtmlDocument(documentId: string) {
    this.documentsService.getDocumentPreview(documentId).subscribe({
      next: (content) => {
        const blob = new Blob([content], { type: 'text/html' });
        const blobUrl = URL.createObjectURL(blob);
        this.safeHtmlUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl));
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set('Не удалось загрузить HTML документ');
        this.loading.set(false);
        console.error('Error loading HTML document:', error);
      }
    });
  }

  onTextSelection(): void {
    console.log('onTextSelection вызван');

    const selectedText = this.getSelectedText();
    console.log('Выделенный текст:', selectedText);

    if (selectedText.trim().length > 0) {
      this.selectedText.set(selectedText);

      const position = this.getSelectionPosition();
      console.log('Позиция выделения:', position);

      this.selectionPosition.set(position);
      this.showSelectionToolbar.set(true);
    } else {
      this.showSelectionToolbar.set(false);
    }
  }

  private getSelectedText(): string {
    if (window.getSelection) {
      return window.getSelection()?.toString() || '';
    }
    return '';
  }

  private getSelectionPosition(): {x: number, y: number} {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      return {
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY - 40
      };
    }

    return {
      x: window.innerWidth / 2 - 100,
      y: window.innerHeight / 2
    };
  }

  onCopy(event: ClipboardEvent): void {
    console.log('onCopy вызван');

    const selectedText = this.getSelectedText();
    console.log('Текст для копирования:', selectedText);

    if (selectedText.trim().length > 0) {
      event.preventDefault();

      const enhancedText = this.addCustomContentToClipboard(selectedText);
      console.log('Улучшенный текст:', enhancedText);

      event.clipboardData?.setData('text/plain', enhancedText);

      this.showCopyNotification();
    }
  }

  private addCustomContentToClipboard(originalText: string): string {
    const doc = this.document();
    if (!doc) return originalText;

    const timestamp = new Date().toLocaleString('ru-RU');
    const customContent = [
      `Скопировано из документа: ${doc.title || 'Без названия'}`,
      `Дата копирования: ${timestamp}`,
    ].join('\n');

    return `${originalText}\n\n${customContent}`;
  }

  onIframeLoad(event: Event): void {

    const iframe = event.target as HTMLIFrameElement;
    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

      if (iframeDoc) {

        iframeDoc.addEventListener('mouseup', this.handleIframeSelection.bind(this));
        iframeDoc.addEventListener('copy', this.handleIframeCopy.bind(this));

        iframeDoc.body.addEventListener('click', this.handleIframeClick.bind(this));
      }
    } catch {}
  }

  private handleIframeSelection(event: Event): void {
    console.log('Выделение в iframe');

    try {
      const iframe = event.target as HTMLIFrameElement;
      const iframeDoc = iframe.ownerDocument || iframe.contentDocument || iframe.contentWindow?.document;
      const iframeSelection = iframeDoc?.getSelection();

      if (iframeSelection && iframeSelection.toString().trim().length > 0) {
        const selectedText = iframeSelection.toString();

        this.selectedText.set(selectedText);

        const position = this.getIframeSelectionPosition(iframe);
        this.selectionPosition.set(position);
        this.showSelectionToolbar.set(true);
      }
    } catch {}
  }

  private handleIframeCopy(event: ClipboardEvent): void {

    try {
      const iframe = event.target as HTMLIFrameElement;
      const iframeDoc = iframe.ownerDocument || iframe.contentDocument || iframe.contentWindow?.document;
      const iframeSelection = iframeDoc?.getSelection();

      if (iframeSelection && iframeSelection.toString().trim().length > 0) {
        event.preventDefault();

        const selectedText = iframeSelection.toString();
        const enhancedText = this.addCustomContentToClipboard(selectedText);

        event.clipboardData?.setData('text/plain', enhancedText);
        this.showCopyNotification();
      }
    } catch {}
  }

  private handleIframeClick(event: Event): void {
    console.log('Клик в iframe');
    setTimeout(() => {
      this.handleIframeSelection(event);
    }, 100);
  }

  private getIframeSelectionPosition(iframe: HTMLIFrameElement): {x: number, y: number} {
    try {
      const iframeDoc = iframe.ownerDocument || iframe.contentDocument || iframe.contentWindow?.document;
      const iframeSelection = iframeDoc?.getSelection();

      if (iframeSelection && iframeSelection.rangeCount > 0) {
        const range = iframeSelection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        const iframeRect = iframe.getBoundingClientRect();

        return {
          x: iframeRect.left + rect.left + window.scrollX,
          y: iframeRect.top + rect.top + window.scrollY - 40
        };
      }
    } catch (error) {
      console.warn('Не удалось получить позицию выделения в iframe:', error);
    }

    return {
      x: window.innerWidth / 2 - 100,
      y: window.innerHeight / 2
    };
  }

  onAddToFavorites(): void {
    const text = this.selectedText();
    if (text.trim().length > 0) {
      console.log('Добавлено в избранное:', text);
      this.clearSelection();
      this.showSelectionToolbar.set(false);
    }
  }

  onAddComment(): void {
    const text = this.selectedText();
    if (text.trim().length > 0) {
      console.log('Добавление комментария к тексту:', text);
      this.clearSelection();
      this.showSelectionToolbar.set(false);
    }
  }

  private clearSelection(): void {
    if (window.getSelection) {
      window.getSelection()?.removeAllRanges();
    }
  }

  private showCopyNotification(): void {
    console.log('Текст скопирован с дополнительной информацией');
  }

  private handleClickOutside(event: MouseEvent): void {
    const toolbar = document.querySelector('.selection-toolbar');
    if (toolbar && !toolbar.contains(event.target as Node)) {
      this.showSelectionToolbar.set(false);
    }
  }

  downloadDocument() {
    const doc = this.document();
    if (!doc) return;

    this.downloading.set(true);
    this.documentsService.downloadDocument(doc.document_id).subscribe({
      next: (response) => {
        const blob = response.body;
        const filename = this.getFilenameFromResponse(response) || doc.file_name;
        if (blob) {
          this.downloadFile(blob, filename);
        } else {
          this.error.set('Не удалось получить файл для скачивания');
        }
        this.downloading.set(false);
      },
      error: (error) => {
        this.error.set('Ошибка при скачивании документа');
        this.downloading.set(false);
        console.error('Download error:', error);
      }
    });
  }

  private downloadFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  ngOnDestroy() {
    const currentUrl = this.safePreviewUrl();
    if (currentUrl && currentUrl.startsWith('blob:')) {
      URL.revokeObjectURL(currentUrl);
    }

    const htmlUrl = this.safeHtmlUrl();
    if (htmlUrl && typeof htmlUrl === 'string' && htmlUrl.startsWith('blob:')) {
      URL.revokeObjectURL(htmlUrl);
    }

    document.removeEventListener('click', this.handleClickOutside.bind(this));
  }

  goBack() {
    this.router.navigate(['/']);
  }

  private getFilenameFromResponse(response: any): string | null {
    const contentDisposition = response.headers.get('Content-Disposition');
    if (contentDisposition) {
      const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (match && match[1]) return match[1].replace(/['"]/g, '');
    }
    return null;
  }

  zoomIn() {
    if (this.isPdfDocument()) {
      const next = this.zoom() + 0.25;
      if (next <= 4) this.zoom.set(next);
    } else if (this.isHtmlDocument()) {
      const next = this.htmlZoom() + 0.1;
      if (next <= 2) this.htmlZoom.set(next);
    }
  }

  zoomOut() {
    if (this.isPdfDocument()) {
      const next = this.zoom() - 0.25;
      if (next >= 0.5) this.zoom.set(next);
    } else if (this.isHtmlDocument()) {
      const next = this.htmlZoom() - 0.1;
      if (next >= 0.5) this.htmlZoom.set(next);
    }
  }

  nextPage() {
    if (!this.totalPages()) return;
    if (this.page() < this.totalPages()!) {
      this.page.update(p => p + 1);
    }
  }

  prevPage() {
    if (this.page() > 1) {
      this.page.update(p => p - 1);
    }
  }

  onPdfLoaded(pdf: any) {
    this.totalPages.set(pdf.numPages);
  }

  isPdfDocument(): boolean {
    const fileName = this.document()?.file_name?.toLowerCase() || '';
    return fileName.endsWith('.pdf');
  }

  isHtmlDocument(): boolean {
    const fileName = this.document()?.file_name?.toLowerCase() || '';
    return fileName.endsWith('.html') || fileName.endsWith('.htm');
  }

  getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toUpperCase() || 'FILE';
  }

  onAddToCollectionClick(): void {
    this.showAddToCollectionDialog.set(true);
  }

  onAddToCollection(event: { collectionId: number }): void {
    this.addingToCollection.set(true);

    this.api.post(`${environment.apiUrl}/collections/${event.collectionId}/items`, {
      document_id: this.document()?.document_id}).subscribe({
      next: () => {
        this.addingToCollection.set(false);
        this.showAddToCollectionDialog.set(false);
        console.log('Документ успешно добавлен в коллекцию');
      },
      error: (error) => {
        this.addingToCollection.set(false);
        console.error('Ошибка при добавлении в коллекцию:', error);
      }
    });
  }

  onAddToCollectionDialogClosed(): void {
    this.showAddToCollectionDialog.set(false);
  }

  toRelated() {
    this.router.navigate(['documents/related', this.document()?.document_id]);
  }
}
