import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
// import { User } from './user.service';
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

  // async registerUser(email: string, password: string){
  //   this.ngFireAuth.createUserWithEmailAndPassword(email, password).then(userCredential => {
  //     return this.afs.collection('users').add()
  //   })
  // }

  async registerUser(email: string, password: string) {
    try {
      const userCredential = await this.ngFireAuth.createUserWithEmailAndPassword(email, password);
      
      // Extract user info
      const user = userCredential.user;

      
  
      // Add the user data to Firestore
      return this.afs.collection('users').add({
        uid: user?.uid,
        email: user?.email,
       
      });
    } catch (error) {
      console.error("Error during user registration:", error);
      throw error; // Rethrow the error after logging
    }
  }

  // async loginUser(email: string, password: string){
  //   await this.ngFireAuth.signInWithEmailAndPassword(email, password)
  // }

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

  async resetPassword(email: string): Promise<void> {
    return await this.ngFireAuth.sendPasswordResetEmail(email)
  }

  // async signOut(){
  //   return await this.ngFireAuth.signOut()
  // }

  async signOut(): Promise<void> {
    await this.ngFireAuth.signOut();
    this.router.navigate(['/login']);
  }

  // getUserData(uid: string) {
  //   return this.afs.collection('users').doc<User>(uid).valueChanges();
  // }

  // getUser() {
  //   return this.ngFireAuth.authState;
  // }

  getUser(): Observable<User | null> {
    return this.user;
  }

  // async getProfile(){
  //   return await this.ngFireAuth.currentUser
  // }
}
