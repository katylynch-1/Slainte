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
      fullName : ['', [Validators.required]],
      email: ['', [
        Validators.required, 
        Validators.email,
        Validators.pattern("[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$")
      ]],
      password: ['', [
        Validators.required, 
        Validators.pattern("(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}")
      ]]
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
        const user = await this.authService.registerUser(
          this.regForm.value.email,
          this.regForm.value.password,        );
        if (user) {
          this.router.navigate(['/tabs/tab1']);
        }
      } catch (error) {
        console.log(error);
      } finally {
        await loading.dismiss();
      }
    } else {
      console.log('Please provide valid values');
      await loading.dismiss();
    }
  }

}
