import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HierarquiasForm } from './hierarquias-form';

describe('HierarquiasForm', () => {
  let component: HierarquiasForm;
  let fixture: ComponentFixture<HierarquiasForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HierarquiasForm],
    }).compileComponents();

    fixture = TestBed.createComponent(HierarquiasForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
