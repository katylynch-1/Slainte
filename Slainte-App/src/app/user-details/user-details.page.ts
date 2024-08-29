import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.page.html',
  styleUrls: ['./user-details.page.scss'],
})
export class UserDetailsPage implements OnInit {

  user: User = {
    uid: '',
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    phoneNumber: '',
    pints: '',
    cocktails: '',
    wine: '',
    gin: '',
    whiskey: '',
    nonAlcoholic: '',
    goodGuinness: '',
    bar: '',
    pub: '',
    nightclub: '',
    lateBar: '',
  
    trad: '',
    pop: '',
    techno: '',
    house: '',
    indie: '',
    rock: '',
    rAndB: '',
    hipHop: '',
    reggaeton: '',
    jazz: '',
  
    energetic: '',
    cosy: '',
    alternative: '',
    relaxed: '',
    traditional: '',
    fancy: '',
    casual: '',
    lgbtq: '',
    loud: '',
  
    outdoorSeats: '',
    accessible: '',
    cloakRoom: '',
    smokingArea: '',
    beerGarden: '',
    danceFloor: '',
  
    festival: '',
    openMic: '',
    pubQuiz: '',
    rave: '',
    liveGig: '',
    dj: '',
    karaoke: '',
    comedy: '',
    sports: '',
    specialisedEvents: '',
    games: ''
    };

  constructor(private activatedRoute: ActivatedRoute, private userService: UserService) { }

  ngOnInit() {
  }

  // ionViewWillEnter(){
  //   let userID = this.activatedRoute.snapshot.paramMap.get('userID');
  //   if(userID) {
  //     this.userService.getUser(userID).subscribe(user => {
  //       this.user = user;
  //     })
  //   }
  // }

}
