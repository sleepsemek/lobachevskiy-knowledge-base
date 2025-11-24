import { Routes } from '@angular/router';
import {AuthComponent} from './features/auth/auth.component';
import {authGuard} from './core/guards/auth.guard';
import {DocumentPageComponent} from './features/document/document-page.component';
import {ProfilePageComponent} from './features/profile/profile-page.component';
import {SearchPageComponent} from './features/search/page/search-page.component';
import {CollectionsPageComponent} from './features/collections/collections-page.component';
import {UploadPageComponent} from './features/upload-page/upload-page.component';
import {RelatedDocumentsPageComponent} from './features/document/related-document-page/related-documents-page.component';

export const routes: Routes = [
  { path: 'login', loadComponent: () => AuthComponent },
  { path: '', canActivate: [], children: [
      { path: '', loadComponent: () => SearchPageComponent },
      { path: 'search', loadComponent: () => SearchPageComponent },
      { path: 'collections', loadComponent: () => CollectionsPageComponent },
      { path: 'upload', loadComponent: () => UploadPageComponent },

      { path: 'document/:id', loadComponent: () => DocumentPageComponent },
      { path: 'documents/related/:id', loadComponent: () => RelatedDocumentsPageComponent },
      { path: 'profile', loadComponent: () => ProfilePageComponent },
      { path: '**', redirectTo: '' }
    ]
  }
];
