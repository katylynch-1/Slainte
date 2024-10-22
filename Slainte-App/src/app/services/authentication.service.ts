import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '@firebase/auth-types';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  user: Observable<User | null>;
  regForm: FormGroup;


  constructor(public ngFireAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router) {
    this.user = this.ngFireAuth.authState;
   }

  async registerUser(email: string, password: string, additionalData: any) {
    try {
      const userCredential = await this.ngFireAuth.createUserWithEmailAndPassword(email, password);
      
      // Extract user info
      const user = userCredential.user;

      // Add the user data to Firestore
      return this.afs.collection('userDetails').doc(user?.uid).set({
        uid: user?.uid,
        email: user?.email,
        // ...additonalData
        firstName: additionalData.firstName,
        lastName: additionalData.lastName,
        userBio: additionalData.userBio,
        preferences: additionalData.preferences
      });

      return user;

    } catch (error) {
      console.error("Error during user registration:", error);
      throw error; // Rethrow the error after logging
    }
  }

   // Get the current authenticated user
   getUser(): Observable<User | null> {
    return this.ngFireAuth.authState;
  }

  // Retrieve user details from Firestore
  getUserDetails(uid: string): Observable<any> {
    return this.afs.collection('userDetails').doc(uid).valueChanges();
  }


  async loginUser(email: string, password: string):Promise<User | null> {
    if (!email) {
      throw new Error('Email is required');
    }
    if (!password) {
      throw new Error('Password is required');
    }
    const userCredential = await this.ngFireAuth.signInWithEmailAndPassword(email, password);
    return userCredential.user;
  }

  //Reset Password
  async resetPassword(email: string): Promise<void> {
    return await this.ngFireAuth.sendPasswordResetEmail(email)
  }

  // Sign Out
  async signOut(): Promise<void> {
    await this.ngFireAuth.signOut();
    this.router.navigate(['/login']);
  }





    // async signOut(){
  //   return await this.ngFireAuth.signOut()
  // }
  // getUserData(uid: string) {
  //   return this.afs.collection('users').doc<User>(uid).valueChanges();
  // }

  // getUser() {
  //   return this.ngFireAuth.authState;
  // }

  // getUser(): Observable<User | null> {
  //   return this.user;
  // }

  // async getProfile(){
  //   return await this.ngFireAuth.currentUser
  // }
}
