import { Component, OnInit } from '@angular/core';
import { MessagingService } from '../services/messaging.service';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent  implements OnInit {

  messages$: Observable<any[]>;
  chatId: string;
  receiverId: string;
  currentUser: any;
  newMessage: string = '';

  constructor(private messagingService: MessagingService, private authService: AuthenticationService, private route: ActivatedRoute) { }

  ngOnInit() {
    // Subscribe to the current logged-in user
    this.authService.getUser().subscribe((user) => {
      this.currentUser = user;
      if (user) {
        
        // Get the receiverId from query parameters
        this.route.queryParamMap.subscribe((params) => {
          this.receiverId = params.get('receiverId');
          if(this.receiverId) {
            // Start the chat with the current user's ID and the selected receiver's ID
            this.startChat(user.uid, this.receiverId);
          } else {
            console.error('No receiverId provided')
          }
        });
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
      .sendMessage(this.chatId, this.currentUser.uid, this.receiverId, this.newMessage)
      .then(() => {
        this.newMessage = ''; //Clear input after sending
      });
    }
  }


}
