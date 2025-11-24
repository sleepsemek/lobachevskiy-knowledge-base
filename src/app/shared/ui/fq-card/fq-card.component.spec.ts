import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FqCardComponent } from './fq-card.component';

describe('FqCardComponent', () => {
  let component: FqCardComponent;
  let fixture: ComponentFixture<FqCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FqCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FqCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
