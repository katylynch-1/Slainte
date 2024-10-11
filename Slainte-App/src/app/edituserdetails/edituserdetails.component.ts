import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '@firebase/auth-types';


@Component({
  selector: 'app-edituserdetails',
  templateUrl: './edituserdetails.component.html',
  styleUrls: ['./edituserdetails.component.scss'],
})
export class EdituserdetailsComponent  implements OnInit {

  user: User;
  userDetails: any = null;

  constructor(private modalController: ModalController, private authService: AuthenticationService, private toastCtrl: ToastController) { }

  dismissModal() {
    // Close the modal without passing any data back
    this.modalController.dismiss();
  }

  ngOnInit() {
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

}
