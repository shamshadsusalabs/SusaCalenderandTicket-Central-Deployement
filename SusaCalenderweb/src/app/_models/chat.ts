
import {Timestamp} from '@angular/fire/firestore';
import {ProfileUser}  from './Userprofile'
export interface Chat {
  id: string;
  lastMessage?: string;
  lastMessageDate?: Date & Timestamp;
  userIds: string[];
  users: ProfileUser[];
  chatPic?: string;
  chatName?: string;
  isGroup?: boolean; // new field to indicate if it's a group chat
  groupName?: string; // new field for the group name
}


export interface Message {
  id?: string;
  text?: string;
  senderId: string;
  sentDate: Date & Timestamp;
  fileType?: string; // 'image', 'video', 'pdf', etc.
  fileUrl?: string;
  senderDisplayName?: string; // URL to the file stored on a server or storage service
}

