import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '@firebase/auth-types';
import { Observable, lastValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  user: Observable<User | null>;
  regForm: FormGroup;


  constructor(public ngFireAuth: AngularFireAuth, private afs: AngularFirestore, private afStorage: AngularFireStorage, private router: Router) {
    this.user = this.ngFireAuth.authState;
   }

   async registerUser(email: string, password: string, additionalData: any, capturedImage: string | null) {
    try {
      const userCredential = await this.ngFireAuth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      let imageURL = null;
      let imageFilename = null;
  
      // Upload the captured image to Firebase Storage (if any)
      if (capturedImage) {
        const storageRef = this.afStorage.ref(`profile_pictures/${user?.uid}`);
        const uploadTask = storageRef.putString(capturedImage, 'data_url'); // Upload the base64 image
  
        // Wait for the upload to complete
        await lastValueFrom(uploadTask.snapshotChanges());
  
        // Get the download URL and the image filename (optional)
        imageURL = await storageRef.getDownloadURL().toPromise();
        imageFilename = `profile_pictures/${user?.uid}`;
      }
  
      // Add the user data to Firestore, including image URL and filename
      await this.afs.collection('userDetails').doc(user?.uid).set({
        uid: user?.uid,
        email: user?.email,
        firstName: additionalData.firstName,
        lastName: additionalData.lastName,
        userBio: additionalData.userBio,
        imageURL: imageURL,               // Store the download URL of the profile picture
        imageFilename: imageFilename,     
        preferences: additionalData.preferences,
      });
  
      return user;
  
    } catch (error) {
      console.error("Error during user registration:", error);
      throw error;
    }
  }

  async updateProfilePicture(userId: string, file: File): Promise<void> {
    try {
      const filePath = `profile_pictures/${userId}`;
      const fileRef = this.afStorage.ref(filePath);
      
      // Upload the file and wait for it to finish
      const uploadTask = this.afStorage.upload(filePath, file);
      await lastValueFrom(uploadTask.snapshotChanges()); // Ensure the upload completes
  
      // Get the download URL after the upload completes
      const downloadURL = await lastValueFrom(fileRef.getDownloadURL());
  
      // Update the user's Firestore document with the new profile picture URL
      await this.afs.collection('userDetails').doc(userId).update({
        imageURL: downloadURL,
      });
      return downloadURL;
    } catch (error) {
      console.error('Error updating profile picture:', error);
      throw error;
    }
  }

  async deleteProfilePicture(userId: string): Promise<void> {
    try {
      const filePath = `profile_pictures/${userId}`;
      const fileRef = this.afStorage.ref(filePath);
  
      // Try to delete the file and check if it exists before deletion
      await lastValueFrom(fileRef.delete());
  
      // Remove the image URL from the user's Firestore document
      await this.afs.collection('userDetails').doc(userId).update({
        imageURL: null,
      });
    } catch (error: any) {
      if (error.code === 'storage/object-not-found') {
        console.warn('Profile picture not found for deletion:', error);
      } else {
        console.error('Error deleting profile picture:', error);
      }
      throw error;
    }
  } 
    
  
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

  async resetPassword(email: string): Promise<void> {
    return await this.ngFireAuth.sendPasswordResetEmail(email)
  }

  async signOut(): Promise<void> {
    await this.ngFireAuth.signOut();
    this.router.navigate(['/login']);
  }
}
