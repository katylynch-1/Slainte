import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { MessagingService } from '../services/messaging.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { User } from '@firebase/auth-types';
import { EdituserdetailsComponent } from '../edituserdetails/edituserdetails.component';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{

  user: User;
  userDetails: any = null;
  users$: Observable<any[]>; // Observable to hold user list
  currentUserId: string; // Store current user's uid


  constructor(private authService: AuthenticationService, 
    private router: Router, 
    private modalController: ModalController, 
    private userService: UserService, 
    private messagingService: MessagingService) {}

  ngOnInit(){
    this.authService.getUser().subscribe(user => {
      if(user) {
        this.user = user;
        this.currentUserId = user.uid;
        this.loadUsers(); 

      // Fetch additional user details from Firestore
      this.authService.getUserDetails(user.uid).subscribe(details => {
        this.userDetails = details;
      });
    }
    });
  }

  signOut(){
    this.authService.signOut()
  }

  async openEditModal(){
    const modal = await this.modalController.create({
      component: EdituserdetailsComponent
    });

    await modal.present();

  }

  loadUsers() {
    // Load all users currently on Firestore (Friends List)
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
