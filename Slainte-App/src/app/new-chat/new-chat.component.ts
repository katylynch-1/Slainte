import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { MessagingService } from '../services/messaging.service';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-chat',
  templateUrl: './new-chat.component.html',
  styleUrls: ['./new-chat.component.scss'],
})
export class NewChatComponent  implements OnInit {

  users$: Observable<any[]>; // Observable to hold user list
  currentUserId: string; // Store current user's uid

  recipientId: string;

  constructor(private userService: UserService, private messagingService: MessagingService, private authService: AuthenticationService, private router: Router, private route: ActivatedRoute) { }

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

  loadUsers() {
    this.users$ = this.userService.getUsers();
  }

  // startChat(user2Id: string) {
  //   console.log('Starting chat with:', user2Id);
  //   const chatId = this.messagingService.generateChatId(this.currentUserId, user2Id);
  //   this.messagingService.createChat(chatId, this.currentUserId, user2Id).then(()=> {
  //     // this.router.navigate([`/chat`, { recipientId: user2Id }]);
  //     this.router.navigateByUrl(`/chat/${user2Id}`);
  //   });
  // }

  startChat(user2Id: string) {
    console.log('Starting chat with:', user2Id);
    const chatId = this.messagingService.generateChatId(this.currentUserId, user2Id);
    this.messagingService.createChat(chatId, this.currentUserId, user2Id).then(() => {
      console.log('Chat created successfully');
      this.router.navigateByUrl(`/chat/${user2Id}`);
    }).catch(error => console.error('Error creating chat:', error));
  }
  
  

}
