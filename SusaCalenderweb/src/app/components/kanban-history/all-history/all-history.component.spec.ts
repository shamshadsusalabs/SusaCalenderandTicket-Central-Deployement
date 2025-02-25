import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllHistoryComponent } from './all-history.component';

describe('AllHistoryComponent', () => {
  let component: AllHistoryComponent;
  let fixture: ComponentFixture<AllHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
