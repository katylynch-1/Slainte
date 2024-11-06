import { Component, OnInit } from '@angular/core';
import { MessagingService } from '../services/messaging.service';
// import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { Message } from '../message.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})


export class ChatComponent  implements OnInit {

  messages: Message[] = []; //Interface to hold message structure
  newMessage: string = ''; // New message string 
  chatId: string = '';
  user1Id: string = '';
  user2Id: string = '';
  currentUserId: string;
  recipientName: string = '';

  constructor(private authService: AuthenticationService, private messagingService: MessagingService, private route: ActivatedRoute) { }

  ngOnInit() {

    this.authService.getUser().subscribe(user => {
      if (user) {
        this.user1Id = user.uid; // Get current logged in user and assign it as user1Id

        this.route.paramMap.subscribe(params => {
          this.user2Id = params.get('recipientId') || ''; // Get recipient Id as user2Id 

          this.generateChatId();
          this.loadRecipientName(); 
        });
      }
    });
  }

  async loadRecipientName() {
    if (this.user2Id) {
      const recipient = await firstValueFrom(this.messagingService.getUserById(this.user2Id)).catch(err => {
        console.error('Error fetching recipient data:', err);
        return null;
      });
      this.recipientName = recipient ? `${recipient.firstName} ${recipient.lastName}` : 'Unknown User';
    }
  }

  generateChatId() { // Create chat ID based on user 1 and user 2 ids
    if (this.user1Id && this.user2Id) {
      // Sort the user IDs to create a consistent chatId
      const ids = [this.user1Id, this.user2Id].sort();
      this.chatId = `${ids[0]}_${ids[1]}`; // acts like a URL to create path to chat

      this.loadMessages(); // Retrieve all messages 
    }
  }
  
  loadMessages() {
    this.messagingService.getMessages(this.chatId).subscribe(messagesData => { // Retrieve messages data from firebase
      console.log('Messages from Firebase:', messagesData);

      // Fetch sender names for each message asynchronously
      const messagePromises = messagesData.map(async message => {
        console.log('Fetching user for senderId:', message.senderId);

        // Use lastValueFrom to await user data
      const sender = await firstValueFrom(this.messagingService.getUserById(message.senderId)).catch(err => {
        console.error(`Error fetching user for senderId ${message.senderId}:`, err);
        return null; // Return null if user fetch fails
      });

      console.log('Sender data:', sender); // Log sender data or error

      return {
        ...message,
        senderName: sender ? `${sender.firstName} ${sender.lastName}` : 'Unknown Sender' // Set name or default to "Unknown Sender"
      };
    });
  
      // Wait for all names to be fetched before updating `this.messages`
      Promise.all(messagePromises).then(messagesWithNames => {
        console.log('Messages with sender names:', messagesWithNames);
        this.messages = messagesWithNames;
      }).catch(error => console.error('Error in Promise.all:', error));
    });
  }
  

  sendMessage() {

    if (this.newMessage.trim() !== '') {
      this.messagingService.sendMessage(this.chatId, this.newMessage);
      this.newMessage = '';
    }
  }
}
