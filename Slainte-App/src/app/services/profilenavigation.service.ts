import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';  

@Injectable({
  providedIn: 'root'
})
export class ProfilenavigationService {

  constructor(private navController: NavController) { }

  navigateToProfile(userId: string) {
    this.navController.navigateForward(`/friend-profile/${userId}`);
  }
}
