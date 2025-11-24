import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FqFileUploadComponent } from './fq-file-upload.component';

describe('FqFileUploadComponent', () => {
  let component: FqFileUploadComponent;
  let fixture: ComponentFixture<FqFileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FqFileUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FqFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
