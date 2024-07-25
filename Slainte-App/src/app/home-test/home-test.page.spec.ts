import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeTestPage } from './home-test.page';

describe('HomeTestPage', () => {
  let component: HomeTestPage;
  let fixture: ComponentFixture<HomeTestPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeTestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
