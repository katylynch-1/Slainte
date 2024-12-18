import { Component, OnInit } from '@angular/core';
import { FriendrequestsService } from '../services/friendrequests.service';
import { AuthenticationService } from '../services/authentication.service';
import { ProfilenavigationService } from '../services/profilenavigation.service';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.scss'],
})
export class ConnectComponent implements OnInit {

  constructor(private authService: AuthenticationService, private friendRequestService: FriendrequestsService, private profileNavService: ProfilenavigationService) { }

  users: any[] = [];
  currentUserId: string | undefined;
  sentRequests = new Set<string>();  // Store user IDs who have received a friend request

  ngOnInit(): void {
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.currentUserId = user.uid;
        this.loadUsers();
      }
    });
  }

  // Displays a list of users except the current user and friends
  loadUsers() {
    if (!this.currentUserId) return;
    this.friendRequestService.findOtherUsers(this.currentUserId).subscribe(users => {
      this.users = users;
      console.log('All users except current user and friends:', this.users);
    });
  }
  
  
  // Send a friend request and update the sentRequests set
  sendRequest(toUserId: string) {
    if (this.currentUserId) {
      this.friendRequestService.sendFriendRequest(this.currentUserId, toUserId)
        .then(() => {
          console.log('Friend request sent');
          this.sentRequests.add(toUserId); // Add to the sentRequests set
        })
        .catch(error => {
          console.error('Error sending friend request:', error);
        });
    }
  }

    unsendRequest(toUserId: string) {
      if (this.currentUserId) {
        this.friendRequestService.unsendFriendRequest(this.currentUserId, toUserId)
          .then(() => {
            console.log('Friend request sent');
            this.sentRequests.add(toUserId); // Add to the sentRequests set
          })
          .catch(error => {
            console.error('Error sending friend request:', error);
          });
      }
    }

  // Check if a user has already received a friend request (if true icon turns filled)
  isFriendRequested(userId: string): boolean {
    return this.sentRequests.has(userId);  
  }

  // Call this method when a user clicks on a profile from anywhere in the app
  viewUserProfile(userId: string) {
    this.profileNavService.navigateToProfile(userId);
  }
}
