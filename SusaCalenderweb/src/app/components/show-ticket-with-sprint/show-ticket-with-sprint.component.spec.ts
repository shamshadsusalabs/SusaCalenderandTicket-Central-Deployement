import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowTicketWithSprintComponent } from './show-ticket-with-sprint.component';

describe('ShowTicketWithSprintComponent', () => {
  let component: ShowTicketWithSprintComponent;
  let fixture: ComponentFixture<ShowTicketWithSprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowTicketWithSprintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowTicketWithSprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
