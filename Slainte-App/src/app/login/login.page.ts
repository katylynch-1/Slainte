import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { FirebaseError } from '@firebase/util'; // Import this if you use Firebase


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage{

  loginForm: FormGroup
  email: string = '';
  password: string = '';
  errorMessage: string;



  constructor(public formBuilder: FormBuilder, public loadingCtrl: LoadingController, public authService: AuthenticationService, private router: Router) { }


  async login() {
    this.errorMessage = ''; // Clear any previous error messages
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password.';
      return;
    }
  
    try {
      // Call Authentication Service to log in the user
      await this.authService.loginUser(this.email, this.password);
      this.router.navigate(['/tabs/tab1']);
    } catch (error) {
      console.error('Login error:', error);
  
      // Typecast error as FirebaseError to access the `code` property
      const firebaseError = error as FirebaseError;
  
      // Check for specific error codes and set appropriate error messages
      if (firebaseError.code === 'auth/invalid-credential') {
        this.errorMessage = 'The email or password is incorrect. Please try again.';
      } else {
        this.errorMessage = 'An error occurred. Please try again later.';
      }
    }
  }
  

}
