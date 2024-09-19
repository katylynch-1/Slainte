import { Component, OnInit } from '@angular/core';
import { GeolocationService } from '../services/geolocation.service';
import { PlacesdataService } from '../services/placesdata.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  map: any;

  constructor(private geolocationService: GeolocationService) {}

  ngOnInit() {
    // this.loadMap();
  }

  // async loadMap() {
  //   const { lat, lng } = await this.geolocationService.getCurrentPosition();

  //   const mapOptions = {
  //     center: { lat: lat, lng: lng },
  //     zoom: 15
  //   };

  //   const mapEle = document.getElementById('map');
  //   this.map = new google.maps.Map(mapEle, mapOptions);

  //   const marker = new google.maps.Marker({
  //     position: { lat: lat, lng: lng },
  //     map: this.map
  //   });
  // }

  // venues: any[] = [];

  // constructor(private placesService: PlacesdataService) {}

  // ngOnInit(): void {
  //   this.placesService.getPubs('53.3331,-6.2489', 1500).subscribe(data => {
  //     this.venues = data.results;
  //   });
  // }
}
