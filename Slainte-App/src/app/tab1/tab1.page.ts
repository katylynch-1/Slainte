import { Component, OnInit } from '@angular/core';
import { GeolocationService } from '../services/geolocation.service';
import { ModalController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

declare var google: any;

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})

export class Tab1Page implements OnInit {

  user: any;  
  userDetails: any;  
  
  constructor(private authService: AuthenticationService, private modalController: ModalController) {}

  async ngOnInit() {
    try {
      // Get the currently authenticated user
      this.user = await firstValueFrom(this.authService.getUser());

      if (this.user) {
        const uid = this.user.uid;  // Get the user's UID
        
        // Fetch additional user details
        this.userDetails = await firstValueFrom(this.authService.getUserDetails(uid));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }
}

