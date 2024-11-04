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

  // messages$: Observable<any[]>;
  // chatId: string;
  // receiverId: string;
  // currentUser: any;
  // newMessage: string = '';


  messages: Message[] = []; //Interface to hold message structure
  newMessage: string = ''; // New message string 
  chatId: string = '';
  user1Id: string = '';
  user2Id: string = '';

  constructor(private authService: AuthenticationService, private messagingService: MessagingService, private route: ActivatedRoute) { }

  ngOnInit() {

    this.authService.getUser().subscribe(user => {
      if (user) {
        this.user1Id = user.uid; // Get current logged in user and assign it as user1Id

        this.route.paramMap.subscribe(params => {
          this.user2Id = params.get('recipientId') || ''; // Get recipient Id as user2Id 

          this.generateChatId(); 
        });
      }
    });

    // Subscribe to the current logged-in user
    // this.authService.getUser().subscribe((user) => {
    //   this.currentUser = user;
    //   if (user) {
        
    //     // Get the receiverId from query parameters
    //     this.route.queryParamMap.subscribe((params) => {
    //       this.receiverId = params.get('receiverId');
    //       if(this.receiverId) {
    //         // Start the chat with the current user's ID and the selected receiver's ID
    //         this.startChat(user.uid, this.receiverId);
    //       } else {
    //         console.error('No receiverId provided')
    //       }
    //     });
    //   }
    // });
  }

  generateChatId() { // Create chat ID based on user 1 and user 2 ids
    if (this.user1Id && this.user2Id) {
      // Sort the user IDs to create a consistent chatId
      const ids = [this.user1Id, this.user2Id].sort();
      this.chatId = `${ids[0]}_${ids[1]}`; // acts like a URL to create path to chat

      this.loadMessages(); // Retrieve all messages 
    }
  }

  // loadMessages() {
  //   this.messagingService.getMessages(this.chatId).subscribe(data => {
  //     this.messages = data;
  //   });
  // }

  // loadMessages() {
  //   this.messagingService.getMessages(this.chatId).subscribe(messagesData => {
  //     // Map through each message to retrieve sender name
  //     const messageObservables = messagesData.map(async message => {
  //       const senderId = message.senderId;
  //       const sender = await this.messagingService.getUserById(senderId).toPromise(); // Fetch sender's data
  //       return {
  //         ...message,
  //         senderName: sender ? `${sender.firstName} ${sender.lastName}` : 'Unknown Sender'
  //       };
  //     });
  //     Promise.all(messageObservables).then(messagesWithSenderNames => {
  //       this.messages = messagesWithSenderNames;
  //     });
  //   });
  // }

  // loadMessages() {
  //   this.messagingService.getMessages(this.chatId).subscribe(async (messagesData: Message[]) => {
  //     // Use Promise.all to await all name fetches
  //     const messagesWithNames = await Promise.all(messagesData.map(async message => {
  //       // Fetch the sender's name using senderId
  //       const sender = await this.messagingService.getUserById(message.senderId).toPromise();
  //       return {
  //         ...message,
  //         senderName: sender ? `${sender.firstName} ${sender.lastName}` : 'Unknown Sender'
  //       };
  //     }));
  //     this.messages = messagesWithNames;
  //   });
  // }
  
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

    // sendMessage(){
    // if (this.newMessage.trim()) {
    //   this.messagingService
    //   .sendMessage(this.chatId, this.currentUser.uid, this.receiverId, this.newMessage)
    //   .then(() => {
    //     this.newMessage = ''; //Clear input after sending
    //   });
    // }
    //}

  // startChat(senderId: string, receiverId: string) {
  //   //Check for an existing chat or create a new one
  //   this.messagingService.findOrCreateChat(senderId, receiverId).then((chatId) => {
  //     this.chatId = chatId;
  //     //Load Chat messages
  //     this.loadMessages();
  //   });
  // }

  // loadMessages() {
  //   this.messages$ = this.messagingService.getChatMessages(this.chatId);
  // }

}
