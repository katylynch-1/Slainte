import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private afs: AngularFirestore){}

  getUsers(): Observable<any[]> {
    return this.afs.collection('userDetails').valueChanges();
  }
}
