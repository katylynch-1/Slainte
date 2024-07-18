import { Component, OnInit } from '@angular/core';
import { Venue, VenuedataService } from '../services/venuedata.service';
import { Observable } from 'rxjs';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  // venues = [
  //   {
  //     name: 'Chaplins',
  //     type: 'Late Bar',
  //     atmosphere: 'Energetic',
  //     drinks: 'Pints',
  //     music: 'Pop',
  //     amenities: 'Budget-Friendly',
  //     entertainment: 'DJ',
  //     address: '1-2 Hawkins St, Dublin 2, D02 K590',
  //     openingHours: 'Mon-Thurs 4-11.30pm'
  //   },
  //   {
  //     name: 'Doyles',
  //     type: 'Pub',
  //     atmosphere: 'Casual',
  //     drinks: 'Pints',
  //     music: 'Rock',
  //     amenities: '',
  //     entertainment: 'Live Gigs',
  //     address: '9 College St, Dublin 2, D02 WN62',
  //     openingHours: 'Mon 12pm-12.30am, Tues 12pm-1am, Weds-Thurs 12pm-1.30am, Fri-Sat 12pm-2.30am, Sun 4pm-12am'
  //   },
  //   {
  //     name: "Peter's Pub",
  //     type: 'Pub',
  //     atmosphere: 'Cosy',
  //     drinks: 'Pints',
  //     music: 'Trad',
  //     amenities: 'Outdoor Seats',
  //     entertainment: '',
  //     address: '1 Johnson Place, Dublin 2, D02 HW58',
  //     openingHours: 'Mon-Thurs 11am-11pm, Friday-Sat 11am-12am, Sun 1pm-11pm'
  //   },
  //   {
  //     name: "Toners",
  //     type: 'Pub',
  //     atmosphere: 'Traditional',
  //     drinks: 'Good Guinness',
  //     music: '',
  //     amenities: 'Beer Garden',
  //     entertainment: 'Sports',
  //     address: '139 Baggot Street Lower, Dublin 2',
  //     openingHours: 'Mon-Thurs 11am-11.30pm, Fri-Sun 11.30am-12.30am'
  //   },
  // ]

  // allVenues = [...this.venues];

  venues?: Observable<Venue[]>;

  venueData: Venue[] = [];
  filteredVenues: Venue[] = [];
  selectedTags: { [key: string]: boolean } = {
    traditional: false,
    casual: false,
    cosy: false,
    pints: false,
    goodGuinness: false,
    cocktails: false,
  };

  constructor(private venueService: VenuedataService) { }


  ngOnInit() {
    // this.venues = this.venueService.getVenues();
    this.venueService.getVenues().subscribe(venues => {
      this.venueData = venues;
      this.filteredVenues = venues; 
  });
  }

  applyFilters() {
    this.filteredVenues = this.venueData.filter(venue => {
      for (const tag in this.selectedTags) {
        if (this.selectedTags[tag] && venue[tag]) {
          return true;
        }
      }
      return false;
    });
  }

  onTagSelected(tag: string) {
    this.selectedTags[tag] = !this.selectedTags[tag];
    this.applyFilters();
  }  
}
