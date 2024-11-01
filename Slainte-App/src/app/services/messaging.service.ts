import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Message } from '../message.model';
// import { serverTimestamp } from 'firebase/firestore';
// import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class MessagingService {

  constructor(private db: AngularFireDatabase, private auth: AngularFireAuth, private firestore: AngularFirestore) { }

  getUsers(): Observable<any[]>{
    return this.firestore.collection('userDetails').valueChanges();
  }

  getUserById(uid: string): Observable<any> {
    return this.firestore.collection('userDetails').doc(uid).valueChanges();
  }

  sendMessage(chatId: string, message: string){
    const timestamp = Date.now();
    this.auth.currentUser.then(user => {
      const senderId = user?.uid;
      this.db.list(`/chats/${chatId}/messages`).push({
        senderId: senderId,
        content: message,
        timestamp: timestamp
      });
      this.db.object(`/userChats/${senderId}/${chatId}`).update({
        lastMessage: message,
        timestamp: timestamp
      });
    });
  }

  // getMessages(chatId: string) {
  //   return this.db.list(`/chats/${chatId}/messages`).valueChanges();
  // }

  getMessages(chatId: string): Observable<Message[]> {
    return this.db.list<Message>(`/chats/${chatId}/messages`).valueChanges();
  }
  

  getUserChats(): Observable<any[]> {
    return from(this.auth.currentUser).pipe(
      switchMap(user => {
        if(user) {
          const userId = user.uid;
          return this.db.list(`/userChats/${userId}`).valueChanges();
        } else {
          return of ([]);
        }
      })
    )
  }

  // createChat(chatId: string, user1Id: string, user2Id: string){
  //   const chatData = {
  //     user1Id: user1Id,
  //     user2Id: user2Id,
  //     messages: [] as any[],
  //     lastMessage: '',
  //     timestamp: Date.now()
  //   };
  //   return this.db.object(`/chats/${chatId}`).set(chatData).then(() => {
  //     this.db.object(`/userChats/${user1Id}/${chatId}`).set(chatData);
  //     this.db.object(`/userChats/${user2Id}/${chatId}`).set(chatData);
  //   })
  // }

  createChat(chatId: string, user1Id: string, user2Id: string): Promise<void> {
    const chatData = {
      user1Id: user1Id,
      user2Id: user2Id,
      messages: [] as any[],
      lastMessage: '',
      timestamp: Date.now()
    };
    return this.db.object(`/chats/${chatId}`).set(chatData).then(() => {
      return Promise.all([
        this.db.object(`/userChats/${user1Id}/${chatId}`).set(chatData),
        this.db.object(`/userChats/${user2Id}/${chatId}`).set(chatData)
      ]).then(() => {}); // Add an empty .then() to resolve as void
    });
  }
  
  

  generateChatId(user1Id: string, user2Id: string): string {
    // A simple way to generate a unique ID is to concatenate and sort the two user IDs
    return user1Id < user2Id ? `${user1Id}_${user2Id}` : `${user2Id}_${user1Id}`;
  }

  // findOrCreateChat(user1: string, user2: string): Promise<string> {
  //   const chatId = this.getChatId(user1, user2);

  //   return this.afs
  //     .collection('chats')
  //     .doc(chatId)
  //     .get()
  //     .toPromise()
  //     .then((doc) => {
  //       if (doc.exists) {
  //         // Chat already exists, return the chatId
  //         return chatId;
  //       } else {
  //         // Chat doesn't exist, create a new chat
  //         return this.createChat(user1, user2);
  //       }
  //     });
  // }

  // // Function to create a new chat and return the chatId
  // private createChat(user1: string, user2: string): Promise<string> {
  //   const chatId = this.getChatId(user1, user2);

  //   const chatData = {
  //     user1,
  //     user2,
  //     createdAt: serverTimestamp(),
  //   };

  //   return this.afs
  //     .collection('chats')
  //     .doc(chatId)
  //     .set(chatData)  // Create the chat document
  //     .then(() => chatId);
  // }

  // // Function to generate a consistent chatId based on the two user IDs
  // private getChatId(user1: string, user2: string): string {
  //   return user1 < user2 ? `${user1}_${user2}` : `${user2}_${user1}`;
  // }

  // // Function to get chat messages in real-time
  // getChatMessages(chatId: string): Observable<any[]> {
  //   return this.afs
  //     .collection('chats')
  //     .doc(chatId)
  //     .collection('messages', ref => ref.orderBy('timestamp'))
  //     .valueChanges();
  // }

  // // Function to send a message to a chat
  // sendMessage(chatId: string, senderId: string, receiverId: string, content: string): Promise<void> {
  //   const message = {
  //     senderId,
  //     receiverId,
  //     content,
  //     timestamp: serverTimestamp(),
  //   };

  //   return this.afs
  //     .collection('chats')
  //     .doc(chatId)
  //     .collection('messages')
  //     .add(message)
  //     .then(() => {
  //       //Now the return type is Promise<void>
  //       console.log('Message sent successfully');
  //     })
  //     .catch((error) => {
  //       console.error('Error sending message:', error);
  //     })
  // }
}

