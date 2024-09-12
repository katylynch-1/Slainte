import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-edituserdetails',
  templateUrl: './edituserdetails.component.html',
  styleUrls: ['./edituserdetails.component.scss'],
})
export class EdituserdetailsComponent  implements OnInit {

  constructor(private modalController: ModalController) { }

  dismissModal() {
    // Close the modal without passing any data back
    this.modalController.dismiss();
  }

  ngOnInit() {}

}
