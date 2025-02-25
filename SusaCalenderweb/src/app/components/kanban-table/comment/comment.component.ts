import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  comment: string = '';
  userName: string;

  constructor(
    public dialogRef: MatDialogRef<CommentComponent>
  ) {}

  ngOnInit(): void {
    const currUser = JSON.parse(localStorage.getItem('currUser'));
    this.userName = currUser?.userName;  // Retrieve userName from localStorage
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addComment(): void {
    if (this.comment.trim()) {
      const commentData = {
        userName: this.userName,
        comment: this.comment
      };
      console.log("sdjhh",commentData);
      this.dialogRef.close(commentData);  // Passes the comment data back to the parent
    }
  }
}
