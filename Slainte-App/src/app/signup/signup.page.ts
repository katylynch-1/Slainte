import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  regForm: FormGroup;

  constructor(public formBuilder: FormBuilder, public loadingCtrl: LoadingController, public authService: AuthenticationService, public router: Router) { }


  ngOnInit() {
    this.regForm = this.formBuilder.group({
      firstName : ['', [Validators.required]],
      lastName : ['', [Validators.required]],
      email: ['', [
        Validators.required, 
        Validators.email,
        Validators.pattern("[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$")
      ]],
      password: ['', [
        Validators.required, 
        //One upper case, one lower case, one number, one special character, min length of 8 characters
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      userBio: ['', [Validators.required]],
      bars: [false], nightclubs: [false],  pubs: [false],  lateBars: [false],
      pints: [false], cocktails: [false], wine: [false], gin: [false], whiskey: [false], nonAlcoholic: [false], goodGuinness: [false],
      trad: [false], pop: [false], techno: [false], house: [false], rock: [false], indie: [false], hipHop: [false], reggaeton: [false], jazz: [false], rAndB: [false],
      energetic: [false], cosy: [false], alternative: [false], relaxed: [false], traditional: [false], fancy: [false], casual: [false], lgbtq: [false], loud: [false], 
      outdoorSeats: [false], accessible: [false], cloakRoom: [false], smokingArea: [false], beerGarden: [false], danceFloor: [false], 
      festival: [false], openMic: [false], pubQuiz: [false], rave: [false], liveGig: [false], dj: [false], karaoke: [false], comedy: [false], sports: [false], specialisedEvents: [false], games: [false] 
    })

  }

  get errorControl(){
    return this.regForm.controls;
  }

  async signUp() {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    if (this.regForm.valid) {
      try {
        
        //Collect additional user data such as firstName and lastName
        // const firstName = this.regForm.value.firstName;
        // const lastName = this.regForm.value.lastName;
        // const email = this.regForm.value.email;
        // const password = this.regForm.value.password;

        const { firstName, lastName, email, password, userBio, bars, nightclubs, pubs, lateBars, pints, cocktails, wine, gin, whiskey, nonAlcoholic, goodGuinness, trad, pop, techno, house, rock, indie, hipHop, reggaeton, jazz, rAndB, energetic, cosy, alternative, relaxed, traditional, fancy, casual, lgbtq, loud, outdoorSeats, accessible, cloakRoom, smokingArea, beerGarden, danceFloor, festival, openMic, pubQuiz, rave, liveGig, dj, karaoke, comedy, sports, specialisedEvents, games } = this.regForm.value;

        const preferences = {
          bars, nightclubs, pubs, lateBars,
          pints, cocktails, wine, gin, whiskey, nonAlcoholic, goodGuinness,
          trad, pop, techno, house, rock, indie, hipHop, reggaeton, jazz, rAndB,
          energetic, cosy, alternative, relaxed, traditional, fancy, casual, lgbtq, loud, 
          outdoorSeats, accessible, cloakRoom, smokingArea, beerGarden, danceFloor, 
          festival, openMic, pubQuiz, rave, liveGig, dj, karaoke, comedy, sports, specialisedEvents, games
        };


        const user = await this.authService.registerUser(email, password, { firstName, lastName, userBio, preferences });
        this.router.navigate(['/tabs/tab1']);
        if (user) {
          this.router.navigate(['/tabs/tab1']);
        }
      } catch (error) {
        console.log("Error during sign-up:", error);
      } finally {
        await loading.dismiss();
      }
    } else {
      console.log('Please provide valid values');
      await loading.dismiss();
    }
  }

}
