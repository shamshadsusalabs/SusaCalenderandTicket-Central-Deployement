import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissedTicketComponent } from './missed-ticket.component';

describe('MissedTicketComponent', () => {
  let component: MissedTicketComponent;
  let fixture: ComponentFixture<MissedTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MissedTicketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MissedTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
