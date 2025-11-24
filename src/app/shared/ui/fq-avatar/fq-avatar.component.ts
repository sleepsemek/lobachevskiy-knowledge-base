import {Component, computed, Input} from '@angular/core';

@Component({
  selector: 'fq-avatar',
  imports: [],
  templateUrl: './fq-avatar.component.html',
  styleUrl: './fq-avatar.component.scss',
})
export class FqAvatarComponent {
  @Input() firstName: string = '';
  @Input() lastName: string = '';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  initials = computed(() => {
    const first = this.firstName?.charAt(0) || '';
    const last = this.lastName?.charAt(0) || '';
    return `${first}${last}`.toUpperCase();
  });

  onClick() {

  }
}
