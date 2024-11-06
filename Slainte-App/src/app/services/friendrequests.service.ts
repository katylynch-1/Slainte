import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs';
import firebase from 'firebase/compat/app';

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

    // FriendRequestService
getAllUsers(): Observable<any[]> {
  return this.firestore.collection('userDetails').snapshotChanges().pipe(
    map(actions => actions.map(a => {
      const data = a.payload.doc.data() as any;
      const id = a.payload.doc.id;
      return { id, ...data };
    }))
  );
}


  // Function to get real-time friend requests for a user, filtered by status
  getFriendRequests(userId: string, status: 'pending' | 'accepted' | 'rejected'): Observable<any[]> {
   return this.firestore.collection('userDetails').doc(userId).collection('friendRequests', ref => ref.where('status', '==', status)).snapshotChanges().pipe(
     map(actions => actions.map(a => {
          const data = a.payload.doc.data();
            const id = a.payload.doc.id;
                 return { id, ...data };
        }))
     );
  }

// Function to get the accepted friends (from the 'friends' collection)
getFriends(userId: string): Observable<any[]> {
  return this.firestore.collection('userDetails').doc(userId)
    .collection('friends')  // Query the 'friends' collection to get the accepted friends
    .snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
 }
}

