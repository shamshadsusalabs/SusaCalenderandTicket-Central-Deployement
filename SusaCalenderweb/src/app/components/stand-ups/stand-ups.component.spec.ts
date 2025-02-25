import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandUpsComponent } from './stand-ups.component';

describe('StandUpsComponent', () => {
  let component: StandUpsComponent;
  let fixture: ComponentFixture<StandUpsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StandUpsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StandUpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
