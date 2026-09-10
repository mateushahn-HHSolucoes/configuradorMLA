import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprovadoresList } from './aprovadores-list';

describe('AprovadoresList', () => {
  let component: AprovadoresList;
  let fixture: ComponentFixture<AprovadoresList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AprovadoresList],
    }).compileComponents();

    fixture = TestBed.createComponent(AprovadoresList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
