import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabiComponent } from './habi.component';

describe('HabiComponent', () => {
  let component: HabiComponent;
  let fixture: ComponentFixture<HabiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HabiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HabiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
