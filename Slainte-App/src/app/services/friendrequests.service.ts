import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, switchMap } from 'rxjs/operators';
import { Observable, combineLatest, of, from } from 'rxjs';
import firebase from 'firebase/compat/app';


interface UserDetails {
  firstName: string;
  lastName: string;
  imageURL?: string; 
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class FriendrequestsService {

  constructor(private firestore: AngularFirestore) { }
  
// Function to fetch multiple users' details by IDs
// getUserDetails(userIds: string[]): Observable<UserDetails[]> {
//   if (userIds.length === 0) return of([]); 

//   return this.firestore.collection<UserDetails>('userDetails', ref =>
//     ref.where(firebase.firestore.FieldPath.documentId(), 'in', userIds)
//   ).valueChanges({ idField: 'id' });
// }

  // Send Friend Request - used on 'connect' component
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

// Accept friend requests - used on friends tab component
acceptFriendRequest(fromUserId: string, toUserId: string): Observable<void> {
  const requestRef = this.firestore.collection('userDetails').doc(toUserId)
                     .collection('friendRequests').doc(fromUserId);

  // Update status to 'accepted' and then add friends
  return from(
    requestRef.update({ status: 'accepted' }).then(async () => {
      // References to both user's friends collections
      const toUserFriendsRef = this.firestore.collection('userDetails').doc(toUserId)
                          .collection('friends').doc(fromUserId);

      const fromUserFriendsRef = this.firestore.collection('userDetails').doc(fromUserId)
                            .collection('friends').doc(toUserId);

      // Add each user to the other's friends list
      await toUserFriendsRef.set({
        userId: fromUserId, 
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
      await fromUserFriendsRef.set({
        userId: toUserId, 
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
    })
  );
}

  // Reject friend request - used on friends tab component
  async rejectFriendRequest(fromUserId: string, toUserId: string): Promise<void> {
    const requestRef = this.firestore.collection('userDetails').doc(toUserId)
                       .collection('friendRequests').doc(fromUserId);

    await requestRef.delete();
  }

// Load incoming friend requests (pending) - used in friends component
getFriendRequests(userId: string, status: 'pending' | 'accepted' | 'rejected'): Observable<any[]> {
  return this.firestore.collection('userDetails').doc(userId).collection('friendRequests', ref => ref.where('status', '==', status))
    .snapshotChanges()
    .pipe(
      switchMap(actions => {
        const requests = actions.map(a => {
          const requestData = a.payload.doc.data();
          const requestId = a.payload.doc.id;
          const fromUserId = requestData['fromUserId']; // Changed to fromUserId

          // Fetch the sender's user details (the one who sent the friend request)
          return this.firestore.collection<UserDetails>('userDetails').doc(fromUserId).valueChanges().pipe(
            map((userData: UserDetails | undefined) => {
              const result: any = {
                id: requestId,
                ...requestData
              };

              // Only add user details if available
              if (userData) {
                result.firstName = userData.firstName;
                result.lastName = userData.lastName;
                result.imageURL = userData.imageURL;
              }

              return result;
            })
          );
        });

        // Combine all the observables into a single observable array
        return combineLatest(requests);
      })
    );
}

  // Get friends list - used on tab3 component & friends tab to load friends
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

  // Loads other users with registered accounts except the current user and their friends - used in connect ccomponent
  findOtherUsers(currentUserId: string): Observable<any[]> {
    // First, fetch the friends list
    return this.getFriends(currentUserId).pipe(
      switchMap(friends => {
        const friendsList = friends.map(friend => friend.id); // Extract friend IDs
  
        // Fetch all users from Firestore and filter out the current user and friends
        return this.firestore.collection('userDetails').snapshotChanges().pipe(
          map(actions =>
            actions
              .map(a => {
                const data = a.payload.doc.data() as any; // Extract document data
                const id = a.payload.doc.id;               // Get document ID
                return { id, ...data };                    // Merge ID with data object
              })
              .filter(user => user.id !== currentUserId && !friendsList.includes(user.id)) // Exclude current user and friends
          )
        );
      })
    );
  }
  
  

  // Remove friend - used on friends tab component
  async removeFriend(fromUserId: string, toUserId: string): Promise<void> {
    // References to both user's friends collections
    const toUserFriendsRef = this.firestore.collection('userDetails').doc(toUserId)
                          .collection('friends').doc(fromUserId);
  
    const fromUserFriendsRef = this.firestore.collection('userDetails').doc(fromUserId)
                            .collection('friends').doc(toUserId);
  
    // Delete each user from the other's friends list
    await toUserFriendsRef.delete();
    await fromUserFriendsRef.delete();
  
    // Optionally, delete the friend request if it exists (either 'accepted', 'pending', or 'rejected')
    const requestRef = this.firestore.collection('userDetails').doc(toUserId)
                          .collection('friendRequests').doc(fromUserId);
  
    await requestRef.delete(); // Delete the friend request from the 'toUserId' side
  
    // You might want to clean up the reverse (if friend request was initiated from `fromUserId`)
    const reverseRequestRef = this.firestore.collection('userDetails').doc(fromUserId)
                           .collection('friendRequests').doc(toUserId);
  
    await reverseRequestRef.delete(); // Delete the reverse friend request from the 'fromUserId' side
  }
  
}
