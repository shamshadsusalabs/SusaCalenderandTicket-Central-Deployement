import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { kanbanEvents } from 'src/app/_models/kanbanEvents.model';
import { User } from 'src/app/_models/user.model';
import { EventService } from 'src/app/_services/event.service';
import { TasksService } from 'src/app/_services/tasks.service';

@Component({
  selector: 'app-kanban-history',
  templateUrl: './kanban-history.component.html',
  styleUrls: ['./kanban-history.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class KanbanHistoryComponent implements OnInit {
  kanbanEvents = [];
  currUser;
  dataSource: MatTableDataSource<kanbanEvents>;
  expandedElement: kanbanEvents | null;
  displayedColumns = ['title', 'creationDate', 'closingDate', 'ticketDuration'];
  users = [];

  showKanbanHistoryToggle: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private tasksService: TasksService, private eventService: EventService) { }

  ngOnInit(): void {
    this.getCurrentUser();
    this.getKanbanEvents();
    this.currUser = JSON.parse(localStorage.getItem('currUser'));
    if(this.currUser.userName === 'Rohit'){
      this.eventService.getAssigneeNames().subscribe((res:User[]) =>{
        let users = res.filter(x => x.isVerified === true);
        this.users = users.filter(x => x.userName !== this.currUser.userName)
        console.log(this.users);
      })
    }
  }

  getCurrentUser(){
    this.currUser = JSON.parse(localStorage.getItem('currUser'));
  }

  getKanbanHistory(user){
    this.kanbanEvents = [];
    this.showKanbanHistoryToggle = !this.showKanbanHistoryToggle;
    this.tasksService.getKanbanEvents().subscribe(res=>{
      res.forEach(event=>{
        if(event.name === user.userName){
          if(event.closingDate !== null){
            this.kanbanEvents.push(event);
          }
        }
      })
      console.log(this.kanbanEvents);
      this.kanbanEvents.forEach(event=>{
         event.totalHours = time(event.creationDate, event.closingDate);
      })
      this.dataSource = new MatTableDataSource(this.kanbanEvents);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  getKanbanEvents(){
    this.kanbanEvents = [];
    this.tasksService.getKanbanEvents().subscribe(res=>{
      res.forEach(event=>{
        if(event.name === this.currUser.userName){
          if(event.closingDate !== null){
            this.kanbanEvents.push(event);
          }
        }
      })
      console.log(this.kanbanEvents);
      this.kanbanEvents.forEach(event=>{
        event.totalHours = time(event.creationDate, event.closingDate);
      })
      this.dataSource = new MatTableDataSource(this.kanbanEvents);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

}

// export const FindDifference = (
//   startDate: string,
//   endDate: string
// ): string => {
//   let diffms = new Date(endDate).getTime() - new Date(startDate).getTime();
//   let temp = 1000 * 60;

//   const Min = diffms/temp;
//   console.log(Min);

//   if(Min > 60){
//     const Hours = Min/60;
//     console.log(Hours);
//   }

//   return 'abc'
// }

export const time = (startTime, endTime) => {
  let temp;
  const diff = new Date(endTime).getTime() - new Date(startTime).getTime();

  if (diff >= 0) {
    let remain = diff / (1000 * 3600 * 24);
    if (Math.trunc(remain) === 0) {
      remain = remain * 24;
      if(remain > 0.5){
        temp = "hours";
        if(Math.round(remain) === 1){
          temp = "hour";
        }
      }
      else{
        let tp = 1000 * 60;
        remain = diff/tp;
        temp = "minutes";
        if(Math.round(remain) === 1){
          temp = "minute";
        }
      }
    } else if (remain > 30) {
      remain = new Date(startTime).getMonth() - new Date().getMonth();
      temp = "months";
    } else {
      temp = "days";
    }
    return `${Math.round(remain)} ${temp}`;
  }
  return 'No Data';
};
