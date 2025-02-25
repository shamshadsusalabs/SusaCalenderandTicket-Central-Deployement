import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandupsTimeComponent } from './standups-time.component';

describe('StandupsTimeComponent', () => {
  let component: StandupsTimeComponent;
  let fixture: ComponentFixture<StandupsTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StandupsTimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StandupsTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
