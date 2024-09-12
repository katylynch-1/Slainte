import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { map, switchMap } from 'rxjs/operators';
import { Observable, forkJoin, of } from 'rxjs';

export interface Venue {
  venueID?: string,
  name: string,
  address: string,
  openingHours: string,
  type: string;
  imageURL?: string;
  imagePath: string;

  // Atmosphere Tags
  traditional: boolean;
  casual: boolean;
  cosy: boolean;
  energetic: boolean;
  alternative: boolean;
  relaxed: boolean;
  fancy: boolean;
  lgbtq: boolean;
  loud: boolean;

  // Drinks tags
  pints: boolean;
  goodGuinness: boolean;
  cocktails: boolean;
  wine: boolean;
  gin: boolean;
  whiskey: boolean;
  nonAlcoholic: boolean;

  // Music tags
  trad: boolean;
  pop: boolean;
  techno: boolean;
  house: boolean;
  indie: boolean;
  rock: boolean;
  rNb: boolean;
  hipHop: boolean;
  reggaeton: boolean;
  jazz: boolean;

  // Amenities Tags
  accessible: boolean;
  beerGarden: boolean;
  cloakRoom: boolean;
  danceFloor: boolean;
  outdoorSeats: boolean;
  smokingArea: boolean;
  budgetFriendly: boolean;

  // Entertainment Tags
  comedy: boolean;
  dJ: boolean;
  festival: boolean;
  games: boolean;
  karaoke: boolean;
  liveGigs: boolean;
  openMic: boolean;
  pubQuiz: boolean;
  raves: boolean;
  specialisedEvents: boolean;
  sports: boolean;
  dragShows: boolean;


  [key: string]: any; // Add index signature

}

@Injectable({
  providedIn: 'root'
})
export class VenuedataService {

  private venueCollection: AngularFirestoreCollection<Venue>;

  constructor(private storage: AngularFireStorage, private afs: AngularFirestore) {
    this.venueCollection = this.afs.collection<Venue>('Venues');
   }

   getVenues(): Observable<Venue[]> { // Extracts venue data
    return this.venueCollection.snapshotChanges().pipe(
      map(venues => {
        return venues.map(venue => {
          const data = venue.payload.doc.data() as Venue;
          const venueID = venue.payload.doc.id;
          return { venueID, ...data };
        });
      }),
      switchMap(venues => { // Gets venue images
        const observables = venues.map(venue => {
          if (venue.imagePath) {
            const storageRef = this.storage.ref(venue.imagePath);
            return storageRef.getDownloadURL().pipe(
              map(url => ({ ...venue, imageURL: url })),
            );
          } else {
            return of({ ...venue, imageURL: '' });
          }
        });
        return forkJoin(observables);
      })
    );
  }
}
