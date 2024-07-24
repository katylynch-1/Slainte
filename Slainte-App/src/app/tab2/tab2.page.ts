import { Component, OnInit } from '@angular/core';
import { Venue, VenuedataService } from '../services/venuedata.service';
import { ModalController } from '@ionic/angular';
import { FilterModalComponent } from '../filter-modal/filter-modal.component';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  venues: Venue[] = [];
  filteredVenues: Venue[] = [];
  selectedAtmospheres: string[] = [];
  selectedDrinks: string[] = [];
  selectedMusic: string[] = [];
  selectedAmenities: string[] = [];
  selectedEntertainment: string[] = [];
  selectedFilters: { label: string, type: string }[] = []; // For displaying chips


  constructor(private venueService: VenuedataService, private modalController: ModalController) {
    this.venueService.getVenues().subscribe(venues => {
      this.venues = venues;
      this.filteredVenues = venues; 
    });
  }

  // ngOnInit() {
  //   this.venueService.getVenues().subscribe(venues => {
  //     this.venues = venues;
  //     this.applyFilters(); 
  //   });
  // }

  async openFilterModal() {
    const modal = await this.modalController.create({
      component: FilterModalComponent
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        this.selectedAtmospheres = result.data.selectedAtmospheres;
        this.selectedDrinks = result.data.selectedDrinks;
        this.selectedMusic = result.data.selectedMusic;
        this.selectedAmenities = result.data.selectedAmenities;
        this.selectedEntertainment = result.data.selectedEntertainment;
        this.updateSelectedFilters(); // Update chips
        this.applyFilters(); // Apply filters after modal is dismissed
      }
    });

    return await modal.present();
  }

  // applyFilters() {
  //   this.filteredVenues = this.venues.filter(venue => {
  //     const matchesAtmosphere = !this.selectedAtmospheres.length || this.selectedAtmospheres.some(tag => venue[tag]);
  //     const matchesDrinks = !this.selectedDrinks.length || this.selectedDrinks.some(tag => venue[tag]);
  //     const matchesMusic = !this.selectedMusic.length || this.selectedMusic.some(tag => venue[tag]);
  //     return matchesAtmosphere || matchesDrinks || matchesMusic;
  //   });
  // }

  applyFilters() {
    const tagGroups = [this.selectedAtmospheres, this.selectedDrinks, this.selectedMusic, this.selectedAmenities, this.selectedEntertainment];
    const tagsAreSelected = tagGroups.some(tags => tags.length > 0);

    if (!tagsAreSelected) {
      // If no tags are selected, show all venues
      this.filteredVenues = this.venues;
    } else {
      this.filteredVenues = this.venues.map(venue => {
        // Calculate the number of matching tags
        let matchCount = 0;
        tagGroups.forEach(tags => {
          tags.forEach(tag => {
            if (venue[tag]) {
              matchCount++;
            }
          });
        });

        // Return the venue along with its match count
        return { venue, matchCount };
      })
      // Filter out venues with no matches
      .filter(item => item.matchCount > 0)
      // Sort venues by match count in descending order
      .sort((a, b) => b.matchCount - a.matchCount)
      // Extract the venues from the sorted array
      .map(item => item.venue);
    }
  }

  updateSelectedFilters() {
    this.selectedFilters = []; // Initializes as an empty array originally

    // Gathers the tags selected from each individual category 
    this.selectedAtmospheres.forEach(tag => this.selectedFilters.push({ label: tag, type: 'atmosphere' }));
    this.selectedDrinks.forEach(tag => this.selectedFilters.push({ label: tag, type: 'drink' }));
    this.selectedMusic.forEach(tag => this.selectedFilters.push({ label: tag, type: 'music' }));
    this.selectedAmenities.forEach(tag => this.selectedFilters.push({ label: tag, type: 'amenities'}));
    this.selectedEntertainment.forEach(tag => this.selectedFilters.push({ label: tag, type: 'entertainment'}));
  }

  removeFilter(filter: { label: string, type: string }) { // Allows the user to x off tags to remove filters
    switch (filter.type) {
      case 'atmosphere':
        this.selectedAtmospheres = this.selectedAtmospheres.filter(tag => tag !== filter.label);
        break;
      case 'drink':
        this.selectedDrinks = this.selectedDrinks.filter(tag => tag !== filter.label);
        break;
      case 'music':
        this.selectedMusic = this.selectedMusic.filter(tag => tag !== filter.label);
        break;
      case 'amenities':
        this.selectedAmenities = this.selectedAmenities.filter(tag => tag !== filter.label);
        break;
      case 'entertainment':
        this.selectedEntertainment = this.selectedEntertainment.filter(tag => tag !== filter.label);
    }
    this.updateSelectedFilters();
    this.applyFilters();
  }

}
