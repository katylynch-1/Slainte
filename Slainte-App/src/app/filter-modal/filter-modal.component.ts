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
  selectedAmenities: string[] = [];
  selectedEntertainment: string[] = [];

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    
  }

  applyFilters() {
    this.modalController.dismiss({
      selectedAtmospheres: this.selectedAtmospheres,
      selectedDrinks: this.selectedDrinks,
      selectedMusic: this.selectedMusic,
      selectedAmenities: this.selectedAmenities,
      selectedEntertainment: this.selectedEntertainment
    });
  }

  dismissModal() {
    this.modalController.dismiss();
  }
}
