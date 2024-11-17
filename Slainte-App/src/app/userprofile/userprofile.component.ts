import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { FriendrequestsService } from '../services/friendrequests.service';
import { Router } from '@angular/router';
import { SavevenuesService } from '../services/savevenues.service';
import { firstValueFrom, of, switchMap } from 'rxjs';
import { ActionSheetController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '@firebase/auth-types';


@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.scss'],
})
export class UserprofileComponent  implements OnInit {

  userId: string; // The ID of the other user
  userProfile: any;
  selectedSegment: string = 'savedVenues'; // Default selected segment
  currentUserId: string; // Current user ID
  isFriend: boolean; // Tracks friendship status
  sentRequests = new Set<string>();  // Needed for add friend functionality
  isRequestPending: boolean;

  constructor(private route: ActivatedRoute, private router: Router, private friendRequestService: FriendrequestsService, private saveVenues: SavevenuesService, private actionSheetController: ActionSheetController, private authService: AuthenticationService) { }

  ngOnInit() {
    this.authService.getUser().pipe(
      switchMap((user) => {
        if (user) {
          this.currentUserId = user.uid; // Set current user ID
          console.log('Authenticated user ID:', this.currentUserId);
          return this.route.paramMap; 
        } else {
          console.error('No authenticated user found.');
          throw new Error('No authenticated user');
        }
      })
    ).subscribe({
      next: (params) => {
        this.userId = params.get('userId'); // Retrieve the other user's ID
        this.loadUserProfile(); // Load profile data
        this.checkFriendshipStatus(); 
      },
      error: (error) => {
        console.error('Error initializing component:', error);
      }
    });
  }
  
  
  // Load the friend's profile using the friendId
  async loadUserProfile() {
    if (this.userId) {
      try {
        // Get the user profile data
        const profiles = await firstValueFrom(this.friendRequestService.getUserDetails([this.userId]));
        this.userProfile = profiles[0];  // Assume only one profile is returned
  
        // Get saved venues with images for the user
        const savedVenues = await this.saveVenues.getSavedVenues(this.userId);
        if (savedVenues && savedVenues.length > 0) {
          this.userProfile.savedVenues = await this.saveVenues.getVenuesWithImages(savedVenues);
          console.log('Fetched saved venues with images:', this.userProfile.savedVenues);
        } else {
          console.log('No saved venues found for this user.');
          this.userProfile.savedVenues = [];
        }
  
        // Get the friend list for the user's profile
        this.userProfile.friendsList = await firstValueFrom(this.friendRequestService.getFriends(this.userId));
        console.log('Fetched Friends:', this.userProfile.friendsList);
  
      } catch (error) {
        console.error('Error loading user details or friends list:', error);
      }
    }
  }

  // Call the service to check friendship status
  checkFriendshipStatus() {
    if (!this.currentUserId || !this.userId) return;
  
    // Check friendship status
    this.friendRequestService.checkFriendshipStatus(this.currentUserId, this.userId).pipe(
      switchMap((status) => {
        this.isFriend = status;
        console.log(`Friendship status between ${this.currentUserId} and ${this.userId}:`, status);
  
        if (!status) {
          // If not friends, check if a pending request exists in the other user's collection
          return this.friendRequestService.checkPendingRequest(this.currentUserId, this.userId);
        } else {
          this.isRequestPending = false; // No pending request if already friends
          return of(false); // Return false to stop further checks
        }
      })
    ).subscribe({
      next: (isPending) => {
        this.isRequestPending = isPending;
        console.log(`Pending request status between ${this.currentUserId} and ${this.userId}:`, this.isRequestPending);
      },
      error: (error) => {
        console.error('Error checking friendship or pending request:', error);
      }
    });
  }
  

  sendRequest(toUserId: string) {
    if (this.currentUserId) {
      this.friendRequestService.sendFriendRequest(this.currentUserId, toUserId)
        .then(() => {
          console.log('Friend request sent');
          this.sentRequests.add(toUserId); // Add to the sentRequests set
          this.checkFriendshipStatus(); // Recheck friendship status after sending the friend request for instant UI updates
        })
        .catch(error => {
          console.error('Error sending friend request:', error);
        });
    }
  }

  removeFriend(fromUserId: string, toUserId: string): void {
    this.friendRequestService.removeFriend(fromUserId, toUserId)
      .then(() => {
        console.log('Friend removed successfully');
      })
      .catch((error) => {
        console.error('Error removing friend:', error);
      });
  }

  async removeFriendActionSheet(friendId: string) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Are you sure?',
      buttons: [
        {
          text: 'Unfriend',
          role: 'destructive',
          handler: () => {
            this.removeFriend(this.currentUserId, friendId);
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

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value; // Update segment based on selection
  }
}
