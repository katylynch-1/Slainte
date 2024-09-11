import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnterUserDetailsPage } from './enter-user-details.page';

describe('EnterUserDetailsPage', () => {
  let component: EnterUserDetailsPage;
  let fixture: ComponentFixture<EnterUserDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterUserDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
