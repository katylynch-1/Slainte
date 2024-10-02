import { Component, OnInit } from '@angular/core';
import { GeolocationService } from '../services/geolocation.service';

declare var google: any;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})

export class Tab1Page implements OnInit {

  map: google.maps.Map | undefined;

  constructor(private geolocationService: GeolocationService) {}

  ngOnInit() {
    this.initializeMap(); // Initialize map on component load
  }

  async initializeMap() {
    // Get the user's current position from the GeolocationService
    const { lat, lng } = await this.geolocationService.getCurrentPosition();
    console.log('Latitude:', lat, 'Longitude:', lng);

    // Set map options centered on user's location
    const mapOptions: google.maps.MapOptions = {
      center: { lat, lng },
      zoom: 15,
      mapId: 'f7407f18b4a90b70' // Add your Map ID here
    };

    // Get the HTML element where the map will be rendered
    const mapEle = document.getElementById('map') as HTMLElement;
    if (mapEle) {
      this.map = new google.maps.Map(mapEle, mapOptions);
    } else {
      console.error('Map element not found');
    }

    // Import the AdvancedMarkerElement from the Google Maps library
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

    // Create and place a marker at the user's current location
    new AdvancedMarkerElement({
      position: { lat, lng },
      map: this.map,
    });

    console.log('Creating marker at:', { lat, lng });
  }

  selectedSegment: string = 'venuesForYou'; // Default to 'Venues For You'

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value; // Update segment based on selection
  }
}

