import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { MessagingService } from '../services/messaging.service';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FriendrequestsService } from '../services/friendrequests.service';

@Component({
  selector: 'app-new-chat',
  templateUrl: './new-chat.component.html',
  styleUrls: ['./new-chat.component.scss'],
})
export class NewChatComponent  implements OnInit {

  users$: Observable<any[]>; // Observable to hold user list
  currentUserId: string; // Store current user's uid

  recipientId: string;

  constructor(private userService: UserService, 
    private messagingService: MessagingService, 
    private authService: AuthenticationService, 
    private router: Router, 
    private route: ActivatedRoute,
    private friendRequestsService: FriendrequestsService) { }

  ngOnInit() {
    this.recipientId = this.route.snapshot.paramMap.get('recipientId');
        //get the current user's uid
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.currentUserId = user.uid;
        this.loadUsers(); 
      }
    });
  }

  // loadUsers() {
  //   this.users$ = this.userService.getUsers().pipe(
  //     map(users => users.filter(user => user.uid !== this.currentUserId)) // Filter out currently logged in user
  //   );
  // }

  loadUsers() {
    this.users$ = this.friendRequestsService.getFriends(this.currentUserId);
  }

  // startChat(user2Id: string) {
  //   const chatId = this.messagingService.generateChatId(this.currentUserId, user2Id);
  //   this.messagingService.createChat(chatId, this.currentUserId, user2Id).then(() => {
  //     console.log('Chat created successfully');
  //     this.router.navigateByUrl(`/chat/${user2Id}`);
  //   }).catch(error => console.error('Error creating chat:', error));
  // }

  async startChat(user2Id: string) {
    const chatId = this.messagingService.generateChatId(this.currentUserId, user2Id);
    
    // Check if the chat already exists
    const chatExists = await this.messagingService.checkIfChatExists(chatId);
    
    if (chatExists) {
      // Navigate to existing chat if it already exists
      console.log('Chat already exists, navigating to it.');
      this.router.navigateByUrl(`/chat/${user2Id}`);
    } else {
      // Otherwise, create a new chat
      console.log('Creating a new chat.');
      this.messagingService.createChat(chatId, this.currentUserId, user2Id).then(() => {
        console.log('Chat created successfully');
        this.router.navigateByUrl(`/chat/${user2Id}`);
      }).catch(error => console.error('Error creating chat:', error));
    }
  }

}
