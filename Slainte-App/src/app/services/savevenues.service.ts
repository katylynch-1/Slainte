// import { Injectable } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
// import { AuthenticationService } from './authentication.service';
// import { firstValueFrom } from 'rxjs';
// import firebase from 'firebase/compat/app'; // Import firebase from compat

// // Define the structure of the userDetails document
// interface UserDetails {
//   uid: string;
//   savedVenues: string[]; // Array of saved venue objects
// }

// @Injectable({
//   providedIn: 'root'
// })
// export class SavevenuesService {

//   constructor(private firestore: AngularFirestore, private authService: AuthenticationService) { }

//   // Save a venue for the current user
//   async saveVenue(venueId: string): Promise<void> {
//     const user = await firstValueFrom(this.authService.getUser());
//     if (!user) throw new Error('User not authenticated');

//     const userDocRef = this.firestore.collection('userDetails').doc(user.uid);

//     return userDocRef.update({
//       savedVenues: firebase.firestore.FieldValue.arrayUnion(venueId)
//     });
//   }

//   // Unsave a venue for the current user
//   async unsaveVenue(venueId: string): Promise<void> {
//     const user = await firstValueFrom(this.authService.getUser());
//     if (!user) throw new Error('User not authenticated');

//     const userDocRef = this.firestore.collection('userDetails').doc(user.uid);

//     return userDocRef.update({
//       savedVenues: firebase.firestore.FieldValue.arrayRemove(venueId)
//     });
//   }


//   // Check if the venue is saved by the current user
//   async isVenueSaved(venueId: string): Promise<boolean> {
//     const user = await firstValueFrom(this.authService.getUser());
//     if (!user) throw new Error('User not authenticated');

//     const userDocRef = this.firestore.collection('userDetails').doc(user.uid);
//     const doc = await firstValueFrom(userDocRef.get());

//     // Cast the document data to the UserDetails type
//     const userData = doc.data() as UserDetails | undefined;
//     const savedVenues = userData?.savedVenues || []; // Access savedVenues safely

//     // Check if the venue exists in the saved venues
//     return savedVenues.includes(venueId);
//   }

//   // Get all saved venues for the current user
//   async getSavedVenues(): Promise<string[]> {
//     const user = await firstValueFrom(this.authService.getUser());
//     if (!user) throw new Error('User not authenticated');

//     const userDocRef = this.firestore.collection('userDetails').doc(user.uid);
//     const doc = await firstValueFrom(userDocRef.get());

//     // Cast the document data to the UserDetails type
//     const userData = doc.data() as UserDetails | undefined;
    
//     // Return savedVenues or an empty array if undefined
//     return userData?.savedVenues || []; 
//   }
// }

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthenticationService } from './authentication.service';
import { firstValueFrom } from 'rxjs';
import firebase from 'firebase/compat/app'; // Import firebase from compat

// Define the structure of the userDetails document
interface UserDetails {
  uid: string;
  savedVenues: string[]; // Array of saved venue objects
}

@Injectable({
  providedIn: 'root'
})
export class SavevenuesService {

  constructor(private firestore: AngularFirestore, private authService: AuthenticationService) {}

  // Save a venue for the current user
  async saveVenue(venueId: string): Promise<void> {
    const user = await firstValueFrom(this.authService.getUser());
    if (!user) throw new Error('User not authenticated');

    const userDocRef = this.firestore.collection('userDetails').doc(user.uid);

    return userDocRef.update({
      savedVenues: firebase.firestore.FieldValue.arrayUnion(venueId)
    });
  }

  // Unsave a venue for the current user
  async unsaveVenue(venueId: string): Promise<void> {
    const user = await firstValueFrom(this.authService.getUser());
    if (!user) throw new Error('User not authenticated');

    const userDocRef = this.firestore.collection('userDetails').doc(user.uid);

    return userDocRef.update({
      savedVenues: firebase.firestore.FieldValue.arrayRemove(venueId)
    });
  }

  // Check if the venue is saved by the current user
  async isVenueSaved(venueId: string): Promise<boolean> {
    const user = await firstValueFrom(this.authService.getUser());
    if (!user) throw new Error('User not authenticated');

    const userDocRef = this.firestore.collection('userDetails').doc(user.uid);
    const doc = await firstValueFrom(userDocRef.get());
    const userData = doc.data() as UserDetails | undefined;
    
    // Return whether the venue is saved or not
    return userData?.savedVenues.includes(venueId) ?? false;
  }

  // Get all saved venues for the current user
  async getSavedVenues(): Promise<string[]> {
    const user = await firstValueFrom(this.authService.getUser());
    if (!user) throw new Error('User not authenticated');

    const userDocRef = this.firestore.collection('userDetails').doc(user.uid);
    const doc = await firstValueFrom(userDocRef.get());
    const userData = doc.data() as UserDetails | undefined;

    return userData?.savedVenues ?? [];
  }
}

