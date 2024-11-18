import { Component, Input, OnInit } from '@angular/core';
import { FriendrequestsService } from '../services/friendrequests.service';
import { AuthenticationService } from '../services/authentication.service';
import { firstValueFrom } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { MessagingService } from '../services/messaging.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-share-with-friends',
  templateUrl: './share-with-friends.component.html',
  styleUrls: ['./share-with-friends.component.scss'],
})
export class ShareWithFriendsComponent  implements OnInit {
  
  @Input() shareableUrl: string; // Receive the shareable URL from the parent
  user: any;
  currentUserId: any;
  friendsList: any[] = []; // List of friends

  constructor(private friendRequestService: FriendrequestsService, private authService: AuthenticationService, private messagingService: MessagingService, private modalController: ModalController, private router: Router) { }

  ngOnInit() {
    this.loadUserDetails(); // Load user details when the component is initialized
  }

  async loadUserDetails() {
    try {
      // Get the currently authenticated user
      this.user = await firstValueFrom(this.authService.getUser());

      if (this.user) {
        this.currentUserId = this.user.uid; // Get the current user ID

        // Fetch the list of accepted friends (friends list)
        this.friendRequestService.getFriends(this.currentUserId).subscribe(friends => {
          console.log('Fetched Friends:', friends); // Log the friends data for debugging
          this.friendsList = friends; // Store the fetched friends in friendsList
        });

      } else {
        console.error('No user is currently authenticated.');
      }
    } catch (error) {
      console.error('Error loading user details:', error);
    }
  }

  shareWithFriend(friend: any) {
    const friendId = friend.id;
  
    // Use startChat to handle chat creation or navigation
    this.startChat(friendId).then(chatId => {
      // Send the shareable URL as a message
      this.messagingService.sendMessage(chatId, `Check out this venue: ${this.shareableUrl}`);
      console.log(`Venue shared with ${friend.name}`);
      this.dismiss(); // Close the modal after sharing
    }).catch(err => {
      console.error('Error starting chat or sharing venue:', err);
    });
  }
  

  async startChat(user2Id: string): Promise<string> {
    const chatId = this.messagingService.generateChatId(this.currentUserId, user2Id);
  
    // Check if the chat already exists
    const chatExists = await this.messagingService.checkIfChatExists(chatId);
  
    if (chatExists) {
      console.log('Chat already exists, navigating to it.');
      this.router.navigateByUrl(`/chat/${user2Id}`);
    } else {
      console.log('Creating a new chat.');
      await this.messagingService.createChat(chatId, this.currentUserId, user2Id);
      console.log('Chat created successfully');
      this.router.navigateByUrl(`/chat/${user2Id}`);
    }
  
    return chatId; // Return the chatId for further use
  }
  
  

  dismiss() {
    this.modalController.dismiss();
  }
}
