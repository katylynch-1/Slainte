import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FriendsTabPage } from './friends-tab.page';

describe('FriendsTabPage', () => {
  let component: FriendsTabPage;
  let fixture: ComponentFixture<FriendsTabPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FriendsTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
