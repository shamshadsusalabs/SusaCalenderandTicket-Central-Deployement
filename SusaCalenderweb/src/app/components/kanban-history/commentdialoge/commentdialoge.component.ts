import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-commentdialoge',
  templateUrl: './commentdialoge.component.html',
  styleUrls: ['./commentdialoge.component.scss']
})
export class CommentdialogeComponent  {

  constructor(public dialogRef: MatDialogRef<CommentdialogeComponent>) {}

  onAlreadyCommented(): void {
    this.dialogRef.close(true);  // Close dialog and return true
  }

  onCancel(): void {
    this.dialogRef.close(false);  // Close dialog and return false
  }


}
