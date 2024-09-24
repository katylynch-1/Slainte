import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../services/places.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss'],
})
export class PlacesComponent  implements OnInit {

  bars: any[] = []; //Array to hold the pub data
  // Set desired latitude and longitude so I put Dublin 2 
  lat: number = 53.3442;
  lng: number = -6.2674;
  radius: number = 1000; // 1 km
  // type: string = "bar"; This isn't needed as it's handled in the backend

  constructor(private placesService: PlacesService, private modalController: ModalController) { }

  ngOnInit() {
    this.getPlaces();
  }
  
  getPlaces(){
    this.placesService.getPubs(this.lat, this.lng, this.radius).subscribe({
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


  dismissModal() {
    // Close the modal without passing any data back
    this.modalController.dismiss();
  }

}
