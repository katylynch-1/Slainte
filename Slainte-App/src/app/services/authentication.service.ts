import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { User } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(public ngFireAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router) { }

  async registerUser(email: string, password: string){
    return await this.ngFireAuth.createUserWithEmailAndPassword(email, password)
  }

  // async loginUser(email: string, password: string){
  //   await this.ngFireAuth.signInWithEmailAndPassword(email, password)
  // }

  async loginUser(email: string, password: string) {
    const userCredential = await this.ngFireAuth.signInWithEmailAndPassword(email, password);
    return userCredential;
  }

  async resetPassword(email: string){
    return await this.ngFireAuth.sendPasswordResetEmail(email)
  }

  // async signOut(){
  //   return await this.ngFireAuth.signOut()
  // }

  async signOut() {
    await this.ngFireAuth.signOut();
    this.router.navigate(['/login']);
  }

  getUserData(uid: string) {
    return this.afs.collection('users').doc<User>(uid).valueChanges();
  }

  // async getProfile(){
  //   return await this.ngFireAuth.currentUser
  // }
}
