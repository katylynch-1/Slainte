import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';  

@Injectable({
  providedIn: 'root'
})
export class ProfilenavigationService {

  constructor(private navController: NavController) { }

  // Method to navigate to a friend's profile by their userId
  navigateToProfile(userId: string) {
    // Navigate using NavController or Angular Router (as per your setup)
    this.navController.navigateForward(`/friend-profile/${userId}`);
  }
}
