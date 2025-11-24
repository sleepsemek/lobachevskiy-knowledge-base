import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedDocumentsPageComponent } from './related-documents-page.component';

describe('RelatedDocumentsPageComponent', () => {
  let component: RelatedDocumentsPageComponent;
  let fixture: ComponentFixture<RelatedDocumentsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatedDocumentsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatedDocumentsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
