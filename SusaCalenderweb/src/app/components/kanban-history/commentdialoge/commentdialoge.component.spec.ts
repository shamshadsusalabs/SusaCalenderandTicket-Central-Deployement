import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentdialogeComponent } from './commentdialoge.component';

describe('CommentdialogeComponent', () => {
  let component: CommentdialogeComponent;
  let fixture: ComponentFixture<CommentdialogeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentdialogeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentdialogeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
