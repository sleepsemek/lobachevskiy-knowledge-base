import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FqAvatarComponent } from "../../shared/ui/fq-avatar/fq-avatar.component";
import { User } from '../../entities/user/user.model';

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [CommonModule, FqAvatarComponent],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss',
})
export class UserMenuComponent {
  @Input() user: User | null = null;

  @Output() profile = new EventEmitter<void>();
  @Output() settings = new EventEmitter<void>();
  @Output() collections = new EventEmitter<void>();
  @Output() upload = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  @ViewChild('trigger') trigger!: ElementRef<HTMLButtonElement>;
  @ViewChild('menu') menu!: ElementRef<HTMLDivElement>;

  isOpen = false;

  constructor(private host: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (!this.host.nativeElement.contains(event.target)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.close(true);
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    this.isOpen = true;

    setTimeout(() => {
      const items = this.getMenuItems();
      items?.[0]?.focus();
      this.menu?.nativeElement?.focus();
    });
  }

  close(focusTrigger = false) {
    if (!this.isOpen) return;
    this.isOpen = false;

    if (focusTrigger) {
      setTimeout(() => this.trigger?.nativeElement?.focus());
    }
  }

  select(action: 'profile' | 'settings' | 'collections' | 'upload' | 'logout') {
    switch (action) {
      case 'profile':
        this.profile.emit();
        break;
      case 'settings':
        this.settings.emit();
        break;
      case 'logout':
        this.logout.emit();
        break;
      case 'collections':
        this.collections.emit();
        break;
      case 'upload':
        this.upload.emit();
        break;

    }
    this.close(true);
  }

  onMenuKeydown(event: KeyboardEvent) {
    const items = this.getMenuItems();
    if (!items) return;

    const current = event.target as HTMLElement;
    const index = items.indexOf(current);

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        items[(index + 1) % items.length].focus();
        break;
      case 'ArrowUp':
        event.preventDefault();
        items[(index - 1 + items.length) % items.length].focus();
        break;
      case 'Home':
        event.preventDefault();
        items[0].focus();
        break;
      case 'End':
        event.preventDefault();
        items[items.length - 1].focus();
        break;
      case 'Escape':
        event.preventDefault();
        this.close(true);
        break;
      case 'Tab':
        this.close();
        break;
    }
  }

  private getMenuItems(): HTMLElement[] {
    if (!this.menu) return [];
    return Array.from(
      this.menu.nativeElement.querySelectorAll<HTMLElement>('button[role="menuitem"], a[role="menuitem"]')
    );
  }
}
