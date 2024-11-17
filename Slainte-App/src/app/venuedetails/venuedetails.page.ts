import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { VenuedataService } from '../services/venuedata.service';
import { AuthenticationService } from '../services/authentication.service';
import { SavevenuesService } from '../services/savevenues.service';
import { MessagingService } from '../services/messaging.service';
import { FriendrequestsService } from '../services/friendrequests.service';
import { ModalController } from '@ionic/angular';
import { ShareWithFriendsComponent } from '../share-with-friends/share-with-friends.component';

@Component({
  selector: 'app-venuedetails',
  templateUrl: './venuedetails.page.html',
  styleUrls: ['./venuedetails.page.scss'],
})
export class VenuedetailsPage implements OnInit {

  venue: any;
  apiVenueDetails: any;
  venueId: string;  // Declare venueId
  venueName: string;   // Make sure this is set to the venue’s name
  venueImageUrl: string;  // Make sure this is set to the venue’s image URL
  isSaved: boolean;  // Declare isSaved
  currentUserId: string;

  constructor(private route: ActivatedRoute, private router: Router, private venueData: VenuedataService, private authService: AuthenticationService, private saveVenues: SavevenuesService, private messagingService: MessagingService, private friendRequestService: FriendrequestsService, private modalController: ModalController) { 
    
    // this.route.queryParams.subscribe(params => {
    //   if (this.router.getCurrentNavigation()?.extras.state){
    //     this.venue = this.router.getCurrentNavigation().extras.state['venue']; 
    //     console.log('Venue from navigation state:',this.venue);
    //     // Use the venue ID from the navigation state or Google API (e.g., place_id)
    //     this.venueId = this.venue.place_id || ''; 
    //     this.checkIfSaved();  // Check if this venue is already saved when loaded
    //   }
    // });
  }

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.currentUserId = user.uid;
      }
    });
    // Attempt to retrieve venue data from NavigationExtras or route parameters
    const navigationState = this.router.getCurrentNavigation()?.extras.state;
    if (navigationState && navigationState['venue']) {
      this.venue = navigationState['venue'];
      console.log('Venue from navigation state:', this.venue);
      this.venueId = this.venue.place_id || ''; // Use place_id from navigation state
    } else {
      this.venueId = this.route.snapshot.queryParamMap.get('place_id') || '';
      if (!this.venueId) {
        console.error('No venue data available from navigation state or route parameters');
        return;
      }
    }
  
    // Fetch additional details if place_id is available
    if (this.venueId) {
      this.loadVenueDetails(this.venueId);
    } else {
      console.error('place_id is missing; unable to fetch venue details.');
    }
  }
  
  async loadVenueDetails(placeId: string): Promise<void> {
    console.log('Loading details for placeId:', placeId);
    // Fetch venue details using Google Places API
    try {
      await this.fetchApiVenueDetails(placeId);
      this.checkIfSaved(); // Check if the venue is already saved
    } catch (error) {
      console.error('Error loading venue details:', error);
    }
  }


  // Check if the venue is saved to the user's saved venues
  async checkIfSaved() {
    if (this.venueId) {
        try {
            this.isSaved = await this.saveVenues.isVenueSaved(this.venueId);  // Check if venue is saved
            console.log('Venue saved status:', this.isSaved);
        } catch (error) {
            console.error('Error checking if venue is saved:', error);
        }
    } else {
        console.warn('No venueId available to check saved status.');
    }
}

// Toggle between saving and unsaving the venue
async toggleSave() {
  try {
      if (this.isSaved) {
          await this.saveVenues.unsaveVenue(this.venueId);  // Unsave the venue
          console.log('Venue unsaved successfully.');
      } else {
          await this.saveVenues.saveVenue(this.venueId);    // Save the venue
          console.log('Venue saved successfully.');
      }
      this.isSaved = !this.isSaved;  // Update the saved state in the UI
      console.log('Venue saved state after toggle:', this.isSaved);
  } catch (error) {
      console.error('Error toggling save state:', error);
      // Handle error, e.g., show a message to the user
  }
}


  // Get Google Places API details
  async fetchApiVenueDetails(placeId: string): Promise<void> {
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

  goToTagSearch(tag: string){
    const navigationExtras: NavigationExtras = {
      queryParams: { tag: tag }
    };
    this.router.navigate(['tag-search'], navigationExtras);
  }

  async shareVenueDetails() {
    if (this.venue && this.venue.place_id) {
      // Construct the shareable URL
      const shareableUrl = `${window.location.origin}/venuedetails?place_id=${this.venue.place_id}`;
      const clickableLink = `<a href="${shareableUrl}">Check out this venue!</a>`;
      console.log('Generated shareable URL:', shareableUrl);
  
      // Open the modal for friend selection
      const modal = await this.modalController.create({
        component: ShareWithFriendsComponent,
        componentProps: { clickableLink } // Pass the URL to the modal
      });
  
      await modal.present();
    } else {
      console.error('Venue data is missing or invalid.');
    }
  }
}
