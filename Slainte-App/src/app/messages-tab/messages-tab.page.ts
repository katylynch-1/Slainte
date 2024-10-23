import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { MessagingService } from '../services/messaging.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { User } from '@firebase/auth-types';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-messages-tab',
  templateUrl: './messages-tab.page.html',
  styleUrls: ['./messages-tab.page.scss'],
})
export class MessagesTabPage implements OnInit {

  user: User; // User defined by Firebase Authentication
  userDetails: any = null; // User personal information and interests
  users$: Observable<any[]>; // Observable to hold user list
  currentUserId: string; // Store current user's uid

  constructor( private authService: AuthenticationService, private messagingService: MessagingService, private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      if(user) {
        this.user = user;
        this.currentUserId = user.uid;
        this.loadUsers(); 
      }
    });
  }

  loadUsers() {
    // Load all users currently on Firestore (Friends List)
    this.users$ = this.userService.getUsers();
  }

  startChatWith(userId: string) {
    this.messagingService.findOrCreateChat(this.currentUserId, userId)
      .then((chatId: string) => { 
        console.log(`Chat started with ${userId}, Chat ID: ${chatId}`);
        this.router.navigate(['/chat', chatId], {
          queryParams: { receiverId: userId }, //Pass the selected receiverId
        }); 
      })
      .catch(error => {
        console.error('Error starting chat:', error);
      });
  }

}
