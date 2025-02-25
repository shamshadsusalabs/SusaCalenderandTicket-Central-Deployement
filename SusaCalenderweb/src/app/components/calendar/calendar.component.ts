import { StandupsService } from './../../_services/standups.service';
import { StandUps } from './../../_models/standups.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from './../../_models/user.model';
import { Schedule } from './../../_models/schedule.model';
import { EventService } from './../../_services/event.service';
import { Component, OnInit } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventInput } from '@fullcalendar/angular';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { SprintComponent } from './sprint/sprint.component';
import { MissedTicketComponent } from './missed-ticket/missed-ticket.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  standup: StandUps;
  currStandupId;
  yesterdayTaskTitle;
  yesterdayTaskDescription;
  yesterdayTicket;
  standupsCompleted: boolean = false;
  popup: boolean = false;
  seriesEvents = [];
  sprintHours: number = 0;
  sprintMinutes: number = 0;

  weeklySprints = [];

  standupForm: FormGroup = new FormGroup({
    todayDescription: new FormControl('', Validators.required),
    todayTitle: new FormControl('', Validators.required),
    tomorrowDescription: new FormControl('', Validators.required),
    tomorrowTitle: new FormControl('', Validators.required),
  })

  today: Date;
  yesterday: Date;
  tomorrow: Date;

  constructor(
    public eventService: EventService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    public http : HttpClient,
    private standupService: StandupsService
  ) { 
    if(localStorage.getItem('originalUser')){
      console.log("here");
      let user = JSON.parse(localStorage.getItem('originalUser'));
      let currUser = { name: user.fullName }
      localStorage.setItem('currUser', JSON.stringify(currUser));
    }

    
    this.eventService.share.subscribe(res=> {
      this.share = res;
      if(res === true){
        this.eventService.showSchedule.next(false);
      }
    })
    this.eventService.showSchedule.subscribe(res=> {
      this.showSchedules = res;
      if(res === true){
        this.eventService.share.next(false);
      }
    });
  }

  share: boolean = false;
  dateClicked: boolean = false;
  eventClicked: boolean = false;
  assignees = [];
  eventDateStart;
  eventDateEnd;
  scheduleEvents: EventInput = [];
  currentEventData;
  filterItems: string[] = [];
  schedules: Schedule[] = [];
  currUser;
  currUserSchedules;
  otherAssignes = [];
  GetSharedSchedules = [];
  showSchedules: boolean;
  emptySharedSchedules: boolean = false;
  allAssignees = [];

  public filters = [];

  addStandUps(data){
    console.log(data);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    let body1 = { tid: this.currStandupId, title: data.todayTitle, description: data.todayDescription, isCompleted: false, date: today  };
    let body2 = { tid: this.currStandupId, title: data.tomorrowTitle, description: data.tomorrowDescription, isCompleted: false, date: tomorrow  };

    console.log(body1);
    console.log(body2);
    
    this.standupService.addTaskinStandups(body1).subscribe();
    this.standupService.addTaskinStandups(body2).subscribe(res=>{
      this.standupsCompleted = true;
      localStorage.setItem('TodayStandups', JSON.stringify(String(today)));
      this.showNotification(
        'snackbar-success',
        'Stand-Ups Updated!',
        'bottom',
        'center'
      )
    });

    // let date = new Date();
    // date.setHours(10, 30, 0);
    // let body = { popupDate: String(date) };
    // console.log(body);

    // const yesterday = new Date();
    // yesterday.setDate(yesterday.getDate() - 1);
    // let body = { tid: "6271182eda07138d5619a46b", title: "Standups", description: "To Complete Standups", isCompleted: false, date: yesterday }
    // console.log(body);
  }

  // getSprint(){
  //   let a = 1;
  //   let nextDate: Date;
  //   this.eventService.getEvents().subscribe(res=>{
  //     res.forEach(event=>{

  //       if(event.title === this.currUser.userName){
  //         let startFull = new Date(2022, 4, 1)
  //         let startDate = startFull.getDate();
  //         let startMonth = startFull.getMonth();

  //         let eventStartFull = new Date(event.start);
          
  //         if(eventStartFull.getDate() >= startDate){
  //           if(eventStartFull.getMonth() >= startMonth){
  //             event.start = new Date(event.start);
  //             event.end = new Date(event.end);

  //             console.log(event.start.getDate(), a);
              
  //             if(event.start.getDate() === a){
  //               this.seriesEvents.push(event);
  //               nextDate = new Date(event.start);
  //               a+=1;
  //             }
  //             else{
  //               let date = new Date();
  //               date.setDate(nextDate.getDate() + 1);
  //               date.setMonth(nextDate.getMonth());
  //               date.setHours(0,0,0,0);
  //               let body = { title: this.currUser.userName, start: date.toISOString(), end: date.toISOString(), color: 'abcd', details: 'nothing' };
  //               this.seriesEvents.push(body);
  //               nextDate = new Date(date);
  //               a+=1;
  //             }
  //           }
  //         }
          
  //         // this.seriesEvents.forEach(event=>{
  //         //   event.start = new Date(event.start);

  //         //   if(event.start.getMonth() === nextDate.getMonth()){
  //         //     if(event.start.getDate() === nextDate.getDate() - 1){

  //         //     }
  //         //     else if(event.start.getDate() !== nextDate.getDate() - 1){
                
  //         //     }
  //         //   }
  //         // })
  //       }
  //     })

  //     for(let i = 0, j = i + 7; i < this.seriesEvents.length; i+7){
  //       this.sprintHours = 0;
  //       this.sprintMinutes = 0;

  //       var temp = this.seriesEvents.splice(i, j);
  //       temp.forEach(event=>{
  //         event.start = new Date(event.start);
  //         event.end = new Date(event.end);
  //         if(event.start.getDate() === event.end.getDate()){
  //           let hours = event.end.getHours() - event.start.getHours();
  //           let minutes = event.end.getMinutes() - event.start.getMinutes();
  //           this.sprintHours = this.sprintHours + hours;
  //           this.sprintMinutes = this.sprintMinutes + minutes;
  //         }
  //       })

  //       let totalSprint = { start: temp[0].start, end: temp[temp.length-1].start, totalHours: this.sprintHours, totalMinutes: this.sprintMinutes };
  //       this.weeklySprints.push(totalSprint);
  //     }
  //     console.log(this.weeklySprints);
  //   })
  // }

  getSprint(){
    let nextDate: Date;
    this.eventService.getEvents().subscribe(res=>{
      res.forEach(event=>{

        if(event.title === this.currUser.userName){
          let startFull = new Date(2022, 4, 1)
          let startDate = startFull.getDate();
          let startMonth = startFull.getMonth();

          let eventStartFull = new Date(event.start);
          
          if(eventStartFull.getDate() >= startDate){
            if(eventStartFull.getMonth() >= startMonth){
              event.start = new Date(event.start);
              event.end = new Date(event.end);
              this.seriesEvents.push(event);
            }
          }
        }
      })
      let lastEventDate: Date = new Date();
      
      let startFull = new Date(2022, 4, 1, 0, 0, 0, 0)
      lastEventDate.setHours(0, 0, 0, 0)

      let totalDays;
      if(lastEventDate.getFullYear() === startFull.getFullYear()){
        let totalMS = lastEventDate.getTime() - startFull.getTime();
        let totalHours = (totalMS/(60*60*1000))
        totalDays = (totalHours/24);
        console.log(totalDays);
      }

      let arr = [];
      // for(let i = 1; i < totalDays+1; i++){
      //   arr[i-1] = 'empty';
      // }

      let j: number;
      for(let i = 1; i < totalDays+1; i++){
        console.log(i);
        
        if(i <= 31){
          j = 0;
        }
        else if(i > 31 && i <= 60){
          j = 31;
        }
        else if(i > 60 && i <= 91){
          j = 60;
        }
        else if(i > 91 && i <= 122){
          j = 91;
        }
        else if(i > 122 && i <= 151){
          j = 122;
        }
        else if(i > 151 && i <= 182){
          j = 151;
        }
        else if(i > 182 && i <= 211){
          j = 182;
        }
        else if(i > 211 && i <= 242){
          j = 211;
        }
        
        if(this.seriesEvents[i-1]){
          if(this.seriesEvents[i-1].start.getDate() === i-j){
            arr[i-1] = this.seriesEvents[i-1];
            nextDate = new Date(this.seriesEvents[i-1].start);
          }
          if(this.seriesEvents[i-1].start.getDate() !== i-j){
            arr[this.seriesEvents[i-1].start.getDate() - 1 + j] = this.seriesEvents[i-1];
            let date = new Date();
            date.setDate(nextDate.getDate() + 1);
            date.setMonth(nextDate.getMonth());
            date.setHours(0,0,0,0);
            let body = { title: this.currUser.userName, start: date, end: date, color: 'abcd', details: 'nothing' };
            arr[i-1] = body;
            nextDate = new Date(date);
          }
        }
        else{
          if(!arr[i-1]){
            let date = new Date();
            date.setDate(nextDate.getDate() + 1);
            date.setMonth(nextDate.getMonth());
            date.setHours(0,0,0,0);
            let body = { title: this.currUser.userName, start: date, end: date, color: 'abcd', details: 'nothing' };
            arr[i-1] = body;
            nextDate = new Date(date);
          }
        }
        console.log(arr);
      }
      

      for(let i = 0, j = i + 7; i < arr.length; i+7){
        this.sprintHours = 0;
        this.sprintMinutes = 0;

        var temp = arr.splice(i, j);
        temp.forEach(event=>{
          event.start = new Date(event.start);
          event.end = new Date(event.end);
          if(event.start.getDate() === event.end.getDate()){
            let hours = event.end.getHours() - event.start.getHours();
            let minutes = event.end.getMinutes() - event.start.getMinutes();
            this.sprintHours = this.sprintHours + hours;
            this.sprintMinutes = this.sprintMinutes + minutes;
          }
        })

        let totalSprint = { start: temp[0].start, end: temp[temp.length-1].start, totalHours: this.sprintHours, totalMinutes: this.sprintMinutes };
        this.weeklySprints.push(totalSprint);
      }
      console.log(this.weeklySprints);
    })
  }

  openSprint(){
    const dialogRef = this.dialog.open(SprintComponent, {
      width: '60%',
      height: '450px',
    });
  }

  showSprint(){
    console.log(this.weeklySprints);
    const dialogRef = this.dialog.open(SprintComponent, {
      width: '55%',
      height: '450px',
      data: this.weeklySprints,
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  checkPreviousDayEvent(){
    let today = new Date();
    let yesterdayDate = today.getDate() - 1;
    let yesterdayMonth = today.getMonth();
    
    this.eventService.getEvents().subscribe(res=>{
      let array = [];
      res.forEach(entry=> {
        if(entry.title === this.currUser.userName){
          array.push(entry);
        }
      })
      let bool = false;
      array = array.filter(x => {
        let date = new Date(x.start);
        if(date.getMonth() === yesterdayMonth){      
          if(date.getDate() === yesterdayDate){
            bool = true;
          }    
        }
      })
      if(bool === false){
        today.setDate(today.getDate() - 1);
        today.setHours(0, 0, 0, 0);
        const dialogRef = this.dialog.open(MissedTicketComponent, {
          width: '40%',
          height: '350px',
          data: {date: today, user: this.currUser.userName},
        });
        dialogRef.afterClosed().subscribe(res=>{
          if(res === 'added'){
            this.getSchedules();
            this.getEvents();
            this.getSprint();
          }
        })
      }
    })
  }

  getStandUps(){
    this.standupService.getStandups().subscribe(res=>{
      res.forEach(standup =>{
        if(standup.name === this.currUser.userName){
          let showFull = new Date(standup.popupDate);
          let showHours = showFull.getHours();
          let showMin = showFull.getMinutes();

          let todayFull = new Date();
          let todayHours = todayFull.getHours();
          let todayMin = todayFull.getMinutes();

          if(todayHours === showHours){
            if(todayMin >= showMin){
              this.popup = true;
            }
          }
          else if(todayHours > showHours){
            this.popup = true;
          }
        }
      })
    })
    if(localStorage.getItem('TodayStandups')){
      let storageFull = JSON.parse(localStorage.getItem('TodayStandups'));
      storageFull = new Date(storageFull);
      let storageDate = storageFull.getDate();
      let storageMonth = storageFull.getMonth();

      let todayFull: Date = new Date();
      let todayDate = todayFull.getDate();
      let todayMonth = todayFull.getMonth();

      console.log(storageDate, storageMonth);
      console.log(todayDate, todayMonth);

      if(storageDate === todayDate){
        if(todayMonth === storageMonth){
          this.standupsCompleted = true;
        }
      }
    }
    this.today = new Date();
    this.tomorrow = new Date();
    this.tomorrow.setDate(this.tomorrow.getDate() + 1);
    this.yesterday = new Date();
    this.yesterday.setDate(this.yesterday.getDate() - 1);
    
    const todayDateFull = new Date();
    const todayDate = todayDateFull.getDate();
    const todayMonth = todayDateFull.getMonth();
    this.standupService.getStandups().subscribe(res=>{
      res.forEach(standup=>{
        if(standup.name === this.currUser.userName){
          console.log(standup);
          this.currStandupId = standup._id;
          standup.tasks.forEach(task=>{
            let fulldate = new Date(task.date);
            let month = fulldate.getMonth();
            let date = fulldate.getDate();

            let todayFull = new Date();
            let todayDate = todayFull.getDate(); 
            let todayMonth = todayFull.getMonth(); 

            if(date === todayDate){
              if(month === todayMonth){
                this.standupForm.get('todayTitle').setValue(task.title);
                this.standupForm.get('todayDescription').setValue(task.description);
              }
            }

            if(date === todayDate - 1){
              if(month === todayMonth){
                this.yesterdayTaskTitle = task.title;
                this.yesterdayTaskDescription = task.description;
                this.yesterdayTicket = task;
              }
            }
          })
        }
      })
    })
  }

  toggleCompleted(bool){
    console.log(bool);
    if(bool === true){
      console.log(this.yesterdayTicket);
      let body = { id: this.currStandupId, sid: this.yesterdayTicket.sid, isCompleted: bool };
      this.standupService.updateTaskinStandups(body).subscribe(res=>{
        this.showNotification(
          'snackbar-success',
          'Yesterday-Task Completed!',
          'bottom',
          'center'
        )
      })
    }
  }

  changeCategory(event: MatCheckboxChange, filter) {
    if (event.checked) {
      this.filterItems.push(filter.name);
      console.log(this.filterItems);
      
    } else {
      this.filterItems.splice(this.filterItems.indexOf(filter.name), 1);
      console.log(this.filterItems);
    }
    this.filterEvent(this.filterItems);
  }

  filterEvent(element) {
    console.log(element);
    console.log(this.scheduleEvents);
    
    const list = this.scheduleEvents.filter((x) =>
      element.map((y) => y).includes(x.title)
    );
    console.log(list);
    
    this.calendarOptions.events = list;
  }

  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay',
    },
    initialView: 'dayGridMonth',
    eventBorderColor: 'black',
    dateClick: this.handleDateClick.bind(this),
    weekends: true,
    selectable: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
  };

  handleDateClick(arg) {
    console.log(arg);
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    this.dateClicked = true;
    this.eventClicked = false;
    this.eventService.share.next(false);
    this.eventService.showSchedule.next(false);
    this.eventDateStart = selectInfo.start;
    this.eventDateEnd = selectInfo.end;
    this.eventService.addEventForm.get('start').setValue(this.eventDateStart);
    this.eventService.addEventForm.get('end').setValue(this.eventDateEnd);
  }

  handleEventClick(clickInfo: EventClickArg) {
    console.log(clickInfo.event);
    this.eventClicked = true;
    this.dateClicked = false;
    this.eventService.share.next(false);
    this.eventService.showSchedule.next(false);
    this.viewSchedule(clickInfo.event)
  }

  viewSchedule(data){
    this.currentEventData = data;
  }

  ngOnInit(): void {
    this.currUser = JSON.parse(localStorage.getItem('currUser'));
    this.getStandUps();
    this.getSprint();
    if(this.currUser.userName !== 'Rohit'){
      this.checkPreviousDayEvent();
    }

    this.eventService.getAssigneeNames().subscribe((res: User[]) =>{
      res.forEach(user=>{
        if(user.isVerified === true){
          this.allAssignees.push(user.userName);
          this.assignees.push(user.userName);
          this.otherAssignes.push(user.userName);
        }
      })
      res.map((x,i) => {
        if(x.userName === this.currUser.userName){
          console.log(x);
          this.otherAssignes.splice(i,1);
        }
      })
      this.otherAssignes.map((x, i) => {
        if(x === "Manager"){
          this.otherAssignes.splice(i,1);
        }
      })
      
      res.map((x,i) => {
        if(x.userName === this.currUser.userName){
          this.assignees.splice(i,1);
        }
      })
      
      this.filterItems = this.allAssignees;
      res.forEach((assignee, i) => {
        if(assignee.isVerified === true){
          if(assignee.userName !== "Manager"){
            let data = { name: assignee.userName, value: assignee.userName, checked: true };
            this.filters.push(data);
          }
        }
      })
    })
    this.getEvents();
    this.getSchedules();
    this.getSharedSchedules();
  }

  getSharedSchedules(){
    this.GetSharedSchedules = [];
    this.emptySharedSchedules = false;
    this.eventService.getSharedSchedules().subscribe(res=>{
      res.forEach(entry=>{
        if(entry.sendTo === this.currUser.userName){
          this.GetSharedSchedules.push(entry);
        }
      })
      this.eventService.sharedScheduleLength.next(this.GetSharedSchedules.length);
      if(this.GetSharedSchedules.length === 0)
        { 
          this.emptySharedSchedules = true;
        }
    })
  }

  openSharedSchedule(data){
    console.log(data);
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '60%',
      height: '700px',
      data: data,
    });
    dialogRef.afterClosed().subscribe(res=> {
      if(res === "Deleted"){
        this.getSharedSchedules();
      }
    })
  }

  shareSchedule(name){
    let shareDate = new Date();
    let shareSchedule = { 
      sendTo: name.assigneeName, 
      scheduleOf: this.currUserSchedules.title, 
      schedules: this.currUserSchedules.schedules ,
      sharedDate: shareDate
    };
    console.log(shareSchedule);
    this.eventService.postSharedSchedule(shareSchedule).subscribe(res=>{
      console.log(res);
      this.showNotification(
        'snackbar-success',
        'Schedule Shared Successfully...!!!',
        'bottom',
        'center'
      )
      this.eventService.sharePersonName.reset();
      this.eventService.share.next(false);
    })
  }

  getEvents(){
    if(this.currUser.userName === 'Rohit'){
      this.eventService.getEvents().subscribe(res=> {
        this.scheduleEvents = res;
        this.calendarOptions.events = this.scheduleEvents;
      })
    }
    else{
      this.eventService.getEvents().subscribe(res=>{
        let array = [];
        res.forEach(entry=> {
          if(entry.title === this.currUser.userName){
            array.push(entry);
          }
        })
        this.scheduleEvents = array;
        this.calendarOptions.events = this.scheduleEvents;
      })
    }
  }

  getSchedules(){
    this.eventService.getSchedules().subscribe(res=>{
      if(this.currUser.userName === 'Rohit'){
        this.schedules = res;
      }
      else{
        res.forEach(user => {
          if(user.title === this.currUser.userName){
            this.currUserSchedules = user;
          }
        })
      }
    })
  }

  addEvent(data){
      if(this.currUser.userName !== 'Rohit'){
        data.title = this.currUser.userName
      }
      this.allAssignees = [];
      this.eventService.getAssigneeNames().subscribe((res: User[]) =>{
        res.forEach(user=>{
          this.allAssignees.push(user.userName)
        })
        console.log(this.allAssignees);
        let index = this.allAssignees.indexOf(data.title);
        console.log(index);
        if(index === 0){
          data.color = "green";
        }
        if(index === 1){
          data.color = "#03c5de";
        }
        if(index === 2){
          data.color = "#f9483b";
        }
        if(index === 3){
          data.color = "#ff9800";
        }
        if(index === 4){
          data.color = "#8f4a4a";
        }
        if(index === 5){
          data.color = "#9fe51f";
        }
        if(index === 6){
          data.color = "#0f589c";
        }
        if(index === 7){
          data.color = "#8614b3";
        }
        if(index === 8){
          data.color = "#08b8dc";
        }
        console.log(data);

        if(this.currUser.userName === 'Rohit'){
          this.eventService.getSchedules().subscribe(res=>{
            res.forEach(user=>{
              if(user.title === data.title){
                this.currUserSchedules = user;
              }
            })
            console.log(this.currUserSchedules);

            if(this.currUserSchedules === undefined){
              let entity = { start: data.start, end: data.end, details: data.details };
              let user = { 
                title: data.title,
                colour: data.color,
                schedules: []
              }
              this.currUserSchedules = user;
              this.currUserSchedules.schedules.push(entity);
              console.log(this.currUserSchedules);
              this.eventService.postSchedule(this.currUserSchedules).subscribe(res=>{
                this.getSchedules();
                this.eventService.postEvent(data).subscribe(res => {
                  this.eventService.addEventForm.reset();
                  this.dateClicked = false;
                  this.getEvents();
                  this.getSprint();
                  this.showNotification(
                    'snackbar-success',
                    'Add Record Successfully...!!!',
                    'bottom',
                    'center'
                  )
                })
              });
            }
            else{
              let entity = { start: data.start, end: data.end, details: data.details, tid: this.currUserSchedules._id };
              console.log(entity);
              this.eventService.addScheduleInSchedule(entity).subscribe(res=>{
                this.getSchedules();
                this.eventService.postEvent(data).subscribe(res => {
                  this.eventService.addEventForm.reset();
                  this.dateClicked = false;
                  this.getEvents();
                  this.getSprint();
                  this.showNotification(
                    'snackbar-success',
                    'Add Record Successfully...!!!',
                    'bottom',
                    'center'
                  )
                })
              });
            }
          })
        }

        else{
          if(this.currUserSchedules === undefined){
            let entity = { start: data.start, end: data.end, details: data.details };
            let user = { 
              title: data.title,
              colour: data.color,
              schedules: []
            }
            this.currUserSchedules = user;
            this.currUserSchedules.schedules.push(entity);
            console.log(this.currUserSchedules);
            this.eventService.postSchedule(this.currUserSchedules).subscribe(res=>{
              this.getSchedules();
              this.eventService.postEvent(data).subscribe(res => {
                this.eventService.addEventForm.reset();
                this.dateClicked = false;
                this.getEvents();
                this.showNotification(
                  'snackbar-success',
                  'Add Record Successfully...!!!',
                  'bottom',
                  'center'
                )
              })
            });
          }
          else{
            let entity = { start: data.start, end: data.end, details: data.details, tid: this.currUserSchedules._id };
            console.log(entity);
            this.eventService.addScheduleInSchedule(entity).subscribe(res=>{
              this.getSchedules();
              this.eventService.postEvent(data).subscribe(res => {
                this.eventService.addEventForm.reset();
                this.dateClicked = false;
                this.getEvents();
                this.showNotification(
                  'snackbar-success',
                  'Add Record Successfully...!!!',
                  'bottom',
                  'center'
                )
              })
            });
          }
        }
    })
  }

  editEvent(data){

  }

  deleteEvent(data){
    this.eventService.getSchedules().subscribe(res=>{
      res.forEach(user=>{
        if(user.title === this.currUser.userName){
          user.schedules.forEach(schedule=>{
            if(data.start.toISOString() === schedule.start){
              const body = { sid: schedule.sid, id: user._id };
              console.log(body);
              this.eventService.deleteScheduleInSchedule(body).subscribe();
            }
          })
        }
      })
    })
    let body = { id: data.extendedProps._id }
    this.eventService.deleteEvent(body).subscribe(res=>{
      this.showNotification(
        'snackbar-success',
        'Event Deleted!',
        'bottom',
        'center'
      )
      this.getSchedules();
      this.getEvents();
      this.eventClicked = false;
    })
  }

  clearForm(){
    this.eventService.addEventForm.get('title').reset();
    this.eventService.addEventForm.get('details').reset();
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
