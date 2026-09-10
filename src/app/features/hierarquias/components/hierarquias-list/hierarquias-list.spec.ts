import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HierarquiasList } from './hierarquias-list';

describe('HierarquiasList', () => {
  let component: HierarquiasList;
  let fixture: ComponentFixture<HierarquiasList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HierarquiasList],
    }).compileComponents();

    fixture = TestBed.createComponent(HierarquiasList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
