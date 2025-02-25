import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { StandupsTimeComponent } from './standups-time/standups-time.component';
import { StandupsService } from './../../_services/standups.service';
import { StandUps } from './../../_models/standups.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EventService } from 'src/app/_services/event.service';

@Component({
  selector: 'app-stand-ups',
  templateUrl: './stand-ups.component.html',
  styleUrls: ['./stand-ups.component.scss']
})
export class StandUpsComponent implements OnInit {
  users: StandUps[] = [];
  currUser;
  showRetroToggle: boolean = false;
  dataSource = [];
  currEmpName;
  displayedColumns = ['srno', 'title', 'description', 'date', 'completed'];
  events=[];

  userPageSize = 5; // Number of users to display per page
  userPageIndex = 0; // Current page index
  eventPageSize = 5; // Number of events to display per page
  eventPageIndex = 0;
  @ViewChild('eventPaginator') eventPaginator: MatPaginator;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedEvents: any[] = [];

  constructor(
    private standupService: StandupsService,
    public dialog: MatDialog,
    private snackbar: MatSnackBar,
    private router: Router,
    private  eventService: EventService,
    ) { }

  ngOnInit(): void {
    this.  showAllStandups() ;
    this.updateDisplayedEvents();
    this.currUser = JSON.parse(localStorage.getItem('currUser'));
    if(this.currUser.userName === 'Rohit'){
      this.getStandUps();
    }
    else{
      alert(`${this.currUser.userName}, you don't have permission to access this!`)
      this.router.navigateByUrl('/dashboard');
    }
  }

  openDialog(data){
    const dialogRef = this.dialog.open(StandupsTimeComponent, {
      width: '30%',
      height: '200px',
      data: data,
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result === 'Updated'){
        this.getStandUps();
        this.showNotification(
          'snackbar-success',
          'Add Record Successfully...!!!',
          'bottom',
          'center'
        );
      }
    });
  }

  getStandUps(){
    this.standupService.getStandups().subscribe(res=>{
      this.users = res;
    })
  }

  showRetro(user){
    console.log(user);
    this.showRetroToggle = true;
    this.currEmpName = user.name;
    this.dataSource = user.tasks;
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  showNotification(colorName, text, placementFrom, placementAlign) {
    this.snackbar.open(text, '', {
      duration: 2000,
      verticalPosition: placementFrom,
      horizontalPosition: placementAlign, 
      panelClass: colorName,
    });
  }
  showAllStandups() {
    this.eventService.getEvents().subscribe(
      (data) => {
        this.events = data;
        this.updateDisplayedEvents(); // Call this here to ensure displayed events are updated
        console.log(this.events);
      },
      (error) => {
        console.error('Error fetching events', error);
        this.snackbar.open('Failed to load events', '', {
          duration: 2000,
          verticalPosition: 'bottom',
          horizontalPosition: 'center',
        });
      }
    );
  }
  
updateDisplayedEvents() {
  const startIndex = this.eventPageIndex * this.eventPageSize;
  this.displayedEvents = this.events.slice(startIndex, startIndex + this.eventPageSize);
}


onEventPageChange(event: PageEvent) {
  this.eventPageIndex = event.pageIndex;
  this.eventPageSize = event.pageSize;
  this.updateDisplayedEvents();
}
}