import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MigajaComponent } from './migaja.component';

describe('MigajaComponent', () => {
  let component: MigajaComponent;
  let fixture: ComponentFixture<MigajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MigajaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MigajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
