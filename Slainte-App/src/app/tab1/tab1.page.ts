import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { User} from '@firebase/auth-types';
import { firstValueFrom } from 'rxjs';
import { SearchLocationComponent } from '../search-location/search-location.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})

export class Tab1Page implements OnInit {

  user: any;  
  userDetails: any;  
  
  constructor(private authService: AuthenticationService, private router: Router) {}

  async ngOnInit() {
    try {
      // Get the currently authenticated user
      this.user = await firstValueFrom(this.authService.getUser());

      if (this.user) {
        const uid = this.user.uid;  // Get the user's UID
        
        // Fetch additional user details
        this.userDetails = await firstValueFrom(this.authService.getUserDetails(uid));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  async openSearchLocationPage() {
    this.router.navigate(['/search-location']);
  }
}

