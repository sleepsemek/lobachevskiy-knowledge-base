import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FqFileIconComponent } from './fq-file-icon.component';

describe('FqFileIconComponent', () => {
  let component: FqFileIconComponent;
  let fixture: ComponentFixture<FqFileIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FqFileIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FqFileIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
