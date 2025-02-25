import { MatSnackBar } from '@angular/material/snack-bar';
import { EventService } from './../../_services/event.service';
import { ViewScheduleComponent } from './../view-schedule/view-schedule.component';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalendarOptions, EventClickArg, EventInput } from '@fullcalendar/angular';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  sharedEvents: EventInput = [];

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private dialog: MatDialog,
    private eventService: EventService,
    private snackbar: MatSnackBar
  ) {
    console.log(data);
    this.sharedEvents = data.schedules;
    this.calendarOptions.events = this.sharedEvents;
  }

  ngOnInit(): void {
  }

  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay',
    },
    initialView: 'dayGridMonth',
    eventBorderColor: 'black',
    // dateClick: this.handleDateClick.bind(this),
    weekends: true,
    selectable: true,
    // select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
  };

  handleEventClick(clickInfo: EventClickArg){
    console.log(clickInfo.event);
    this.viewSchedule(clickInfo.event, this.data.scheduleOf, this.data.id)
  }

  viewSchedule(data, name, id){
    const dialogRef = this.dialog.open(ViewScheduleComponent, {
      width: '23%',
      data: { data, name, id }
    })
  }

  deleteSchedule(){
    const body = { id: this.data._id };
    this.eventService.deleteSharedSchedule(body).subscribe(res=>{
      this.showNotification(
        'snackbar-danger',
        'Schedule Deleted Successfully...!!!',
        'bottom',
        'center'
      )
      this.dialogRef.close("Deleted");
    })
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
