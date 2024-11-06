import { Component, OnInit } from '@angular/core';
import { MessagingService } from '../services/messaging.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '@firebase/auth-types';

@Component({
  selector: 'app-messages-tab',
  templateUrl: './messages-tab.page.html',
  styleUrls: ['./messages-tab.page.scss'],
})
export class MessagesTabPage implements OnInit {

  chats: any[] = [];
  currentUserId: string;
  users: any[] = [];

  constructor(private authService: AuthenticationService, private messagingService: MessagingService, private router: Router) { }

  ngOnInit() {
    this.messagingService.getUserChats().subscribe(data => {
      console.log(data);
      this.chats = data;
    });

    this.authService.getUser().subscribe( user => {
      if(user){
        this.currentUserId = user.uid;
        this.loadChats();
        this.loadUsers();
      }
    });
  }

  loadUsers() {
    this.messagingService.getUsers().subscribe(usersData => {
      this.users = usersData; // Store user details for name lookup
    });
  }

  loadChats() {
    this.messagingService.getUserChats().subscribe(data => {
      this.chats = data; // Fetch the chats for the current user
    });
  }

  openChat(user2Id: string) {
    if (user2Id) {
      // this.router.navigate([`/chat`, { recipientId: user2Id }]);
      this.router.navigate([`/chat/${user2Id}`]);
    } else {
      console.error('Error: user2Id is undefined');
    }
  }

  openNewChat() {
    this.router.navigate(['/new-chat']); // Navigate to the new chat modal
  }

  getRecipientId(chat: any) {
    return chat.user1Id === this.currentUserId ? chat.user2Id : chat.user1Id;
  }

  getRecipientName(chat: any) {
    const recipientId = this.getRecipientId(chat);
    const recipient = this.users.find(user => user.uid === recipientId);
    return recipient ? `${recipient.firstName} ${recipient.lastName}` : 'Unknown User';
  }

}
