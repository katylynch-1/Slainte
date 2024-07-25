import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../services/user.service';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{

  users?: Observable<User[]>;
 

  constructor() {
    
  }

  ngOnInit(){
    
  }



}
