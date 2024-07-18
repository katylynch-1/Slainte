import { Component, OnInit } from '@angular/core';
import { Venue, VenuedataService } from '../services/venuedata.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  venues: Venue[] = [];
  filteredVenues: Venue[] = [];
  selectedAtmospheres: string[] = [];
  selectedDrinks: string[] = [];
  selectedMusic: string[] = [];

  constructor(private venueService: VenuedataService) {}

  ngOnInit() {
    this.venueService.getVenues().subscribe(venues => {
      this.venues = venues;
      this.applyFilters(); 
    });
  }

  applyFilters() {
    this.filteredVenues = this.venues.filter(venue => {
      const matchesAtmosphere = !this.selectedAtmospheres.length || this.selectedAtmospheres.some(tag => venue[tag]);
      const matchesDrinks = !this.selectedDrinks.length || this.selectedDrinks.some(tag => venue[tag]);
      const matchesMusic = !this.selectedMusic.length || this.selectedMusic.some(tag => venue[tag]);
      return matchesAtmosphere || matchesDrinks || matchesMusic; // Unsure about the use of this operator &&
      // it returns multiple venues within each category when multiple selections are made
      // but if two tags from different categories dont both match a venue it wont return anything
    });
  }  
}
