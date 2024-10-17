import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { serverTimestamp } from 'firebase/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class MessagingService {

  constructor(private afs: AngularFirestore) { }

  findOrCreateChat(user1: string, user2: string): Promise<string> {
    const chatId = this.getChatId(user1, user2);

    return this.afs
      .collection('chats')
      .doc(chatId)
      .get()
      .toPromise()
      .then((doc) => {
        if (doc.exists) {
          // Chat already exists, return the chatId
          return chatId;
        } else {
          // Chat doesn't exist, create a new chat
          return this.createChat(user1, user2);
        }
      });
  }

  // Function to create a new chat and return the chatId
  private createChat(user1: string, user2: string): Promise<string> {
    const chatId = this.getChatId(user1, user2);

    const chatData = {
      user1,
      user2,
      createdAt: serverTimestamp(),
    };

    return this.afs
      .collection('chats')
      .doc(chatId)
      .set(chatData)  // Create the chat document
      .then(() => chatId);
  }

  // Function to generate a consistent chatId based on the two user IDs
  private getChatId(user1: string, user2: string): string {
    return user1 < user2 ? `${user1}_${user2}` : `${user2}_${user1}`;
  }

  // Function to get chat messages in real-time
  getChatMessages(chatId: string): Observable<any[]> {
    return this.afs
      .collection('chats')
      .doc(chatId)
      .collection('messages', ref => ref.orderBy('timestamp'))
      .valueChanges();
  }

  // Function to send a message to a chat
  sendMessage(chatId: string, senderId: string, receiverId: string, content: string): Promise<void> {
    const message = {
      senderId,
      receiverId,
      content,
      timestamp: serverTimestamp(),
    };

    return this.afs
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .add(message)
      .then(() => {
        //Now the return type is Promise<void>
        console.log('Message sent successfully');
      })
      .catch((error) => {
        console.error('Error sending message:', error);
      })
  }
}

