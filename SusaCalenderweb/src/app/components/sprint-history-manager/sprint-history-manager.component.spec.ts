import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintHistoryManagerComponent } from './sprint-history-manager.component';

describe('SprintHistoryManagerComponent', () => {
  let component: SprintHistoryManagerComponent;
  let fixture: ComponentFixture<SprintHistoryManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SprintHistoryManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SprintHistoryManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
