import { Component, OnInit } from '@angular/core';
import { GeolocationService } from '../services/geolocation.service';
import { PlacesdataService } from '../services/placesdata.service';
import { VenuedataService } from '../services/venuedata.service';
import { firstValueFrom } from 'rxjs';
import { NavigationExtras } from '@angular/router';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-search-location',
  templateUrl: './search-location.component.html',
  styleUrls: ['./search-location.component.scss'],
})
export class SearchLocationComponent  implements OnInit {

  userInput: string = '';
  bars: any[] = [];
  lat: number = 53.3442;
  lng: number = -6.2674; 
  radius: number = 1000; 
  type: string = 'bar,night_club';
  keyword: string = 'pub';
  apiVenue: any;
  loading: boolean = false; 

  constructor(private placesService: PlacesdataService, private router: Router, private venueDataImgs: VenuedataService, private modalController: ModalController) { }

  ngOnInit() {
    this.showPlaces();
  }

  onInputChange(event: any) {
    this.userInput = event.detail.value; 
    console.log('Current input:', this.userInput);
  }

  async onUserInputSubmit() {
    try {
      if (this.userInput) {
        // Geocodes the custom location from user input
        const geocodedLocation = await firstValueFrom(this.placesService.geocode(this.userInput));
        
        this.lat = geocodedLocation.results[0].geometry.location.lat;
        this.lng = geocodedLocation.results[0].geometry.location.lng;

        // Searches for venues near the geocoded location
        this.showPlaces();
      }
    } catch (error) {
      console.error('Error searching with custom location:', error);
      alert('Could not retrieve geocode data. Please check your input or try again later.');
    }
  }

  async showPlaces() {
    this.loading = true; 
    this.placesService.getBars(this.lat, this.lng, this.radius, this.type, this.keyword).subscribe({ // Gets places data from places data service through places API
      next: async (data) => {
        this.bars = await Promise.all(data.map(async (bar: any) => {
          const details = await firstValueFrom(this.venueDataImgs.getVenueDetails(bar.place_id)); // Gets additional venue details such as images from venue data service through place details API
          bar.photos = details.photos || [];  // Add photos to the bar object
          return bar;
        }));
      },
      error: (error) => {
        console.error('Error fetching bars', error);
        this.loading = false; 
      },
      complete: () => {
        console.log('Pub data fetch complete');
        this.loading = false; 
      }
    });
  }

  openApiVenueDetails(venue: any){
    console.log('Venue being passed:', venue);  // Add this to check if venue is undefined here
    let navigationExtras: NavigationExtras = {
      state: {
        apiVenue: venue
      }
    };
    console.log('Passing venue:', venue);  // Debugging to confirm data passed
    this.router.navigate(['/apivenuedetails'], navigationExtras);
  }  

}
