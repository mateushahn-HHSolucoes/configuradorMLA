import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprovadoresForm } from './aprovadores-form';

describe('AprovadoresForm', () => {
  let component: AprovadoresForm;
  let fixture: ComponentFixture<AprovadoresForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AprovadoresForm],
    }).compileComponents();

    fixture = TestBed.createComponent(AprovadoresForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
