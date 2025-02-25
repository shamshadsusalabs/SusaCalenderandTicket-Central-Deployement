import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewKanbanComponent } from './view-kanban.component';

describe('ViewKanbanComponent', () => {
  let component: ViewKanbanComponent;
  let fixture: ComponentFixture<ViewKanbanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewKanbanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewKanbanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
