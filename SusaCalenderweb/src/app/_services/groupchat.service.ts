import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { catchError, tap } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GroupchatService {

  private apiUrl = 'http://localhost:3000'; // Replace with your backend URL
  private socket: Socket;
  private currentGroupId: string | null = null;

  constructor(private http: HttpClient, private storage: AngularFireStorage) {
    // Initialize the socket connection
    this.socket = io(this.apiUrl);
  }

  createGroup(groupData: { name: string; participants: string[] }): Observable<any> {
    const currUser = JSON.parse(localStorage.getItem('currUser'));
    const adminId = currUser ? currUser._id : null;

    if (!adminId) {
      console.error('Admin ID not found in local storage');
      return throwError('Admin ID not found in local storage');
    }

    const updatedGroupData = {
      ...groupData,
      adminId: adminId,
    };

    return this.http.post(`${this.apiUrl}/api/groups/create`, updatedGroupData).pipe(
      tap((group) => {
        console.log('Group created:', group);
      }),
      catchError((error) => {
        console.error('Error creating group:', error);
        return throwError('Error creating group');
      })
    );
  }

  getGroupByCurrentUserId(): Observable<any> {
    const currUser = JSON.parse(localStorage.getItem('currUser'));
    const userId = currUser ? currUser._id : null;

    if (!userId) {
      console.error('User ID not found in local storage');
      return throwError('User ID not found in local storage');
    }

    return this.http.get(`${this.apiUrl}/api/groups/getByMemberId/${userId}`).pipe(
      catchError(error => {
        console.error('Error fetching group by current user ID:', error);
        return throwError('Failed to fetch group');
      })
    );
  }

  joinGroup(groupId: string): void {
    if (this.socket && this.currentGroupId) {
      this.leaveGroup(); // Leave the current group room if already joined
    }

    this.currentGroupId = groupId; // Update the current group ID
    this.socket.emit('joinGroup', groupId); // Join the new group room
  }

  // Leave the current group room
  leaveGroup(): void {
    if (this.socket && this.currentGroupId) {
      this.socket.emit('leaveGroup', this.currentGroupId); // Emit leaveGroup event
      this.currentGroupId = null; // Reset the current group ID
    }
  }

  sendGroupMessage(groupId: string, messageData: { content?: string; fileUrl?: string; messageType: string, senderName: string, sentAt: string }): void {
    this.socket.emit('sendGroupMessage', groupId, messageData);
  }

  uploadFile(file: File): Observable<string> {
    const filePath = `group_chat_files/${Date.now()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    return new Observable<string>((observer) => {
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            observer.next(url);
            observer.complete();
          });
        })
      ).subscribe();
    });
  }

  receiveGroupMessage(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('receiveGroupMessage', (message) => {
        observer.next(message);
      });

      return () => {
        this.socket.off('receiveGroupMessage');
      };
    });
  }
}
