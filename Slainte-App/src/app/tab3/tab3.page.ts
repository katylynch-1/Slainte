import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router, NavigationExtras } from '@angular/router';
import { User } from '@firebase/auth-types';
import { EdituserdetailsComponent } from '../edituserdetails/edituserdetails.component';
import { ModalController } from '@ionic/angular';
import { Observable, firstValueFrom } from 'rxjs';
import { ActionSheetController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { SavevenuesService, SavedVenue } from '../services/savevenues.service';
import { ToastController } from '@ionic/angular';
import { FriendrequestsService } from '../services/friendrequests.service'; // Import FriendrequestsService

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  user: User | null = null; // Initialize as null to handle cases where the user is not authenticated
  userDetails: any = null;
  savedVenues: SavedVenue[] = [];
  friendsList: any[] = []; // New array to store friends list
  selectedSegment: string = 'saved'; // Default selected segment

  constructor(
    private authService: AuthenticationService, 
    private router: Router, 
    private modalController: ModalController, 
    private actionSheetController: ActionSheetController,
    private saveVenues: SavevenuesService,
    private toastController: ToastController,
    private friendRequestsService: FriendrequestsService,
  ) {}

  ngOnInit() {
    this.loadUserDetails(); // Load user details on component initialization
  }

  async loadUserDetails() {
    try {
      // 1. Get the currently authenticated user
      this.user = await firstValueFrom(this.authService.getUser());
  
      if (!this.user) {
        console.error('No user is currently authenticated.');
        return;
      }
  
      const uid = this.user.uid;  // Get the user's UID
      
      // 2. Fetch user details
      try {
        this.userDetails = await firstValueFrom(this.authService.getUserDetails(uid));
        console.log('Fetched user details:', this.userDetails);
      } catch (error) {
        console.error('Error fetching user details:', error);
        throw error;
      }
  
      // 3. Fetch saved venues, only proceed if there are venues
      try {
        const savedVenues = await this.saveVenues.getSavedVenues(uid);
        if (savedVenues && savedVenues.length > 0) {
          this.savedVenues = await this.saveVenues.getVenuesWithImages(savedVenues);
          console.log('Fetched saved venues with images:', this.savedVenues);
        } else {
          console.log('No saved venues found for this user.');
          this.savedVenues = [];  // Set an empty array if no venues found
        }
      } catch (error) {
        console.error('Error fetching saved venues:', error);
        this.savedVenues = [];  // Fallback to empty array if fetching venues fails
      }
  
      // 4. Fetch accepted friend requests and update friendsList
      try {
        this.friendsList = await firstValueFrom(this.friendRequestsService.getFriends(uid));
        console.log('Fetched Friends:', this.friendsList);
      } catch (error) {
        console.error('Error fetching friends:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error loading user details:', error);
    }
  }
  
  
  

  // Add the refresh method
  async refreshAllContent(event: any) {
    await this.loadUserDetails(); // Reload user details, saved venues, and friends list
    event.target.complete(); // Dismiss the refresher
  }

  // Check if the venue is saved
  isVenueSaved(venueId: string): boolean {
    return this.savedVenues.some(venue => venue.id === venueId);
  }

  // Toggle between saving and unsaving the venue
  async toggleSave(venue: SavedVenue) {
    try {
      if (!this.user) throw new Error('User not authenticated');
      
      if (this.isVenueSaved(venue.id)) {
        await this.saveVenues.unsaveVenue(venue.id);
      } else {
        await this.saveVenues.saveVenue(venue.id);
      }
  
      // Fetch the updated saved venues list
      this.savedVenues = await this.saveVenues.getSavedVenues(this.user.uid);
  
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
  async presentPictureActionSheet() {
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

  async presentLogoutActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Are you sure?',
      buttons: [
        {
          text: 'Logout',
          role: 'destructive',
          handler: () => {
            this.signOut();
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
    try {
      if (!this.user || !this.user.uid) {
        throw new Error('User is not authenticated');
      }

      const image = await Camera.getPhoto({
        quality: 100,
        allowEditing: true,
        source: CameraSource.Camera,
        resultType: CameraResultType.Uri,
      });

      if (image) {
        const response = await fetch(image.webPath!);
        const blob = await response.blob();
        const file = new File([blob], `profile_pictures_${this.user.uid}.jpg`, {
          type: 'image/jpeg',
        });

        // Upload and update profile picture
        const downloadURL = await this.authService.updateProfilePicture(this.user.uid, file);
        this.userDetails.imageURL = downloadURL;

        // Show success toast
        await this.presentToast('Profile picture updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile picture:', error);
      await this.presentToast('Error updating profile picture!', 'danger');
    }
  }

  async deleteImage() {
    try {
      if (!this.user || !this.user.uid) {
        throw new Error('User is not authenticated');
      }

      await this.authService.deleteProfilePicture(this.user.uid);
      this.userDetails.imageURL = 'https://ionicframework.com/docs/img/demos/avatar.svg'; // Default avatar

      await this.presentToast('Profile picture deleted successfully!');
    } catch (error) {
      console.error('Error deleting profile picture:', error);
      await this.presentToast('Error deleting profile picture!', 'danger');
    }
  }

  // Helper method to display a toast
  async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Display for 2 seconds
      color: color,   // Success or error color (can use 'success', 'danger', 'warning', etc.)
      position: 'bottom' // You can change to 'top' or 'middle'
    });
    toast.present();
  }

  signOut() {
    this.authService.signOut();
  }

  async openEditModal() {
    const modal = await this.modalController.create({
      component: EdituserdetailsComponent
    });

    await modal.present();
  }
}
