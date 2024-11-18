import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthenticationService } from './authentication.service';
import { firstValueFrom, forkJoin, map, of } from 'rxjs';
import { Venue } from '../services/venuedata.service'
import firebase from 'firebase/compat/app'; 
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ToastController } from '@ionic/angular';

export interface SavedVenue {
  id: string; 
  name: string; 
  imagePath: string; 
  imageURL?: string; 
}

interface UserDetails {
  uid: string;
  savedVenues: SavedVenue[]; 
}

@Injectable({
  providedIn: 'root'
})
export class SavevenuesService {

  constructor(private firestore: AngularFirestore, private authService: AuthenticationService, private storage: AngularFireStorage, private toastController: ToastController) {}

  async saveVenue(venueId: string): Promise<void> {
    const user = await firstValueFrom(this.authService.getUser());
    if (!user) throw new Error('User not authenticated');

    const userDocRef = this.firestore.collection('userDetails').doc(user.uid);
    
    const venueQuery = this.firestore.collection('Venues', ref => ref.where('place_id', '==', venueId));
    const venueSnapshot = await firstValueFrom(venueQuery.get());

    if (venueSnapshot.empty) {
      console.error('Venue not found with place_id:', venueId);
      throw new Error(`Venue with place_id ${venueId} does not exist.`);
    }

    const venueData = venueSnapshot.docs[0].data() as Venue;

    if (venueData && venueData.name && venueData.imagePath) {
      const savedVenue: Venue = {
        ...venueData,
        id: venueData.place_id
      };

      await userDocRef.update({
        savedVenues: firebase.firestore.FieldValue.arrayUnion(savedVenue)
      });

      await this.presentToast('Venue has been saved!');
    } else {
      throw new Error('Venue details are incomplete. Cannot save.');
    }
  }

  async unsaveVenue(venueId: string): Promise<void> {
    const user = await firstValueFrom(this.authService.getUser());
    if (!user) throw new Error('User not authenticated');

    const userDocRef = this.firestore.collection('userDetails').doc(user.uid);

    const userDoc = await firstValueFrom(userDocRef.get());

    if (userDoc.exists) {
      const userData = userDoc.data() as UserDetails;

      const updatedSavedVenues = userData.savedVenues.filter(venue => venue.id !== venueId);

      await userDocRef.update({ savedVenues: updatedSavedVenues });

      await this.presentToast('Venue has been unsaved!');
    }
  }

private async presentToast(message: string) {
  const toast = await this.toastController.create({
    message,
    duration: 2000, 
    position: 'bottom' 
  });
  await toast.present();
}



async getSavedVenues(uid: string): Promise<SavedVenue[]> {
  const userDocRef = this.firestore.collection('userDetails').doc(uid);

  const userDoc = await firstValueFrom(userDocRef.get());

  if (userDoc.exists) {
    const userData = userDoc.data() as UserDetails;
    return userData.savedVenues || [];
  } else {
    console.error('No user document found for uid:', uid);
    return [];
  }
} 

async isVenueSaved(venueId: string): Promise<boolean> {
  const user = await firstValueFrom(this.authService.getUser());
  if (!user) throw new Error('User not authenticated');

  const userDocRef = this.firestore.collection('userDetails').doc(user.uid);

  // Convert the Firestore Observable to a Promise using firstValueFrom
  const userDoc = await firstValueFrom(userDocRef.get());

  // Check if the document exists and has savedVenues
  if (userDoc.exists) {
    const userData = userDoc.data() as UserDetails; 
    // Check if savedVenues array exists and contains the venueId
    return userData.savedVenues.some(venue => venue.id === venueId);
  }

  return false; // If user document does not exist or savedVenues is empty
 }

 // New function to retrieve venues with their image URLs
 async getVenuesWithImages(venues: SavedVenue[]): Promise<SavedVenue[]> {
  const observables = venues.map(venue => {
    if (venue.imagePath) {
      const storageRef = this.storage.ref(venue.imagePath);
      return storageRef.getDownloadURL().pipe(
        map(url => ({ ...venue, imageURL: url }))
      );
    } else {
      return of({ ...venue, imageURL: '' });
    }
  });

  // Use forkJoin to wait for all observables to complete and emit the array of venues with image URLs
  return firstValueFrom(forkJoin(observables));
 }
}

