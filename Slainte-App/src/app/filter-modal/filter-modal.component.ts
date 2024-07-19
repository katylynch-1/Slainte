import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-filter-modal',
  templateUrl: './filter-modal.component.html',
  styleUrls: ['./filter-modal.component.scss'],
})
export class FilterModalComponent implements OnInit {
  selectedAtmospheres: string[] = [];
  selectedDrinks: string[] = [];
  selectedMusic: string[] = [];

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    // Initialization logic, if needed
  }

  applyFilters() {
    // Close the modal and pass the selected values back to the parent
    this.modalController.dismiss({
      selectedAtmospheres: this.selectedAtmospheres,
      selectedDrinks: this.selectedDrinks,
      selectedMusic: this.selectedMusic
    });
  }

  dismissModal() {
    // Close the modal without passing any data back
    this.modalController.dismiss();
  }
}
