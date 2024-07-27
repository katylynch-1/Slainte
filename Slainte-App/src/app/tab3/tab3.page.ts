import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { User } from '../services/user.service';

// import { UserService, User } from '../services/user.service';
// import { Router, ActivatedRoute } from '@angular/router';
// import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{

  // users?: Observable<User[]>;
  userData: User | null = null;
 

  constructor(private authService: AuthenticationService, private router:Router) {}

  signOut(){
    this.authService.signOut()
    // this.router.navigate(['login']);
  }

  ngOnInit(){
    this.authService.ngFireAuth.authState.subscribe(user => {
      if(user) {
        this.authService.getUserData(user.uid).subscribe(data => {
          this.userData = data;
        });
      }
    });
    
  }



}
