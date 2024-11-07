import { Component, OnInit } from '@angular/core';
import { FriendrequestsService } from '../services/friendrequests.service';
import { AuthenticationService } from '../services/authentication.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent  implements OnInit {

  incomingRequests: any[] = [];
  acceptedRequests: any[] = [];
  currentUserId: string;

  constructor(private modalController: ModalController, private friendRequestService: FriendrequestsService, private authService: AuthenticationService) { }

  
  ngOnInit(): void {
    // Subscribe to the authentication service to get the current user
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.currentUserId = user.uid; // Set the current user ID
        // Now that we have the currentUserId, fetch incoming friend requests
        this.loadIncomingRequests();
        this.loadAcceptedRequests();
      }
    });
  }

  // Fetch incoming friend requests for the current user
  private loadIncomingRequests(): void {
    if (this.currentUserId) {
      this.friendRequestService.getFriendRequests(this.currentUserId, 'pending')
        .subscribe(requests => {
          this.incomingRequests = requests;
        });
    }
  }

    // Fetch incoming friend requests for the current user
    private loadAcceptedRequests(): void {
      if (this.currentUserId) {
        this.friendRequestService.getFriendRequests(this.currentUserId, 'accepted')
          .subscribe(requests => {
            this.acceptedRequests = requests;
          });
      }
    }

  acceptRequest(fromUserId: string) {
    this.friendRequestService.acceptFriendRequest(fromUserId, this.currentUserId)
      .then(() => console.log('Friend request accepted'))
      .catch(error => console.error('Error accepting friend request:', error));
  }

  rejectRequest(fromUserId: string) {
    this.friendRequestService.rejectFriendRequest(fromUserId, this.currentUserId)
      .then(() => console.log('Friend request rejected'))
      .catch(error => console.error('Error rejecting friend request:', error));
  }

  dismissModal() {
    this.modalController.dismiss();
  }
}
