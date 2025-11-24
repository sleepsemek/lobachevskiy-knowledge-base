import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'fq-dialog',
  imports: [],
  templateUrl: './fq-dialog.component.html',
  styleUrl: './fq-dialog.component.scss',
})
export class FqDialogComponent implements AfterViewInit {
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();

  @ViewChild('dialog') dialogRef!: ElementRef<HTMLDivElement>;

  private previouslyFocused: HTMLElement | null = null;

  ngAfterViewInit(): void {
    if (this.open) {
      this.focusFirstElement();
    }
  }

  ngOnChanges(): void {
    if (this.open) {
      setTimeout(() => this.focusFirstElement());
    }
  }

  private focusFirstElement(): void {
    this.previouslyFocused = document.activeElement as HTMLElement;

    const dialog = this.dialogRef?.nativeElement;
    if (!dialog) return;

    const focusable = dialog.querySelector<HTMLElement>(
      'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );

    focusable?.focus();
  }

  close(): void {
    this.open = false;
    this.closed.emit();
    this.previouslyFocused?.focus();
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this.open) {
      this.close();
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleTab(event: KeyboardEvent) {
    if (!this.open || event.key !== 'Tab') return;

    const dialog = this.dialogRef.nativeElement;

    const focusable = Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(el => !el.hasAttribute('disabled'));

    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }
}
