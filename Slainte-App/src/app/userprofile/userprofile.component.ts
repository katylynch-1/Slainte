import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { FriendrequestsService } from '../services/friendrequests.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss'],
})
export class UserprofileComponent  implements OnInit {

  userId: string;
  userProfile: any;
  selectedSegment: string = 'saved'; // Default selected segment

  constructor(private route: ActivatedRoute, private router: Router, private friendRequestService: FriendrequestsService) { }

  ngOnInit() {
    // Get the friendId from the URL parameter
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('userId');  // Retrieve the userId parameter
      this.loadUserProfile();  // Call function to load profile data
    });
  }

  // Load the friend's profile using the friendId
  loadUserProfile() {
    if (this.userId) {
      // Use the getUserDetails function to fetch the user data by passing an array with the userId
      this.friendRequestService.getUserDetails([this.userId]).subscribe(profiles => {
        // We expect only one user to be returned, so use the first item in the array
        this.userProfile = profiles[0];
      });
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
