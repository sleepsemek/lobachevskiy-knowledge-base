import {Component, Input} from '@angular/core';
import {SearchResult} from '../../../entities/search/search.model';
import {DatePipe, SlicePipe} from '@angular/common';
import {FqBadgeComponent} from '../../../shared/ui/fq-badge/fq-badge.component';
import {FqFileIconComponent} from '../../../shared/ui/fq-file-icon/fq-file-icon.component';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-document-card',
  imports: [
    DatePipe,
    FqBadgeComponent,
    FqFileIconComponent,
    RouterLink,
    SlicePipe
  ],
  templateUrl: './search-card.component.html',
  styleUrl: './search-card.component.scss',
})
export class SearchCardComponent {
  @Input() searchResult!: SearchResult;

  viewDocument(id: string): void {
    console.log('View document:', id);
  }

  downloadDocument(id: string, name: string): void {
    console.log('Download document:', id, name);
  }

  protected readonly Date = Date;
}
