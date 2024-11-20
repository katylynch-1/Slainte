import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  regForm: FormGroup;
  capturedImage = "";
  updateImage = false;
  selectedStep: string = 'step1';


  atmosphereOptions = [
    { label: 'Alternative', controlName: 'alternative' },
    { label: 'Casual', controlName: 'casual' },
    { label: 'Cosy', controlName: 'cosy' },
    { label: 'Energetic', controlName: 'energetic' },
    { label: 'Fancy', controlName: 'fancy' },
    { label: 'LGBTQ+', controlName: 'lgbtq' },
    { label: 'Loud', controlName: 'loud' },
    { label: 'Relaxed', controlName: 'relaxed' },
    { label: 'Traditional', controlName: 'traditional' },
  ];

  drinksOptions = [
    { label: 'Cocktails', controlName: 'cocktails' },
    { label: 'Gin', controlName: 'gin' },
    { label: 'Good Guinness', controlName: 'goodGuinness' },
    { label: 'Non-Alcoholic', controlName: 'nonAlcoholic' },
    { label: 'Pints', controlName: 'pints' },
    { label: 'Whiskey', controlName: 'whiskey' },
    { label: 'Wine', controlName: 'wine' },
  ];

  musicOptions = [
    { label: 'Hip Hop', controlName: 'hipHop' },
    { label: 'House', controlName: 'house' },
    { label: 'Indie', controlName: 'indie' },
    { label: 'Jazz', controlName: 'jazz' },
    { label: 'Pop', controlName: 'pop' },
    { label: 'R&B', controlName: 'rAndB' },
    { label: 'Reggaeton', controlName: 'reggaeton' },
    { label: 'Rock', controlName: 'rock' },
    { label: 'Techno', controlName: 'techno' },
    { label: 'Trad', controlName: 'trad' },
  ];

  amenitiesOptions = [
    { label: 'Accessible', controlName: 'accessible' },
    { label: 'Beer Garden', controlName: 'beerGarden' },
    { label: 'Cloak Room', controlName: 'cloakRoom' },
    { label: 'Dance Floor', controlName: 'danceFloor' },
    { label: 'Outdoor Seats', controlName: 'outdoorSeats' },
    { label: 'Smoking Area', controlName: 'smokingArea' },
  ];

  entertainmentOptions = [
    { label: 'Comedy', controlName: 'comedy' },
    { label: 'DJ', controlName: 'dj' },
    { label: 'Festival', controlName: 'festival' },
    { label: 'Games', controlName: 'games' },
    { label: 'Karaoke', controlName: 'karaoke' },
    { label: 'Live Gigs', controlName: 'liveGig' },
    { label: 'Open Mic', controlName: 'openMic' },
    { label: 'Pub Quiz', controlName: 'pubQuiz' },
    { label: 'Raves', controlName: 'rave' },
    { label: 'Specialised Events', controlName: 'specialisedEvents' },
    { label: 'Sports', controlName: 'sports' },
  ];

  constructor(public formBuilder: FormBuilder, public loadingCtrl: LoadingController, public authService: AuthenticationService, public router: Router, private toastController: ToastController) { }


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
      userBio: [''],
      bars: [false], nightclubs: [false],  pubs: [false],  lateBars: [false],
      pints: [false], cocktails: [false], wine: [false], gin: [false], whiskey: [false], nonAlcoholic: [false], goodGuinness: [false],
      trad: [false], pop: [false], techno: [false], house: [false], rock: [false], indie: [false], hipHop: [false], reggaeton: [false], jazz: [false], rAndB: [false],
      energetic: [false], cosy: [false], alternative: [false], relaxed: [false], traditional: [false], fancy: [false], casual: [false], lgbtq: [false], loud: [false], 
      outdoorSeats: [false], accessible: [false], cloakRoom: [false], smokingArea: [false], beerGarden: [false], danceFloor: [false], 
      festival: [false], openMic: [false], pubQuiz: [false], rave: [false], liveGig: [false], dj: [false], karaoke: [false], comedy: [false], sports: [false], specialisedEvents: [false], games: [false] 
    })
  }

  goToStep(step: string) {
    this.selectedStep = step;
  }

  toggleChip(controlName: string) {
    const currentValue = this.regForm.controls[controlName].value;
    this.regForm.controls[controlName].setValue(!currentValue);
  }

  get errorControl(){
    return this.regForm.controls;
  }

  async signUp() {
    const loading = await this.loadingCtrl.create();
    await loading.present();
  
    if (this.regForm.valid) {
      try {
        const { firstName, lastName, email, password, userBio } = this.regForm.value;

        const preferences: { [key: string]: boolean } = {};
        const allOptions = [
        ...this.atmosphereOptions,
        ...this.drinksOptions,
        ...this.musicOptions,
        ...this.amenitiesOptions,
        ...this.entertainmentOptions,
      ];

      allOptions.forEach(option => {
        preferences[option.controlName] = this.regForm.controls[option.controlName].value;
      });
  
        const user = await this.authService.registerUser(email, password, { firstName, lastName, userBio, preferences }, this.capturedImage  // Add profilePicture
        );
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
  

  async addImage() {
    try {
      const permissions = await Camera.requestPermissions();
      if (permissions.camera !== 'granted') {
        throw new Error('Camera permission not granted');
      }
  
      const image = await Camera.getPhoto({
        quality: 100,
        allowEditing: true,
        source: CameraSource.Photos,
        resultType: CameraResultType.Base64,
      });
  
      this.capturedImage = `data:image/jpeg;base64,${image.base64String}`;
      this.updateImage = false;
    } catch (error) {
      console.error('Camera error:', error);
      await this.presentToast('Camera error or permission not granted', 'danger');
    }
  }  
  
  async presentToast(message: string, color: string = 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000, 
      color: color, 
      position: 'bottom' 
    });
    toast.present();
  }
  

}
