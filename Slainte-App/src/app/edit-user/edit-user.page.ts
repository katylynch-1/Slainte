import { Component, OnInit } from '@angular/core';
import { User, UserService } from '../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.page.html',
  styleUrls: ['./edit-user.page.scss'],
})
export class EditUserPage implements OnInit {

  user: User = {
    userID: '',
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
    goodGuinness:'',
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

  constructor(private activatedRoute: ActivatedRoute, private userService: UserService,
    private toastCtrl: ToastController, private router: Router) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    let userID = this.activatedRoute.snapshot.paramMap.get('userID');
    if (userID) {
      console.log(userID);
      this.userService.getUser(userID).subscribe(user => {
        this.user = user;
      });
    }
  }

  updateUser() {
    this.userService.updateUser(this.user).then(() => {
      this.showToast('User preferences updated');
    }, err => {
      this.showToast('There was a problem updating your preferences');
    });
  }

  showToast(msg: string) {
    this.toastCtrl.create({
      message:msg,
      duration: 2000
    }).then(toast => toast.present());
  }
}
