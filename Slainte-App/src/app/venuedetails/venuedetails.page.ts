import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VenuedataService } from '../services/venuedata.service';
import { AuthenticationService } from '../services/authentication.service';
import { SavevenuesService } from '../services/savevenues.service';

@Component({
  selector: 'app-venuedetails',
  templateUrl: './venuedetails.page.html',
  styleUrls: ['./venuedetails.page.scss'],
})
export class VenuedetailsPage implements OnInit {

  venue: any;
  apiVenueDetails: any;
  venueId: string;  // Declare venueId
  isSaved: boolean;  // Declare isSaved

  constructor(private route: ActivatedRoute, private router: Router, private venueData: VenuedataService, private authService: AuthenticationService, private saveVenues: SavevenuesService) { 
    
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation()?.extras.state){
        this.venue = this.router.getCurrentNavigation().extras.state['venue']; 
        console.log('Venue from navigation state:',this.venue);
        // Use the venue ID from the navigation state or Google API (e.g., place_id)
        this.venueId = this.venue.place_id || ''; 
        this.checkIfSaved();  // Check if this venue is already saved when loaded
      }
    });
  }

  ngOnInit() {
    // Get place_id from route params
    this.route.paramMap.subscribe(params => {
      const placeId = params.get('place_id'); 
      if (placeId) {
        this.venueId = placeId;
        // Get additional venue details using place_id for place details API
        this.fetchApiVenueDetails(placeId);
        this.checkIfSaved();  // Check if the venue is saved based on placeId
      } else {
        console.error('No place_id found in route params');
      }
    });
  }

  // Check if the venue is saved to the user's saved venues
  async checkIfSaved() {
    if (this.venueId) {
      this.isSaved = await this.saveVenues.isVenueSaved(this.venueId);  // Check if venue is saved
      console.log('Venue saved status:', this.isSaved);
    }
  }

  // Toggle between saving and unsaving the venue
  async toggleSave() {
    if (this.isSaved) {
      await this.saveVenues.unsaveVenue(this.venueId);  // Unsave the venue
    } else {
      await this.saveVenues.saveVenue(this.venueId);    // Save the venue
    }
    this.isSaved = !this.isSaved;  // Update the saved state in the UI
    console.log('Venue saved state after toggle:', this.isSaved);
  }

  // Get Google Places API details
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

  openGoogleMaps(name: string) {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`;
    window.open(url, '_blank'); // Opens in a new tab or the Google Maps app on mobile
  }
}
