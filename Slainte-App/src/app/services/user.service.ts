import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface User{
  uid?: string,
  userName: string,
  firstName: string,
  lastName: string,
  email: string,
  phoneNumber: string,

  pints: string,
  cocktails: string,
  wine: string,
  gin: string,
  whiskey: string,
  nonAlcoholic: string,
  goodGuinness: string,

  bar: string,
  pub: string,
  nightclub: string,
  lateBar: string,

  trad: string,
  pop: string,
  techno: string,
  house: string,
  indie: string,
  rock: string,
  rAndB: string,
  hipHop: string,
  reggaeton: string,
  jazz: string,

  energetic: string,
  cosy: string,
  alternative: string,
  relaxed: string,
  traditional: string,
  fancy: string,
  casual: string,
  lgbtq: string,
  loud: string,

  outdoorSeats: string,
  accessible: string,
  cloakRoom: string,
  smokingArea: string,
  beerGarden: string,
  danceFloor: string,

  festival: string,
  openMic: string,
  pubQuiz: string,
  rave: string,
  liveGig: string,
  dj: string,
  karaoke: string,
  comedy: string,
  sports: string,
  specialisedEvents: string,
  games: string
}

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private users: Observable<User[]>;
  private userCollection: AngularFirestoreCollection<User>;
  private documentReference: DocumentReference;

  constructor(private afs: AngularFirestore){

    this.userCollection = this.afs.collection<User>('users');
    this.users = this.userCollection.snapshotChanges().pipe(
      map(users => {
        return users.map(user => {
          const data = user.payload.doc.data();
          const userID = user.payload.doc.id;
          return { userID, ...data };
        });
      })
    );
  }

  getUsers(): Observable<User[]> {
    return this.users;
  }

  getUser(uid: string): Observable<User> {
    return this.userCollection.doc<User>(uid).valueChanges().pipe(
      take(1),
      map(user => {
        user.uid = uid;
        return user
      })
    );
  }

  updateUser(user: User): Promise<void> {
    return this.userCollection.doc(user.uid).update({ pints: user.pints, cocktails: user.cocktails, wine: user.cocktails, gin: user.gin, whiskey: user.whiskey, nonAlcoholic: user.nonAlcoholic, goodGuinness: user.goodGuinness,
      bar: user.bar, pub: user.pub, nightclub: user.nightclub, lateBar: user.lateBar, trad: user.trad, pop: user.pop, techno: user.techno, house: user.house, indie: user.indie, rock: user.rock, rAndB: user.rAndB, hipHop: user.hipHop, reggaeton: user.reggaeton, jazz: user.jazz,
      energetic: user.energetic, cosy: user.cosy, alternative: user.alternative, relaxed: user.relaxed, traditional: user.traditional, fancy: user.fancy, casual: user.casual, lgbtq: user.lgbtq, loud: user.loud,
      outdoorSeats: user.outdoorSeats, accessible: user.accessible, cloakRoom: user.cloakRoom, smokingArea: user.smokingArea, beerGarden: user.beerGarden, danceFloor: user.danceFloor,
      festival: user.festival, openMic: user.openMic, pubQuiz: user.pubQuiz, rave: user.rave, liveGig: user.liveGig, dj: user.dj, karaoke: user.karaoke, comedy: user.comedy, sports: user.sports, specialisedEvents: user.specialisedEvents, games: user.games,
    });
  }
}
