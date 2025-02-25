import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { AngularFireStorage } from '@angular/fire/compat/storage';// Import AngularFireStorage
import { finalize } from 'rxjs/operators'; // Import finalize operator

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;
  private apiUrl = 'http://localhost:3000/api'; // Your backend API URL

  constructor(private http: HttpClient, private storage: AngularFireStorage) {
    // Initialize socket connection
    this.socket = io('http://localhost:3000');
  }

  // Fetch all users except the current user
  getAllUsers(): Observable<any> {
    const currentUserId = JSON.parse(localStorage.getItem('currUser'))._id; // Get the current user's ID from local storage
    return this.http.get(`${this.apiUrl}/users/getall`, {
      params: { currentUserId } // Send the current user's ID as a query parameter
    });
  }

  // Start a new chat
  startChat(senderId: string, receiverId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/Chats/start`, { senderId, receiverId });
  }

  // Send message in one-to-one chat
 // Send message in one-to-one chat
sendMessage(senderId: string, receiverId: string, chatId: string, message: string, fileUrl?: string): void {
  let sentAt = new Date().toISOString();
  const messageData = {
    sentAt:sentAt,
      sender: senderId,
      receiver: receiverId,
      content: fileUrl ? '' : message, // If a file is being sent, set content to empty
      fileUrl: fileUrl || '', // If fileUrl is provided, use it
      chatId: chatId, // Include chatId in the message data
      messageType: fileUrl ? 'file' : 'text' // Determine message type
  };
  console.log("mss",messageData)
  this.socket.emit('sendMessage', chatId, messageData);
}


  // Upload file to Firebase Storage and return the file URL
  uploadFile(file: File): Observable<string> {
    const filePath = `chat_files/${Date.now()}_${file.name}`; // Create a unique file path
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file); // Upload file

    return new Observable<string>((observer) => {
      task.snapshotChanges().pipe(
        finalize(() => {
          // Get the download URL once the upload is complete
          fileRef.getDownloadURL().subscribe((url) => {
            observer.next(url);
            observer.complete();
          });
        })
      ).subscribe(); // Subscribe to trigger the upload
    });
  }

  // Listen for incoming messages in real-time
  receiveMessage(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('receiveMessage', (message) => {
        observer.next(message);
      });

      return () => {
        this.socket.off('receiveMessage'); // Clean up the listener on unsubscribe
      };
    });
  }

  // Join a specific chat room (for one-to-one chats)
  joinChatRoom(chatId: string): void {
    this.socket.emit('joinChat', chatId);
  }
}
