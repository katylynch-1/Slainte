import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VenuedataService } from '../services/venuedata.service';

@Component({
  selector: 'app-apivenuedetails',
  templateUrl: './apivenuedetails.page.html',
  styleUrls: ['./apivenuedetails.page.scss'],
})
export class ApivenuedetailsPage implements OnInit {

  apiVenue: any;

  constructor(private router: Router, private apiVenueData: VenuedataService) {
  }

  ngOnInit() {
    this.loadVenueDetails();
  }

  loadVenueDetails() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.apiVenue = navigation.extras.state['apiVenue'];
      console.log('Received venue:', this.apiVenue);

      if (this.apiVenue && this.apiVenue.place_id) {
        this.getApiVenueDetails(this.apiVenue.place_id);
      } else {
        console.error('No valid place_id found in venue data');
      }
    } else {
      console.error('No venue data in navigation state');
    }
  }

  getApiVenueDetails(placeId: string) {
    console.log('Getting details for placeId:', placeId);
    this.apiVenueData.getVenueDetails(placeId).subscribe({
      next: (details) => {
        this.apiVenue = details;
        console.log('Venue details:', this.apiVenue);
      },
      error: (err) => {
        console.error('Error fetching venue details:', err);
      }
    });
  }

  getPriceDescription(priceLevel: number): string {
    switch (priceLevel) {
      case 1: return 'Cheap';
      case 2: return 'Affordable';
      case 3: return 'Moderate';
      case 4: return 'Expensive';
      case 5: return 'Very Expensive';
      default: return 'Unknown';
    }
  }
  
  getPriceBarColor(priceLevel: number): string {
    switch (priceLevel) {
      case 1: return 'success'; 
      case 2: return 'success'; 
      case 3: return 'warning'; 
      case 4: return 'danger'; 
      case 5: return 'dark'; 
      default: return 'medium';
    }
  }

}
