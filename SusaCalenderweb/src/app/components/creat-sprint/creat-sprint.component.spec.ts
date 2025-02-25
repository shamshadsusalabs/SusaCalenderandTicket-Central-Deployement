import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatSprintComponent } from './creat-sprint.component';

describe('CreatSprintComponent', () => {
  let component: CreatSprintComponent;
  let fixture: ComponentFixture<CreatSprintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatSprintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatSprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
