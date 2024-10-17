import { Component, OnInit } from '@angular/core';
import { MessagingService } from '../services/messaging.service';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent  implements OnInit {

  messages$: Observable<any[]>;
  chatId: string;
  currentUser: any;
  newMessage: string = '';

  constructor(private messagingService: MessagingService, private authService: AuthenticationService) { }

  ngOnInit() {
    // Subscribe to the current logged-in user
    this.authService.getUser().subscribe((user) => {
      this.currentUser = user;
      if (user) {
        // Start a chat with a specific receiver, e.g., 'receiverId'
        const receiverId = 'exampleReceiverId';  // You will dynamically get this
        this.startChat(user.uid, receiverId);
      }
    });
  }

  startChat(senderId: string, receiverId: string) {
    //Check for an existing chat or create a new one
    this.messagingService.findOrCreateChat(senderId, receiverId).then((chatId) => {
      this.chatId = chatId;
      //Load Chat messages
      this.loadMessages();
    });
  }

  loadMessages() {
    this.messages$ = this.messagingService.getChatMessages(this.chatId);
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messagingService
      .sendMessage(this.chatId, this.currentUser.uid, 'exampleReceiverId', this.newMessage)
      .then(() => {
        this.newMessage = ''; //Clear input after sending
      });
    }
  }


}
