import { EventService } from './../../../_services/event.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/_models/user.model';

@Component({
  selector: 'app-sprint',
  templateUrl: './sprint.component.html',
  styleUrls: ['./sprint.component.scss']
})
export class SprintComponent implements OnInit {
  currUser;
  assignes = [];
  sprintToggle: boolean = false;
  seriesEvents = [];
  sprintHours: number = 0;
  sprintMinutes: number = 0;
  weeklySprints = [];

  constructor(
    public dialogRef: MatDialogRef<SprintComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private eventService: EventService
  ) { 
    console.log(data);
  }

  ngOnInit(): void {
    this.currUser = JSON.parse(localStorage.getItem('currUser'));

    this.eventService.getAssigneeNames().subscribe((res: User[]) =>{
      res.forEach(user=>{
        if(user.isVerified === true){
          this.assignes.push(user.userName);
        }
      })
      this.assignes.map((x, i) => {
        if(x === "Manager"){
          this.assignes.splice(i,1);
        }
      })
      console.log(this.assignes);
    })
  }

  seeSprint(user){
    this.eventService.getEvents().subscribe(res=>{
      res.forEach(event=>{
        if(event.title === user){
          let startFull = new Date(2022, 4, 1)
          let startDate = startFull.getDate();
          let startMonth = startFull.getMonth();

          let eventStartFull = new Date(event.start);
          let eventEndFull = new Date(event.end)
          let eventStartDate = eventStartFull.getDate();
          let eventStartMonth = eventStartFull.getMonth();
          
          if(eventStartFull.getDate() >= startDate){
            if(eventStartFull.getMonth() >= startMonth){
              event.start = new Date(event.start);
              event.end = new Date(event.end);
              this.seriesEvents.push(event);
            }
          }
        }
      })

      this.weeklySprints = [];
      for(let i = 0, j = i + 7; i < this.seriesEvents.length; i+7){
        this.sprintHours = 0;
        this.sprintMinutes = 0;
        
  
        var temp = this.seriesEvents.splice(i, j);
        temp.forEach(event=>{
          if(event.start.getDate() === event.end.getDate()){
            let hours = event.end.getHours() - event.start.getHours();
            let minutes = event.end.getMinutes() - event.start.getMinutes();
            this.sprintHours = this.sprintHours + hours;
            this.sprintMinutes = this.sprintMinutes + minutes;
          }
        })
        console.log(temp[0], temp[temp.length - 1]);
        console.log(this.sprintHours, this.sprintMinutes);
  
        let totalSprint = { start: temp[0].start, end: temp[temp.length-1].start, totalHours: this.sprintHours, totalMinutes: this.sprintMinutes };
        this.weeklySprints.push(totalSprint);
        this.sprintToggle = true;
      }
    })
    console.log(this.weeklySprints);
  }

}
