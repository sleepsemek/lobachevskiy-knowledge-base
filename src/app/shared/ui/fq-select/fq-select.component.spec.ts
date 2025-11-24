import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FqSelectComponent } from './fq-select.component';

describe('FqSelectComponent', () => {
  let component: FqSelectComponent;
  let fixture: ComponentFixture<FqSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FqSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FqSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
