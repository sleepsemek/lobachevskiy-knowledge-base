import {Component, Input} from '@angular/core';

@Component({
  selector: 'fq-badge',
  imports: [],
  templateUrl: './fq-badge.component.html',
  styleUrl: './fq-badge.component.scss',
})
export class FqBadgeComponent {
  @Input() variant: 'primary' | 'secondary' | 'success' | 'error' = 'primary';
  @Input() size: 'medium' | 'large' = 'medium';
}
