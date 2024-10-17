import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { MessagingService } from '../services/messaging.service';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent  implements OnInit {

  users$: Observable<any[]>; // Observable to hold user list
  currentUserId: string; // Store current user's uid

  constructor(private userService: UserService, private messagingService: MessagingService, private authService: AuthenticationService, private router: Router) { }

  ngOnInit() {
    //get the current user's uid
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.currentUserId = user.uid;
        this.loadUsers(); 
      }
    });
  }

  loadUsers() {
    this.users$ = this.userService.getUsers();
  }

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
