import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargosList } from './cargos-list';

describe('CargosList', () => {
  let component: CargosList;
  let fixture: ComponentFixture<CargosList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargosList],
    }).compileComponents();

    fixture = TestBed.createComponent(CargosList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
