import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';
import { Router, NavigationExtras } from '@angular/router';
import { User } from '@firebase/auth-types';
import { EdituserdetailsComponent } from '../edituserdetails/edituserdetails.component';
import { ModalController } from '@ionic/angular';
import { Observable, firstValueFrom } from 'rxjs';
import { ActionSheetController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { SavevenuesService } from '../services/savevenues.service';
import { SavedVenue } from '../services/savevenues.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{

  user: User;
  userDetails: any = null;
  savedVenues: SavedVenue[] = [];
  users$: Observable<any[]>; // Observable to hold user list
  currentUserId: string; // Store current user's uid
  selectedSegment: string = 'saved'; // Default selected segment


  constructor(private authService: AuthenticationService, 
    private router: Router, 
    private modalController: ModalController, 
    private userService: UserService, 
    private actionSheetController: ActionSheetController,
    private saveVenues: SavevenuesService) {}

    ngOnInit() {
      this.loadUserDetails();
    }
  
    async loadUserDetails() {
      try {
        // Get the currently authenticated user
        const user = await firstValueFrom(this.authService.getUser());
        
        if (user) {
          const uid = user.uid;  // Get the user's UID
          
          // Fetch user details including saved venues
          this.userDetails = await firstValueFrom(this.authService.getUserDetails(uid));
      
          // Fetch saved venues using SavevenuesService
          const savedVenues = await this.saveVenues.getSavedVenues(uid); // Get saved venues
          this.savedVenues = await this.saveVenues.getVenuesWithImages(savedVenues); // Pass fetched venues to get images
    
          // Log the saved venues for debugging
          console.log('Saved Venues:', this.savedVenues);
        } else {
          console.error('No user is currently authenticated.');
        }
      } catch (error) {
        // Log any errors that occur during the fetch process
        console.error('Error loading user details:', error);
      }
    }
    
  
    // Check if the venue is saved
    isVenueSaved(venueId: string): boolean {
      return this.savedVenues.some(venue => venue.id === venueId);
    }
  
    // Toggle between saving and unsaving the venue
    async toggleSave(venue: SavedVenue) {
      try {
        const user = await firstValueFrom(this.authService.getUser());
        if (!user) throw new Error('User not authenticated');
    
        if (this.isVenueSaved(venue.id)) {
          // Unsave the venue in the service
          await this.saveVenues.unsaveVenue(venue.id);
        } else {
          // Save the venue in the service
          await this.saveVenues.saveVenue(venue.id);
        }
    
        // Refresh the saved venues list after each toggle action
        this.savedVenues = await this.saveVenues.getSavedVenues(user.uid);
        console.log('Updated saved venues:', this.savedVenues);
    
      } catch (error) {
        console.error('Error toggling save state:', error);
      }
    }
       

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value; // Update segment based on selection
  }

  openVenueDetailsPage(venue: any) {
    console.log('Clicked venue:', venue); // Log the venue that was clicked
    const placeId = venue.id; 
    console.log('Place ID:', placeId); // Log the place ID
    if (!placeId) {
      console.error('No place ID found for the venue:', venue);
      return; // Exit if there is no place ID
    }
    let navigationExtras: NavigationExtras = {
      state: {
        venue: venue
      }
    };
    this.router.navigate(['venuedetails', placeId], navigationExtras);
  }
  

  // Present the action sheet for profile picture options
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Profile Picture',
      buttons: [
        {
          text: 'Update',
          handler: () => {
            this.updateImage();
          },
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.deleteImage();
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  async updateImage() {
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: true,
      source: CameraSource.Camera,
      resultType: CameraResultType.Uri,
    });

    if (image) {
      // Convert image URI to File
      const response = await fetch(image.webPath!);
      const blob = await response.blob();
      const file = new File([blob], `profile_pictures${this.user.uid}.jpg`, {
        type: 'image/jpeg',
      });

      // Update profile picture
      await this.authService.updateProfilePicture(this.user.uid, file);
      this.userDetails.imageURL = image.webPath; // Update local image reference for display
    }
  }

  async deleteImage() {
    await this.authService.deleteProfilePicture(this.user.uid);
    this.userDetails.imageURL = 'https://ionicframework.com/docs/img/demos/avatar.svg'; // Replace with default avatar
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
