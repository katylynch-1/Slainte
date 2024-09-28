import { Component, OnInit } from '@angular/core';
import { PlacesdataService } from '../services/placesdata.service';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-venues',
  templateUrl: './venues.component.html',
  styleUrls: ['./venues.component.scss'],
})
export class VenuesComponent  implements OnInit {

  bars: any[] = [];
  lat: number = 53.3442;
  lng: number = -6.2674; // Dublin 7
  radius: number = 1000; // 3 km
  type: string = 'bar' || 'night_club';
  keyword: string = 'pub';



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
      // Handle location errors (fallback to default coordinates or show a message)
    }
  }
  
  showPlaces(){
    this.placesService.getBars(this.lat, this.lng, this.radius, this.type, this.keyword).subscribe({
      next: (data) => {
        this.bars = data;
        // this.pubs = data;
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
