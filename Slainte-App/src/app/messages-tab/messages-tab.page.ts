import { Component, OnInit } from '@angular/core';
import { MessagingService } from '../services/messaging.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { firstValueFrom } from 'rxjs';
import { ActionSheetController } from '@ionic/angular';


@Component({
  selector: 'app-messages-tab',
  templateUrl: './messages-tab.page.html',
  styleUrls: ['./messages-tab.page.scss'],
})
export class MessagesTabPage implements OnInit {

  chats: any[] = [];
  currentUserId: string;
  users: any[] = [];

  constructor(private authService: AuthenticationService, 
    private messagingService: MessagingService, 
    private router: Router,
    private actionSheetController: ActionSheetController) { }

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
      this.users = usersData; 
    });
  }


  async loadChats() {
    this.messagingService.getUserChats().subscribe(async data => {
      // Add recipient name and image URL to each chat entry, and filter out any chat without a valid recipient
      this.chats = (await Promise.all(data.map(async chat => {
        const recipientId = this.getRecipientId(chat);
        const recipientData = await this.loadRecipientData(recipientId);
        
        // Only return the chat if recipient data is found
        if (recipientData) {
          return {
            ...chat,
            recipientName: `${recipientData.firstName} ${recipientData.lastName}`,
            recipientImageURL: recipientData.imageURL || 'assets/images/default-profile.png'
          };
        } else {
          return null; // Return null for any chat without a recipient
        }
      })))
      .filter(chat => chat !== null); // Filter out null results
  
      // Sort by the latest message timestamp
      this.chats = this.chats.sort((a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp);
    });
  }
  

  async loadRecipientData(userId: string) {
    return await firstValueFrom(this.messagingService.getUserById(userId)).catch(error => {
      console.error('Error loading recipient data:', error);
      return null;
    });
  }
  

  openChat(user2Id: string) {
    if (user2Id) {
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
    if (!recipient) console.warn(`Recipient not found for ID: ${recipientId}`);
    return recipient ? `${recipient.firstName} ${recipient.lastName}` : 'Unknown User';
  }

  async refreshAllContent(event: any) {
    this.loadUsers(); 
    this.loadChats(); 
    event.target.complete(); 
  }

  async presentDeleteChatActionSheet(chat: any) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Delete Chat',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.deleteChat(chat);
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  async deleteChat(chat: any) {
    const chatId = this.messagingService.generateChatId(this.currentUserId, this.getRecipientId(chat));
    try {
      await this.messagingService.deleteChat(chatId, this.currentUserId);
      // Update local chats array after successful deletion
      this.chats = this.chats.filter(c => c !== chat);
      console.log('Chat deleted successfully');
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  }
}
