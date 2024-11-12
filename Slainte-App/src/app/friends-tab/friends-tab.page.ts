import { Component, OnInit } from '@angular/core';
import { FriendrequestsService } from '../services/friendrequests.service';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '@firebase/auth-types';
import { firstValueFrom } from 'rxjs';

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
    private authService: AuthenticationService
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
  acceptRequest(requestId: string) {
    if (this.currentUserId) {
      this.friendRequestService.acceptFriendRequest(this.currentUserId, requestId).then(() => {
        // After accepting the request, update the lists
        this.incomingRequests = this.incomingRequests.filter(req => req.id !== requestId); // Remove from incoming requests
        this.friendRequestService.getFriends(this.currentUserId).subscribe(friends => {
          this.friendsList = friends; // Update the friends list
        });
      }).catch(error => {
        console.error('Error accepting friend request:', error);
      });
    }
  }

  // Handle rejecting a friend request
  rejectRequest(requestId: string) {
    if (this.currentUserId) {
      this.friendRequestService.rejectFriendRequest(this.currentUserId, requestId).then(() => {
        // After rejecting the request, update the lists
        this.incomingRequests = this.incomingRequests.filter(req => req.id !== requestId); // Remove from incoming requests
      }).catch(error => {
        console.error('Error rejecting friend request:', error);
      });
    }
  }

  // Update selected segment for tab navigation
  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }
}
