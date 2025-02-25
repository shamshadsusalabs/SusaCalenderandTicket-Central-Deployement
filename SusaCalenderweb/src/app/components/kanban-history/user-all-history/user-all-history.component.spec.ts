import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAllHistoryComponent } from './user-all-history.component';

describe('UserAllHistoryComponent', () => {
  let component: UserAllHistoryComponent;
  let fixture: ComponentFixture<UserAllHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAllHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAllHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
