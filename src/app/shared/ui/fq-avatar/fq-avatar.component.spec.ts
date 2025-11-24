import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FqAvatarComponent } from './fq-avatar.component';

describe('FqAvatarComponent', () => {
  let component: FqAvatarComponent;
  let fixture: ComponentFixture<FqAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FqAvatarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FqAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
