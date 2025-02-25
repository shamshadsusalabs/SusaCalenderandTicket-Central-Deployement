import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintHistoryComponent } from './sprint-history.component';

describe('SprintHistoryComponent', () => {
  let component: SprintHistoryComponent;
  let fixture: ComponentFixture<SprintHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SprintHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SprintHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
