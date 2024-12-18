import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { from, Observable, of, firstValueFrom } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Message } from '../message.model';
import { map } from 'rxjs/operators';

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
      });

      this.db.object(`/userChats/${senderId}/${chatId}`).update({
        lastMessage: message,
        lastMessageTimestamp: timestamp
      });

      const recipientId = this.getRecipientId(chatId, senderId);
      this.db.object(`/userChats/${recipientId}/${chatId}`).update({
        lastMessage: message,
        lastMessageTimestamp: timestamp,
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
      ]).then(() => {}); 
    });
  }

  checkIfChatExists(chatId: string): Promise<boolean> {
    return firstValueFrom(
      this.db.object(`/chats/${chatId}`).valueChanges().pipe(
        map(chat => !!chat)
      )
    );
  }
  
  generateChatId(user1Id: string, user2Id: string): string {
    // Generate a unique ID to concatenate and sort the two user IDs
    return user1Id < user2Id ? `${user1Id}_${user2Id}` : `${user2Id}_${user1Id}`;
  }

  deleteChat(chatId: string, userId: string): Promise<void> {
    const otherUserId = this.getRecipientId(chatId, userId);
    const deletePromises = [
      this.db.object(`/chats/${chatId}`).remove(),                  // Remove the chat from /chats
      this.db.object(`/userChats/${userId}/${chatId}`).remove(),    // Remove the chat for the current user
      this.db.object(`/userChats/${otherUserId}/${chatId}`).remove() // Remove the chat for the other user
    ];
    return Promise.all(deletePromises).then(() => {});
  }
  

}

