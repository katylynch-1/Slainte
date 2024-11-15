import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { FriendrequestsService } from '../services/friendrequests.service';
import { Router } from '@angular/router';
import { SavevenuesService } from '../services/savevenues.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss'],
})
export class UserprofileComponent  implements OnInit {

  userId: string;
  userProfile: any;
  selectedSegment: string = 'savedVenues'; // Default selected segment

  constructor(private route: ActivatedRoute, private router: Router, private friendRequestService: FriendrequestsService, private saveVenues: SavevenuesService) { }

  ngOnInit() {
    // Get the friendId from the URL parameter
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('userId');  // Retrieve the userId parameter
      this.loadUserProfile();  // Call function to load profile data
    });
  }
  
  // Load the friend's profile using the friendId
  async loadUserProfile() {
    if (this.userId) {
      try {
        // Fetch the user profile data
        const profiles = await firstValueFrom(this.friendRequestService.getUserDetails([this.userId]));
        this.userProfile = profiles[0];  // Assume only one profile is returned
  
        // Fetch saved venues with images for the user
        const savedVenues = await this.saveVenues.getSavedVenues(this.userId);
        if (savedVenues && savedVenues.length > 0) {
          this.userProfile.savedVenues = await this.saveVenues.getVenuesWithImages(savedVenues);
          console.log('Fetched saved venues with images:', this.userProfile.savedVenues);
        } else {
          console.log('No saved venues found for this user.');
          this.userProfile.savedVenues = [];
        }
  
        // Fetch the friend list for the user's profile
        this.userProfile.friendsList = await firstValueFrom(this.friendRequestService.getFriends(this.userId));
        console.log('Fetched Friends:', this.userProfile.friendsList);
  
      } catch (error) {
        console.error('Error loading user details or friends list:', error);
      }
    }
  }

  openVenueDetailsPage(venue: any) {
    console.log('Clicked venue:', venue); // Log the venue that was clicked
    const placeId = venue.id; 
    console.log('Place ID:', placeId); // Log the place ID
    if (!placeId) {
      console.error('No place ID found for the venue:', venue);
      return; // Exit if there is no place ID
    }
    let navigationExtras: NavigationExtras = {
      state: {
        venue: venue
      }
    };
    this.router.navigate(['venuedetails', placeId], navigationExtras);
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value; // Update segment based on selection
  }
}
