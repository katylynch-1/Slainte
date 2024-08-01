import { Component, OnInit } from '@angular/core';
import { GeolocationService } from '../services/geolocation.service';

declare var google: any;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  map: any;

  constructor(private geolocationService: GeolocationService) {}

  ngOnInit() {
    this.loadMap();
  }

  async loadMap() {
    const { lat, lng } = await this.geolocationService.getCurrentPosition();

    const mapOptions = {
      center: { lat: lat, lng: lng },
      zoom: 15
    };

    const mapEle = document.getElementById('map');
    this.map = new google.maps.Map(mapEle, mapOptions);

    const marker = new google.maps.Marker({
      position: { lat: lat, lng: lng },
      map: this.map
    });
  }

  
}
