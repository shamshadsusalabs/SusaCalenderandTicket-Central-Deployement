import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/_models/user.model';
import { EventService } from 'src/app/_services/event.service';

@Component({
  selector: 'app-missed-ticket',
  templateUrl: './missed-ticket.component.html',
  styleUrls: ['./missed-ticket.component.scss']
})
export class MissedTicketComponent implements OnInit {
  allAssignees = [];
  currUserSchedules;
  customAddBoolean: boolean = false;

  // Updated FormGroup to handle yesterday, today, and tomorrow
  customAddForm: FormGroup = new FormGroup({
    startYesterday: new FormControl('', Validators.required),
    startToday: new FormControl('', Validators.required),
    startTomorrow: new FormControl('', Validators.required),
    detailsYesterday: new FormControl('', Validators.required),
    detailsToday: new FormControl('', Validators.required),
    detailsTomorrow: new FormControl('', Validators.required),
  });

  constructor(
    public dialogRef: MatDialogRef<MissedTicketComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private eventService: EventService,
    private snackbar: MatSnackBar,
  ) {
    console.log(data);
  }

  ngOnInit(): void {
    // Initialize the dates when the component is loaded
    this.customAddForm.get('startYesterday').setValue(this.getYesterdayDate());
    this.customAddForm.get('startToday').setValue(this.getTodayDate());
    this.customAddForm.get('startTomorrow').setValue(this.getTomorrowDate());
  }

  customAdd() {
    this.customAddBoolean = true;
  }

  // Helper methods to get the dates
  getYesterdayDate() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
  }

  getTodayDate() {
    return new Date();
  }

  getTomorrowDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }

  submitData(data) {
    this.allAssignees = [];
    this.eventService.getAssigneeNames().subscribe((res: User[]) => {
      res.forEach(user => {
        this.allAssignees.push(user.userName);
      });

      const index = this.allAssignees.indexOf(this.data.user);
      const color = this.getColorByIndex(index);
      
      // Create events for yesterday, today, and tomorrow
      const events = [
        { title: this.data.user, color, start: data.startYesterday, end: data.startYesterday, details: data.detailsYesterday },
        { title: this.data.user, color, start: data.startToday, end: data.startToday, details: data.detailsToday },
        { title: this.data.user, color, start: data.startTomorrow, end: data.startTomorrow, details: data.detailsTomorrow },
      ];

      events.forEach(event => {
        this.eventService.getSchedules().subscribe(res => {
          this.currUserSchedules = res.find(user => user.title === event.title);

          if (!this.currUserSchedules) {
            const newUser = { title: event.title, colour: event.color, schedules: [{ start: event.start, end: event.end, details: event.details }] };
            this.eventService.postSchedule(newUser).subscribe(() => {
              this.eventService.postEvent(event).subscribe(() => {
                this.closeAndNotify();
              });
            });
          } else {
            const entity = { start: event.start, end: event.end, details: event.details, tid: this.currUserSchedules._id };
            this.eventService.addScheduleInSchedule(entity).subscribe(() => {
              this.eventService.postEvent(event).subscribe(() => {
                this.closeAndNotify();
              });
            });
          }
        });
      });
    });
  }

  // Helper method to determine the color based on the assignee index
  getColorByIndex(index: number): string {
    const colors = ["green", "#03c5de", "#f9483b", "#ff9800", "#8f4a4a", "#9fe51f", "#0f589c", "#8614b3", "#08b8dc"];
    return colors[index] || "black";
  }

  closeAndNotify() {
    this.dialogRef.close('added');
    this.showNotification('snackbar-success', 'Record Updated Successfully!', 'bottom', 'center');
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackbar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign,
      panelClass: colorName,
    });
  }
}
