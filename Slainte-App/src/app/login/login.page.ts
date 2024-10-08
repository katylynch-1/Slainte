import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup
  email: string = '';
  password: string = '';



  constructor(public formBuilder: FormBuilder, public loadingCtrl: LoadingController, public authService: AuthenticationService, private router: Router) { }

  // async login(){
  //   const loading = await this.loadingCtrl.create();
  //   await loading.present();
  //   if(this.loginForm.valid){
  //     // const user = await this.authService.registerUser(email, password)
  //   }
  // }

  // navigateToTab1(){
  //   this.router.navigate(['/tabs/tab1']);
  // }

  async login(){
    if (!this.email || !this.password) {
      // Error message to display if a user has not entered an email or password
      console.error('Email or Password is missing.');
      return;
    }
    try{
      // Call on Authentication Service to log in User using provided email and password
      await this.authService.loginUser(this.email, this.password);
      this.router.navigate(['/tabs/tab1'])
    } catch (error){
      console.error('Login error:', error);
    }
  }

  ngOnInit() {
    // this.loginForm = this.formBuilder.group({
    //   email: ['', [
    //     Validators.required, 
    //     Validators.email,
    //     Validators.pattern("[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$")
    //   ]],
    //   password: ['', [
    //     Validators.required, 
    //     Validators.pattern("(?=.*\d)(?=.*[a-z])(?=.*[0-8])(?=.*[A-Z])")
    //   ]]
    // })
  }


  get errorControl(){
    return this.loginForm.controls;
  }



}
