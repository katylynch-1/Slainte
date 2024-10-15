import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApivenuedetailsPage } from './apivenuedetails.page';

describe('ApivenuedetailsPage', () => {
  let component: ApivenuedetailsPage;
  let fixture: ComponentFixture<ApivenuedetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ApivenuedetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
