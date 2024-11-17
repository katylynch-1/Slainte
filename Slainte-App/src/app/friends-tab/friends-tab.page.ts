import { Component, OnInit } from '@angular/core';
import { FriendrequestsService } from '../services/friendrequests.service';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '@firebase/auth-types';
import { firstValueFrom } from 'rxjs';
import { ActionSheetController } from '@ionic/angular';
import { ProfilenavigationService } from '../services/profilenavigation.service';

@Component({
  selector: 'app-friends-tab',
  templateUrl: './friends-tab.page.html',
  styleUrls: ['./friends-tab.page.scss'],
})
export class FriendsTabPage implements OnInit {

  user: User | null = null;
  selectedSegment: string = 'friends'; // Default segment
  friendsList: any[] = []; // List of friends
  incomingRequests: any[] = []; // List of incoming requests
  currentUserId: string | undefined; // Current user ID

  constructor(
    private friendRequestService: FriendrequestsService, 
    private authService: AuthenticationService,
    private actionSheetController: ActionSheetController,
    private profileNavigation: ProfilenavigationService
  ) {}

  async refreshAllContent(event: any) {
    await this.loadUserDetails(); // Reload user details, saved venues, and friends list
    event.target.complete(); // Dismiss the refresher
  }

  ngOnInit() {
    this.loadUserDetails(); // Load user details when the component is initialized
  }

  async loadUserDetails() {
    try {
      // Get the currently authenticated user
      this.user = await firstValueFrom(this.authService.getUser());

      if (this.user) {
        this.currentUserId = this.user.uid; // Get the current user ID

        // Fetch the list of accepted friends (friends list)
        this.friendRequestService.getFriends(this.currentUserId).subscribe(friends => {
          console.log('Fetched Friends:', friends); // Log the friends data for debugging
          this.friendsList = friends; // Store the fetched friends in friendsList
        });

        // Fetch incoming friend requests (pending requests)
        this.friendRequestService.getFriendRequests(this.currentUserId, 'pending').subscribe(requests => {
          console.log('Incoming Friend Requests:', requests); // Log the incoming requests for debugging
          this.incomingRequests = requests; // Store the incoming requests
        });
      } else {
        console.error('No user is currently authenticated.');
      }
    } catch (error) {
      console.error('Error loading user details:', error);
    }
  }

  // Handle accepting a friend request
  acceptRequest(fromUserId: string) {
    this.friendRequestService.acceptFriendRequest(fromUserId, this.currentUserId).subscribe({
      next: () => {
        console.log('Friend request accepted');
        this.incomingRequests = this.incomingRequests.filter(request => request.id !== fromUserId); // Remove the accepted request
      },
      error: error => {
        console.error('Error accepting friend request:', error);
      }
    });
  }

  // Method to reject a friend request
  rejectRequest(fromUserId: string) {
    this.friendRequestService.rejectFriendRequest(fromUserId, this.currentUserId).then(() => {
      console.log('Friend request rejected');
      this.incomingRequests = this.incomingRequests.filter(request => request.id !== fromUserId); // Remove the rejected request
    }).catch(error => {
      console.error('Error rejecting friend request:', error);
    });
  }

  viewUserProfile(userId: string) {
    this.profileNavigation.navigateToProfile(userId);
  }

  // Update selected segment for tab navigation
  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }
}
