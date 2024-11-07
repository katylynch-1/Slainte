export interface Message {
    senderId: string;
    content: string;
    timestamp: number;
    lastMessageTimestamp: number;
    senderName?: string; // Optional property for displaying the sender's name
  }
  