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
  atmosphere: string;
  amenities: string;
  drinks: string;
  music: string;
  entertainment: string;
  goodGuinness: boolean; // Does this mean that all of the tags must appear here on the interface?
}

@Injectable({
  providedIn: 'root'
})
export class VenuedataService {

  private venueCollection: AngularFirestoreCollection<Venue>;

  constructor(private storage: AngularFireStorage, private afs: AngularFirestore) {
    this.venueCollection = this.afs.collection<Venue>('Venues');
   }

   getVenues(): Observable<Venue[]> {
    return this.venueCollection.snapshotChanges().pipe(
      map(venues => {
        return venues.map(venue => {
          const data = venue.payload.doc.data() as Venue;
          const venueID = venue.payload.doc.id;
          return { venueID, ...data };
        });
      }),
      switchMap(venues => {
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
