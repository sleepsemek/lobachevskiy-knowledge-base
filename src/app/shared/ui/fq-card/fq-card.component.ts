import {Component, Input} from '@angular/core';
import {NgTemplateOutlet} from "@angular/common";

@Component({
  selector: 'fq-card',
  standalone: true,
  imports: [
    NgTemplateOutlet
  ],
  templateUrl: 'fq-card.component.html',
  styleUrl: 'fq-card.component.scss',
})
export class FqCardComponent {
  @Input() as: 'article' | 'section' | 'div' | 'aside' = 'div';
}
