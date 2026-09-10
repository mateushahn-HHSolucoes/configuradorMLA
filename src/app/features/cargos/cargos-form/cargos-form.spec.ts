import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargosForm } from './cargos-form';

describe('CargosForm', () => {
  let component: CargosForm;
  let fixture: ComponentFixture<CargosForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargosForm],
    }).compileComponents();

    fixture = TestBed.createComponent(CargosForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
