import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllBacklogComponent } from './all-backlog.component';

describe('AllBacklogComponent', () => {
  let component: AllBacklogComponent;
  let fixture: ComponentFixture<AllBacklogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllBacklogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllBacklogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
