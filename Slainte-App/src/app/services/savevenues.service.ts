import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthenticationService } from './authentication.service';
import { firstValueFrom } from 'rxjs';
import { Venue } from '../services/venuedata.service'
import firebase from 'firebase/compat/app'; // Import firebase from compat
import { AngularFireStorage } from '@angular/fire/compat/storage';

export interface SavedVenue {
  id: string; // This will be the place_id
  name: string; // Venue name
  imagePath: string; // Venue image URL
}

// Define the structure of the userDetails document
interface UserDetails {
  uid: string;
  savedVenues: SavedVenue[]; // Array of saved venue objects
}

@Injectable({
  providedIn: 'root'
})
export class SavevenuesService {

  constructor(private firestore: AngularFirestore, private authService: AuthenticationService, private storage: AngularFireStorage) {}

 async saveVenue(venueId: string): Promise<void> {
  const user = await firstValueFrom(this.authService.getUser());
  if (!user) throw new Error('User not authenticated');

  const userDocRef = this.firestore.collection('userDetails').doc(user.uid);
  
  // Fetch the venue details from the venues collection using a query
  const venueQuery = this.firestore.collection('Venues', ref => ref.where('place_id', '==', venueId));
  const venueSnapshot = await firstValueFrom(venueQuery.get());

  // Check if any documents were found
  if (venueSnapshot.empty) {
    console.error('Venue not found with place_id:', venueId);
    throw new Error(`Venue with place_id ${venueId} does not exist.`);
  }

  // Get the first document that matches
  const venueData = venueSnapshot.docs[0].data() as Venue;

  // Check if the required values are defined
  if (venueData && venueData.name && venueData.imagePath) {
    // Save only the place_id, name, and imagePath to the savedVenues array
    const savedVenue: SavedVenue = {
      id: venueData.place_id, // Use place_id for id
      name: venueData.name,
      imagePath: venueData.imagePath // Use the correct property for the image
    };

    await userDocRef.update({
      savedVenues: firebase.firestore.FieldValue.arrayUnion(savedVenue)
    });
  } else {
    throw new Error('Venue details are incomplete. Cannot save.');
  }
 }

// Unsave a venue for the current user
async unsaveVenue(venueId: string): Promise<void> {
  const user = await firstValueFrom(this.authService.getUser());
  if (!user) throw new Error('User not authenticated');

  const userDocRef = this.firestore.collection('userDetails').doc(user.uid);

  // Retrieve current savedVenues array
  const userDoc = await firstValueFrom(userDocRef.get());

  if (userDoc.exists) {
    const userData = userDoc.data() as UserDetails;

    // Filter out the venue to be removed
    const updatedSavedVenues = userData.savedVenues.filter(venue => venue.id !== venueId);

    // Update the savedVenues array in Firestore
    await userDocRef.update({ savedVenues: updatedSavedVenues });
  }
}


async getSavedVenues(uid: string): Promise<SavedVenue[]> {
  const userDocRef = this.firestore.collection('userDetails').doc(uid);

  // Use firstValueFrom to convert the Observable to a Promise
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
    const userData = userDoc.data() as UserDetails; // Use the UserDetails interface
    // Check if savedVenues array exists and contains the venueId
    return userData.savedVenues.some(venue => venue.id === venueId);
  }

  return false; // If user document does not exist or savedVenues is empty
 }

 async getImageUrl(imagePath: string): Promise<string> {
  const storageRef = this.storage.ref(imagePath); // Create a reference to the file
  return firstValueFrom(storageRef.getDownloadURL()); // Get the public URL using firstValueFrom
 }
}

