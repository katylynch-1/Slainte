import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-safety-modal',
  templateUrl: './safety-modal.component.html',
  styleUrls: ['./safety-modal.component.scss'],
})
export class SafetyModalComponent  implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  dismissModal() {
    this.modalController.dismiss();
  }

}
