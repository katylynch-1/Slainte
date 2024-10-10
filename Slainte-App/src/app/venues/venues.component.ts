import { Component, OnInit } from '@angular/core';
import { PlacesdataService } from '../services/placesdata.service';
import { Geolocation } from '@capacitor/geolocation';
import { firstValueFrom } from 'rxjs'; // Import firstValueFrom

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


  constructor(private placesService: PlacesdataService) { }


  async ngOnInit() {
    await this.getCurrentLocation(); 
    this.showPlaces();
  }

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

  onInputChange(event: any) {
    this.userInput = event.detail.value; 
    console.log('Current input:', this.userInput);
  }

  async onUserInputSubmit() {
    try {
      if (this.userInput) {
        // Geocodes the custom location
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
  
  async showPlaces(){
    this.placesService.getBars(this.lat, this.lng, this.radius, this.type, this.keyword).subscribe({
      next: (data) => {
        this.bars = data;
      },
      error: (error) => {
        console.error('Error fetching bars', error);
      },
      complete: () => {
        console.log('Pub data fetch complete');
      }
    })
  }
}
