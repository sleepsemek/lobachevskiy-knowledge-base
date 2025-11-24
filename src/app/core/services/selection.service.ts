import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SelectionService {

  getSelectedText(): string {
    if (window.getSelection) {
      return window.getSelection()?.toString() || '';
    }
    return '';
  }

  getSelectionRange(): Range | null {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      return selection.getRangeAt(0);
    }
    return null;
  }

  clearSelection(): void {
    if (window.getSelection) {
      window.getSelection()?.removeAllRanges();
    }
  }

  addCustomContentToClipboard(originalText: string, customContent: string): string {
    const documentInfo = this.getDocumentInfo();
    const timestamp = new Date().toLocaleString('ru-RU');

    return `${originalText}
              Скопировано из документа: ${documentInfo.title}
              Автор: ${documentInfo.author}
              Дата копирования: ${timestamp}
              ${customContent}`;
  }

  private getDocumentInfo(): { title: string; author: string } {
    return {
      title: document.title || 'Неизвестный документ',
      author: 'Система документооборота'
    };
  }
}
