import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessagesTabPage } from './messages-tab.page';

describe('MessagesTabPage', () => {
  let component: MessagesTabPage;
  let fixture: ComponentFixture<MessagesTabPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagesTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
