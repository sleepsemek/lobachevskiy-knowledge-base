import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FqDialogComponent } from './fq-dialog.component';

describe('FqDialogComponent', () => {
  let component: FqDialogComponent;
  let fixture: ComponentFixture<FqDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FqDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FqDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
