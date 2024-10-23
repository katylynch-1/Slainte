import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';
import { User } from '@firebase/auth-types';
import { EdituserdetailsComponent } from '../edituserdetails/edituserdetails.component';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{

  user: User; // User defined by Firebase Authentication
  userDetails: any = null; // User personal information and interests

  constructor(private authService: AuthenticationService, private modalController: ModalController, private userService: UserService) {}

  ngOnInit(){
    this.authService.getUser().subscribe(user => {
      if(user) {
        this.user = user;

      // Fetch additional user details from Firestore
      this.authService.getUserDetails(user.uid).subscribe(details => {
        this.userDetails = details;
      });
    }
    });
  }

  signOut(){
    this.authService.signOut()
  }

  async openEditModal(){
    const modal = await this.modalController.create({
      component: EdituserdetailsComponent
    });

    await modal.present();

  }


}
