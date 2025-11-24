import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToCollectionDialogComponent } from './add-to-collection-dialog.component';

describe('AddToCollectionDialogComponent', () => {
  let component: AddToCollectionDialogComponent;
  let fixture: ComponentFixture<AddToCollectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddToCollectionDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddToCollectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
