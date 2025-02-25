import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatService } from 'src/app/_services/chat.service';
import { GroupchatService } from 'src/app/_services/groupchat.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  private groupMessageSubscription: Subscription | null = null;
  @ViewChild('messagesContainer') private messagesContainer: ElementRef;
  loading: boolean = false;
  users: any[] = [];
  selectedUser: any;
  messages: any[] = [];
  newMessage: string = '';
  senderId: string;
  searchTerm: string = '';
  chatId: string;
  selectedFiles: File[] = [];
  selectedGroup: any;
  isGroupCreationVisible: boolean = false;
  groupName: string = '';
  groups: any[] = [];
  groupId: string;
  currentUserId:string;
  constructor(private chatService: ChatService, private groupService: GroupchatService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.chatService.getAllUsers().subscribe((data) => {
      this.users = data;
    });

    this.senderId = JSON.parse(localStorage.getItem('currUser'))._id;

    // Receive messages for the current chat
    this.chatService.receiveMessage().subscribe((message) => {
      if (this.chatId && message.chatId === this.chatId) {
        this.messages.push(message);
        this.scrollToBottom();
      }
    });

    // Listen for group messages
    this.getGroupByCurrentUserId();
  }

  getGroupByCurrentUserId() {
    this.groupService.getGroupByCurrentUserId().subscribe((data) => {
      this.groups = data;
    }, error => {
      console.error('Error fetching group:', error);
    });
  }

  selectUser(user: any) {
    this.selectedGroup = null; // Reset selected group
    this.selectedUser = user;
    console.log('Selected User:', this.selectedUser);

    this.chatService.startChat(this.senderId, user._id).subscribe((response) => {
      this.messages = response.messages || [];
      this.chatId = response._id;
      this.chatService.joinChatRoom(this.chatId);
      this.scrollToBottom();
    });
  }
  selectGroup(group: any) {
    this.selectedUser = null; // Reset selected user
    this.selectedGroup = group;
    console.log('Selected Group:', this.selectedGroup);

    this.messages = group.messages || [];
    this.groupId = group._id;

    // Leave previous group room if any
    if (this.groupId) {
      this.groupService.leaveGroup();
    }

    // Join the new group room
    this.groupService.joinGroup(this.groupId);

    // Unsubscribe from previous subscription if it exists
    if (this.groupMessageSubscription) {
      this.groupMessageSubscription.unsubscribe();
    }

    // Subscribe to new group messages
    this.groupMessageSubscription = this.groupService.receiveGroupMessage().subscribe((message) => {
      const currUser = JSON.parse(localStorage.getItem('currUser'));

      // Check if the message is not from the current user
      if (currUser && message.senderId !== currUser._id) {
        console.log("Received group message from another user:", message);
        this.messages.push(message);  // Add the new message only if from another user
        this.scrollToBottom(); // Scroll to the bottom of the chat
      }
    });

    this.scrollToBottom(); // Initial scroll
  }
  formatMessage(message: string): string {
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    return message?.replace(urlPattern, '<a href="$&" target="_blank" rel="noopener noreferrer">$&</a>');
  }


  // Unsubscribe when component is destroyed
  ngOnDestroy() {
    if (this.groupMessageSubscription) {
      this.groupMessageSubscription.unsubscribe();
    }
  }



  filteredUsers() {
    return this.users.filter(user => user.userName.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  onFileSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  sendOneToOneMessage() {
    console.log('Sending one-to-one message...');
    this.loading = true; // Start loading

    if (!this.newMessage.trim() && !this.selectedFiles.length) {
      console.log('No message or files to send.');
      this.loading = false; // Stop loading
      return;
    }

    const receiverId = this.selectedUser._id;
    const currUser = JSON.parse(localStorage.getItem('currUser'));
    const senderName = currUser?.userName || 'Unknown User';
    const currentTimestamp = new Date().toISOString();

    if (this.selectedFiles.length) {
      const uploadTasks = this.selectedFiles.map(file => this.chatService.uploadFile(file).toPromise());

      Promise.all(uploadTasks).then(fileUrls => {
        fileUrls.forEach(fileUrl => {
          this.chatService.sendMessage(this.senderId, receiverId, this.chatId, '', fileUrl);
          this.messages.push(this.createMessageObject(senderName, receiverId, '', fileUrl, currentTimestamp));
        });
        this.scrollToBottom();
        this.clearInputFields(); // Clear input fields after sending
      }).catch(error => {
        console.error('File upload failed', error);
      }).finally(() => {
        this.loading = false; // Stop loading after upload
      });
    } else {
      // Send text message
      this.chatService.sendMessage(this.senderId, receiverId, this.chatId, this.newMessage.trim());
      this.messages.push(this.createMessageObject(senderName, receiverId, this.newMessage.trim(), '', currentTimestamp));
      this.scrollToBottom();
      this.clearInputFields(); // Clear input fields after sending
      this.loading = false; // Stop loading
    }
  }

  sendGroupMessage() {
    this.loading = true; // Start loading
    console.log('Sending group message...');

    if (!this.newMessage.trim() && !this.selectedFiles.length) {
      console.log('No message or files to send.');
      this.loading = false; // Stop loading
      return;
    }

    const currUser = JSON.parse(localStorage.getItem('currUser'));
    const senderName = currUser?.userName || 'Unknown User';
    const currentTimestamp = new Date().toISOString();

    if (this.selectedFiles.length) {
      const uploadTasks = this.selectedFiles.map(file => this.groupService.uploadFile(file).toPromise());

      Promise.all(uploadTasks).then(fileUrls => {
        fileUrls.forEach(fileUrl => {
          const groupMessage = {
            sentAt: currentTimestamp,
            senderId: this.senderId,
            senderName: senderName,
            content: '',
            fileUrl: fileUrl,
            messageType: 'file'
          };
          this.groupService.sendGroupMessage(this.groupId, groupMessage);
          this.messages.push(this.createMessageObject(senderName, null, '', fileUrl, currentTimestamp, this.groupId));
        });
        this.scrollToBottom();
        this.clearInputFields(); // Clear input fields after sending
      }).catch(error => {
        console.error('File upload failed', error);
      }).finally(() => {
        this.loading = false; // Stop loading after upload
      });
    } else {
      // Send text message
      const groupMessage = {
        sentAt: currentTimestamp,
        senderId: this.senderId,
        senderName: senderName,
        content: this.newMessage.trim(),
        messageType: 'text'
      };
      this.groupService.sendGroupMessage(this.groupId, groupMessage);
      this.messages.push(this.createMessageObject(senderName, null, this.newMessage.trim(), '', currentTimestamp, this.groupId));
      this.scrollToBottom();
      this.clearInputFields(); // Clear input fields after sending
      this.loading = false; // Stop loading
    }
  }

  private createMessageObject(senderName: string, receiverId: string | null, content: string, fileUrl: string, sentAt: string, groupId: string | null = null) {
    return {
      sender: this.senderId,
      receiver: receiverId,
      content: content,
      chatId: this.chatId,
      groupId: groupId,
      sentAt: sentAt,
      fileUrl: fileUrl,
      senderName: senderName
    };
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    });
  }

  toggleGroupCreation(): void {
    this.isGroupCreationVisible = !this.isGroupCreationVisible;
    this.groupName = '';
    this.users.forEach(user => user.selected = false);
  }

  createGroup(): void {
    const selectedUserIds = this.users.filter(user => user.selected).map(user => user._id);

    if (this.groupName && selectedUserIds.length) {
      const groupData = {
        name: this.groupName,
        participants: selectedUserIds
      };

      this.groupService.createGroup(groupData).subscribe(response => {
        this.toggleGroupCreation();
        this.getGroupByCurrentUserId();
      }, error => {
        console.error('Error creating group:', error);
      });
    } else {
      console.log('Please enter a group name and select participants.');
    }
  }

  formatTime(sentAt: string): string {
    const date = new Date(sentAt);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }

  private clearInputFields() {
    this.newMessage = '';
    this.selectedFiles = [];
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // Clear the file input
    }
  }
}
