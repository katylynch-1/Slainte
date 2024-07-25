import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VenuedetailsPage } from './venuedetails.page';

describe('VenuedetailsPage', () => {
  let component: VenuedetailsPage;
  let fixture: ComponentFixture<VenuedetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VenuedetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
