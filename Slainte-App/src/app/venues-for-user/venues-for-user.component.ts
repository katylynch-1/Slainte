import { Component, OnInit } from '@angular/core';
import { Venue, VenuedataService } from '../services/venuedata.service';
import { Router, NavigationExtras } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '@firebase/auth-types';

@Component({
  selector: 'app-venues-for-user',
  templateUrl: './venues-for-user.component.html',
  styleUrls: ['./venues-for-user.component.scss'],
})
export class VenuesForUserComponent implements OnInit {
  venues: Venue[] = [];
  user: User;
  userDetails: any = null;
  loading: boolean = false;

  constructor(private venueService: VenuedataService, private router: Router, private authService: AuthenticationService) {}

  openVenueDetails(venue: any) {
    const placeId = venue.place_id; 
    let navigationExtras: NavigationExtras = {
      state: {
        venue: venue
      }
    };
    this.router.navigate(['venuedetails', placeId], navigationExtras);
  }

  ngOnInit() {
    // Retrieve the current user
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.user = user;

        this.authService.getUserDetails(user.uid).subscribe(details => {
          this.userDetails = details;

          // Retrieve venues and match to user's preferences 
          this.loading = true; 
          this.venueService.getVenues().subscribe(venues => {
            // Process venues to include count of matches
            this.venues = this.processVenues(venues, this.userDetails.preferences);
            this.loading = false; // Stop loading once processing is done
          });
        });
      }
    });
  }

  matchCount(venue: any, userPreferences: any): number {
    let count = 0;
    // Loop through the user's preferences and count matches
    for (const key in userPreferences) {
      if (userPreferences[key] === true && venue[key] === true) {
        count++;
      }
    }
    return count; // Return the total count of matches
  }

  processVenues(venues: Venue[], userPreferences: any): Venue[] {
    return venues
      .map(venue => ({
        ...venue,
        matchCount: this.matchCount(venue, userPreferences) // Add a matchCount property to each venue
      }))
      .filter(venue => venue.matchCount > 0) // Filter out venues with no matches
      .sort((a, b) => b.matchCount - a.matchCount); // Sort venues by matchCount in descending order
  }
}
