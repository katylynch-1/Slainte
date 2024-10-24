import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { MessagingService } from '../services/messaging.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { User } from '@firebase/auth-types';
import { EdituserdetailsComponent } from '../edituserdetails/edituserdetails.component';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ActionSheetController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { SavevenuesService } from '../services/savevenues.service';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{

  user: User;
  userDetails: any = null;
  savedVenues: string[] = [];
  users$: Observable<any[]>; // Observable to hold user list
  currentUserId: string; // Store current user's uid
  selectedSegment: string = 'saved'; // Default selected segment


  

  constructor(private authService: AuthenticationService, 
    private router: Router, 
    private modalController: ModalController, 
    private userService: UserService, 
    private messagingService: MessagingService,
    private actionSheetController: ActionSheetController,
    private saveVenues: SavevenuesService) {}

    ngOnInit() {
      this.loadUserDetails();
    }
  
    loadUserDetails() {
      // Get the currently authenticated user
      this.authService.getUser().subscribe(user => {
        if (user) {
          const uid = user.uid;  // Get the user's UID
          
          // Fetch user details including saved venues
          this.authService.getUserDetails(uid).subscribe(async userDetails => {
            this.userDetails = userDetails;
    
            // Fetch saved venues using SavevenuesService
            this.savedVenues = await this.saveVenues.getSavedVenues(); // Use the service to get saved venues
            console.log('Saved Venues:', this.savedVenues);
          });
        } else {
          console.error('No user is currently authenticated.');
        }
      });
    }
    
  
    // Check if the venue is saved
    isVenueSaved(venueId: string): boolean {
      return this.savedVenues.includes(venueId);
    }
  
    // Toggle between saving and unsaving the venue
    async toggleSave(venueId: string) {
      if (this.isVenueSaved(venueId)) {
        await this.saveVenues.unsaveVenue(venueId);  // Unsave the venue
        this.savedVenues = this.savedVenues.filter(id => id !== venueId); // Remove from local array
      } else {
        await this.saveVenues.saveVenue(venueId);    // Save the venue
        this.savedVenues.push(venueId); // Add to local array
      }
      console.log('Updated saved venues:', this.savedVenues);
    }

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value; // Update segment based on selection
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

  // loadUsers() {
  //   // Load all users currently on Firestore (Friends List)
  //   this.users$ = this.userService.getUsers();
  // }

  startChatWith(userId: string) {
    this.messagingService.findOrCreateChat(this.currentUserId, userId)
      .then((chatId: string) => { 
        console.log(`Chat started with ${userId}, Chat ID: ${chatId}`);
        this.router.navigate(['/chat', chatId]); 
      })
      .catch(error => {
        console.error('Error starting chat:', error);
      });
  }


}
