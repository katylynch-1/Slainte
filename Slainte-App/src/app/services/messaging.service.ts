import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Message } from '../message.model';

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
        timestamp: timestamp,
        read: false // Mark message as unread by default
      });

      this.db.object(`/userChats/${senderId}/${chatId}`).update({
        lastMessage: message,
        lastMessageTimestamp: timestamp
      });

      const recipientId = this.getRecipientId(chatId, senderId);
      this.db.object(`/userChats/${recipientId}/${chatId}`).update({
        lastMessage: message,
        lastMessageTimestamp: timestamp,
        // unreadCount: this.db.database.ref(`/userChats/${recipientId}/${chatId}/unreadCount`).once('value').then(snapshot => {
        //   return (snapshot.val() || 0) + 1;
        // })
      });
    });
  }

  resetUnreadCount(chatId: string, userId: string) {
    this.db.object(`/userChats/${userId}/${chatId}`).update({ unreadCount: 0 });
  }

  getRecipientId(chatId: string, currentUserId:string): string {
    const [user1Id, user2Id] = chatId.split('_');
    return user1Id === currentUserId ? user2Id : user1Id;
  }

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

  createChat(chatId: string, user1Id: string, user2Id: string): Promise<void> {
    const chatData = {
      user1Id: user1Id,
      user2Id: user2Id,
      messages: [] as any[],
      lastMessage: '',
      lastMessageTimestamp: Date.now()
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

  deleteChat(chatId: string, userId: string): Promise<void> {
    return this.db.object(`/userChats/${userId}/${chatId}`).remove();
  }

}

