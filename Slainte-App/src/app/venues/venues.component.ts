import { Component, OnInit } from '@angular/core';
import { PlacesdataService } from '../services/placesdata.service';
@Component({
  selector: 'app-venues',
  templateUrl: './venues.component.html',
  styleUrls: ['./venues.component.scss'],
})
export class VenuesComponent  implements OnInit {

  venues: any[] = [];

  constructor(private placesService: PlacesdataService) { }

  ngOnInit(): void {
    this.getBars();
  }

  getBars(): void {
    const lat = 53.3442;  // Latitude for Dublin
    const lng = -6.2674;  // Longitude for Dublin
    const radius = 1000;  // Search radius (in meters)
    const type = 'bar';

    this.placesService.getBars(lat, lng, radius, type).subscribe(
      (data: any) => {
        this.venues = data.results;  // Store the API response (results) in the venues variable
        console.log(this.venues);  // Optional: log the data to verify it's coming in correctly
      },
      (error) => {
        console.error('Error fetching venues', error);
      }
    );
  }
}
