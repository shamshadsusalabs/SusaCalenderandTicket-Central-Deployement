import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-schedule',
  templateUrl: './view-schedule.component.html',
  styleUrls: ['./view-schedule.component.scss']
})
export class ViewScheduleComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ViewScheduleComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
  ) {
    console.log(data);
    
   }

  ngOnInit(): void {
  }

}
