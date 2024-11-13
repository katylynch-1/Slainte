import { Component, OnInit } from '@angular/core';
import { GeolocationService } from '../services/geolocation.service';
import { ModalController } from '@ionic/angular';
import { SafetyModalComponent } from '../safety-modal/safety-modal.component';
import { NotificationsComponent } from '../notifications/notifications.component';
import { AuthenticationService } from '../services/authentication.service';
import { User} from '@firebase/auth-types';
import { firstValueFrom } from 'rxjs';

declare var google: any;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})

export class Tab1Page implements OnInit {

  // Display users location on map
  map: google.maps.Map | undefined;
  userDetails: any = null;
  user : User;

  constructor(private geolocationService: GeolocationService, private modalController: ModalController, private authService: AuthenticationService) {}

  ngOnInit() {
    // this.initializeMap(); 
    this.loadUserDetails();
  }

  async loadUserDetails(){
    try {
      this.user = await firstValueFrom(this.authService.getUser());
      if(this.user){
        const uid = this.user.uid;
        this.userDetails = await firstValueFrom(this.authService.getUserDetails(uid));
      }else {
        console.error('No user is currently authenticated');
      }
    } catch(error){
      console.error('Error loading user details', error);
    }
  }

  async initializeMap() {
    const { lat, lng } = await this.geolocationService.getCurrentPosition();
    console.log('Latitude:', lat, 'Longitude:', lng);

    const mapOptions: google.maps.MapOptions = {
      center: { lat, lng },
      zoom: 15,
      mapId: 'f7407f18b4a90b70',
      
    };

    const mapEle = document.getElementById('map') as HTMLElement;
    if (mapEle) {
      this.map = new google.maps.Map(mapEle, mapOptions);
    } else {
      console.error('Map element not found');
    }

    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

    new AdvancedMarkerElement({
      position: { lat, lng },
      map: this.map,
      
      
    });

    console.log('Creating marker at:', { lat, lng });
  }

  async openSafetyModal() {
    const modal = await this.modalController.create({
      component: SafetyModalComponent
    });
    return await modal.present();
  }

  async openNotifications() {
    const modal = await this.modalController.create({
      component: NotificationsComponent,
    });

    return await modal.present();
  }
}

