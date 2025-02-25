import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BacklogsComponent } from './backlogs.component';

describe('BacklogsComponent', () => {
  let component: BacklogsComponent;
  let fixture: ComponentFixture<BacklogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BacklogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BacklogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
