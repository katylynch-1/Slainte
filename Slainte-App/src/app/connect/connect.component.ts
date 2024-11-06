import { Component, OnInit } from '@angular/core';
import { FriendrequestsService } from '../services/friendrequests.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.scss'],
})
export class ConnectComponent  implements OnInit {

  constructor(private authService: AuthenticationService, private friendRequestService: FriendrequestsService) { }

  users: any[] = [];
  currentUserId: string | undefined;

  ngOnInit(): void {
    // Subscribe to getUser to get the current authenticated user’s ID
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.currentUserId = user.uid;
        this.loadUsers();
      }
    });
  }

  // Load all users except the current user
  loadUsers() {
    this.friendRequestService.getAllUsers().subscribe(users => {
      this.users = users.filter(user => user.id !== this.currentUserId);
    });
  }

  sendRequest(toUserId: string) {
    if (this.currentUserId) {
      this.friendRequestService.sendFriendRequest(this.currentUserId, toUserId)
        .then(() => console.log('Friend request sent'))
        .catch(error => console.error('Error sending friend request:', error));
    }
  }

}
