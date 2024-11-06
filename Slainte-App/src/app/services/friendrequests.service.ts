import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import firebase from 'firebase/compat/app';


interface UserDetails {
  firstName: string;
  lastName: string;
  imageURL?: string; // Optional since some users might not have a profile picture
}

@Injectable({
  providedIn: 'root'
})
export class FriendrequestsService {

  constructor(private firestore: AngularFirestore) { }
  

  // Send Friend Request
  async sendFriendRequest(fromUserId: string, toUserId: string): Promise<void> {
    const requestRef = this.firestore.collection('userDetails').doc(toUserId)
                       .collection('friendRequests').doc(fromUserId);

    await requestRef.set({
      fromUserId,
      status: 'pending',
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  // Unsend Friend Request
  async unsendFriendRequest(fromUserId: string, toUserId: string): Promise<void> {
    const requestRef = this.firestore.collection('userDetails').doc(toUserId)
                       .collection('friendRequests').doc(fromUserId);

    await requestRef.delete();
  }

  // Accept Friend Request
  async acceptFriendRequest(fromUserId: string, toUserId: string): Promise<void> {
    const requestRef = this.firestore.collection('userDetails').doc(toUserId)
                     .collection('friendRequests').doc(fromUserId);

    // Update status to 'accepted'
    await requestRef.update({ status: 'accepted' });

    // Add each user to the other’s friends list (create the 'friends' collection if doesn't exist)
    const toUserFriendsRef = this.firestore.collection('userDetails').doc(toUserId)
                        .collection('friends').doc(fromUserId);

    const fromUserFriendsRef = this.firestore.collection('userDetails').doc(fromUserId)
                          .collection('friends').doc(toUserId);

    // Add the friend relationship to both user's 'friends' collection
    await toUserFriendsRef.set({
      userId: fromUserId, 
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    await fromUserFriendsRef.set({
      userId: toUserId, 
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  // Reject Friend Request
  async rejectFriendRequest(fromUserId: string, toUserId: string): Promise<void> {
    const requestRef = this.firestore.collection('userDetails').doc(toUserId)
                       .collection('friendRequests').doc(fromUserId);

    await requestRef.delete();
  }

  // Get real-time friend requests for a user, filtered by status
  getFriendRequests(userId: string, status: 'pending' | 'accepted' | 'rejected'): Observable<any[]> {
    return this.firestore.collection('userDetails').doc(userId).collection('friendRequests', ref => ref.where('status', '==', status)).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  // Get friends with user details
  getFriends(userId: string): Observable<UserDetails[]> {
    return this.firestore.collection('userDetails').doc(userId)
      .collection('friends')
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => a.payload.doc.id)), // Retrieve all friendIds
        switchMap(friendIds => {
          if (friendIds.length === 0) return of([]); // If no friends, return an empty array
  
          // Fetch all user details in a single query based on friendIds
          return this.firestore.collection<UserDetails>('userDetails', ref => 
            ref.where(firebase.firestore.FieldPath.documentId(), 'in', friendIds)
          )
          .valueChanges({ idField: 'id' });
        })
      );
  }

  // Add a method to fetch all users with their details
  getAllUsers(): Observable<any[]> {
    return this.firestore.collection('userDetails').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
}
