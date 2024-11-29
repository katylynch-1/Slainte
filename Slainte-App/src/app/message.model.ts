export interface Message {
    senderId: string;
    content: string;
    timestamp: number;
    lastMessageTimestamp: number;
    senderName?: string; 
  }
  