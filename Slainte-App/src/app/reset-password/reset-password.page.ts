import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  email: string = '';
  message: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthenticationService) { }

  resetPassword(){
    this.authService.resetPassword(this.email)
    .then(() => {
      this.message = 'Password reset email sent. Please check your inbox.';
      this.errorMessage = '';
    })
    .catch(error => {
      this.errorMessage = 'Error sending password reset email. Please try again.';
      this.message = '';
      console.error('Error:', error);
    });
  }

  ngOnInit() {
  }

}
