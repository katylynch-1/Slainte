import { Component, OnInit } from '@angular/core';
import { PlacesdataService } from '../services/placesdata.service';
import { Geolocation } from '@capacitor/geolocation';
import { firstValueFrom } from 'rxjs'; 
import { NavigationExtras, Router } from '@angular/router';
import { VenuedataService } from '../services/venuedata.service';

@Component({
  selector: 'app-venues',
  templateUrl: './venues.component.html',
  styleUrls: ['./venues.component.scss'],
})
export class VenuesComponent  implements OnInit {

  bars: any[] = [];
  lat: number = 53.3442;
  lng: number = -6.2674; 
  radius: number = 1000; 
  type: string = 'bar,night_club';
  keyword: string = 'pub';
  userInput: string = '';
  apiVenue: any;
  loading: boolean = false; 



  constructor(private placesService: PlacesdataService, private router: Router, private venueDataImgs: VenuedataService) { }


  async ngOnInit() {
    await this.getCurrentLocation(); 
    this.showPlaces();
  }

  // By default shows venues nearby the users location
  async getCurrentLocation() {
    try {
      const position = await Geolocation.getCurrentPosition();
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      console.log(`Current position: ${this.lat}, ${this.lng}`);
    } catch (error) {
      console.error('Error getting location', error);
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
    console.log('Passing venue:', venue); 
    this.router.navigate(['/apivenuedetails'], navigationExtras);
  }

  openGoogleMaps(name: string) {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`;
    window.open(url, '_blank'); // Opens in a new tab or the Google Maps app on mobile
  }
}
