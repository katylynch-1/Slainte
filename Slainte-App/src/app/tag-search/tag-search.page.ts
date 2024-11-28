import { Component, OnInit } from '@angular/core';
import { Venue, VenuedataService } from '../services/venuedata.service';
import { Router, NavigationExtras } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tag-search',
  templateUrl: './tag-search.page.html',
  styleUrls: ['./tag-search.page.scss'],
})
export class TagSearchPage implements OnInit {

  venues: Venue[] = [];
  tag: string = ''; // Store the selected tag

  constructor(private route: ActivatedRoute, private venueService: VenuedataService, private router: Router) { }

  ngOnInit() {
    // Retrieve the tag from query params
    this.route.queryParams.subscribe(params => {
      this.tag = params['tag'];
      if (this.tag) {
        this.searchVenuesByTag(this.tag);
      }
    });
  }

  searchVenuesByTag(tag: string){
    this.venueService.getVenues().subscribe(venues => {
      // Filter venues based on the selected tag
      this.venues = venues.filter(venue => venue[tag]);
    })
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

}
