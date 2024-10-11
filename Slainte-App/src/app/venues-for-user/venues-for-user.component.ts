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
export class VenuesForUserComponent  implements OnInit {

  venues: Venue[] = [];
  user: User;
  userDetails: any = null;

  constructor(private venueService: VenuedataService, private router: Router, private authService: AuthenticationService) {

    // this.venueService.getVenues().subscribe(venues => {
    //   this.venues = venues;
    // });
   }

   openVenueDetails(venue: any){
    const placeId = venue.place_id; 
    let navigationExtras: NavigationExtras = {
      state: {
        venue: venue
      }
    };
    this.router.navigate(['venuedetails', placeId], navigationExtras);
  }

  ngOnInit() {
    //Retrieve the current user
    this.authService.getUser().subscribe(user => {
      if(user) {
        this.user = user;

        this.authService.getUserDetails(user.uid).subscribe(details => {
          this.userDetails = details;

          //Retrieve venues and match to user's preferences 
          this.venueService.getVenues().subscribe(venues => {
            this.venues = venues.filter(venue => this.matchPreferences(venue, this.userDetails.preferences));
          });
        });
      }
    });
  }

  matchPreferences(venue: any, userPreferences: any): boolean {
    // Loop through the user's preferences and compare them with the venue's boolean values
    for (const key in userPreferences) {
      // Loop through the user's preferences and return true if at least one matches
      if (userPreferences[key] === true && venue[key] === true) {
        return true;  // Return true as soon as a match is found
      }
    }
    return false;  // No macthes found, return false
  }

}
