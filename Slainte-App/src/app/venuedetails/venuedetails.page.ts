import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { VenuedataService } from '../services/venuedata.service';

@Component({
  selector: 'app-venuedetails',
  templateUrl: './venuedetails.page.html',
  styleUrls: ['./venuedetails.page.scss'],
})
export class VenuedetailsPage implements OnInit {

  venue: any;
  apiVenueDetails: any;


  constructor(private route: ActivatedRoute, private router: Router, private venueData: VenuedataService) { 
    
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras.state){
        this.venue = this.router.getCurrentNavigation().extras.state['venue'];
        console.log('Venue from navigation state:',this.venue);
      }
    });
  }

  ngOnInit() {
    // Get place_id from route params
    this.route.paramMap.subscribe(params => {
      const placeId = params.get('place_id'); // Assuming you're passing place_id in URL params
      if (placeId) {
        // Call your API to get additional venue details using place_id
        this.fetchApiVenueDetails(placeId);
      } else {
        console.error('No place_id found in route params');
      }
    });
  }

  // Method to fetch Google Places API details
  fetchApiVenueDetails(placeId: string) {
    console.log('Fetching details for placeId:', placeId);
    this.venueData.getVenueDetails(placeId).subscribe({
      next: (details) => {
        this.apiVenueDetails = details;
        console.log('Google API Venue Details:', this.apiVenueDetails);
      },
      error: (err) => {
        console.error('Error fetching place details:', err);
      },
      complete: () => {
        console.log('Place details fetching complete');
      }
    });
  };  
}
