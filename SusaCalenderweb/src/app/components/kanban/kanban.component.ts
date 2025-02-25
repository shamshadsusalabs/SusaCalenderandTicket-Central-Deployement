import { Router, ActivatedRoute } from '@angular/router';
import { User } from './../../_models/user.model';
import { ViewKanbanComponent } from './view-kanban/view-kanban.component';
import { EventService } from './../../_services/event.service';
import { kanbanEvents } from './../../_models/kanbanEvents.model';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TasksService } from 'src/app/_services/tasks.service';
import { DeleteComponent } from './delete/delete.component';
import { FormComponent } from './form/form.component';
import { take } from 'rxjs/operators';
import { background } from 'src/app/_models/background.model';
import { BackgroundComponent } from './background/background.component';
import { AddProjectComponent } from './add-project/add-project.component';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss']
})
export class KanbanComponent implements OnInit {
  showUserKanbanToggle: boolean = false;
  kanban = [];
  userKanban = [];

  category = [];
  userCategory = [];

  removeKanbanToggle: boolean = false;
  otherAssignes = [];
  currUser;
  totalNotifications: number;
  sharedKanban = [];
  users = [];

  backgroundPictures: background[] = [];
  currImage;

  constructor(
    public tasksService: TasksService,
    public eventService: EventService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) { }


  openProjectModal(): void {
    const dialogRef = this.dialog.open(AddProjectComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) { 
        console.log('Project Created:', result);
      }
    });
  }


  ngOnInit(): void {
    this.tasksService.getBackgroundPictures().subscribe(res =>{
      this.backgroundPictures = res;
    })
    if(localStorage.getItem('background')){
      let item = JSON.parse(localStorage.getItem('background'));
      this.currImage = item.name
    }
    else{
      this.currImage = this.backgroundPictures[0];
    }
    this.currUser = JSON.parse(localStorage.getItem('currUser'));
    if(this.currUser.userName === 'Rohit'){
      this.eventService.getAssigneeNames().subscribe((res:User[]) =>{
        let users = res.filter(x => x.isVerified === true);
        this.users = users.filter(x => x.userName !== this.currUser.userName)
        console.log(this.users);
      })
    }
    this.getSharedSchedules();
    this.getKanban();
    this.eventService.getAssigneeNames().subscribe((res: User[]) =>{
      res.forEach(user=>{
        if(user.isVerified === true){
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
    })
  }

  openBackground(){
    const dialogRef = this.dialog.open(BackgroundComponent, {
      disableClose: false,
      autoFocus: true,
      width: '30%',
      height: '400px',
    });
    dialogRef.afterClosed().subscribe(res=>{
      if(res === 'deleted'){
        this.showNotification(
          'snackbar-danger',
          'Background Deleted Successfully...!!!',
          'bottom',
          'center'
        );
      }
      else if(res === 'added'){
        this.showNotification(
          'snackbar-success',
          'Background Added Successfully...!!!',
          'bottom',
          'center'
        );
      }
    })
  }

  changeBackground(event){
    this.currImage = event.name;
    console.log(event);
    localStorage.setItem('background', JSON.stringify(event));
  }

  drop(event: CdkDragDrop<any[]>) {

  console.log("Dropped item: ", event.item.data);
    if (event.previousContainer === event.container) {
      console.log(event);
      let array;

      let index = event.container.data[0].statusId;
      array = this.kanban[index-1];

      let i = event.previousIndex
      let j = event.currentIndex;
      let k = j - i;

      array[event.previousIndex].index = event.currentIndex;

      if(k > 0){
        let items = k;
        for(let i = 0; i < items; i++){
          array[event.currentIndex - i].index = event.currentIndex - (1+i);
        }
        console.log(array);
      }
      else if(k < 0){
        let items = -k;
        for(let i = 0; i < items; i++){
          array[event.currentIndex + i].index = event.currentIndex + (1+i);
        }
        console.log(array);
      }
      console.log(array);
      array.forEach(data => {
        let id = data._id;
        let body = { statusId: data.statusId, index: data.index };
        console.log(body, id);
        this.tasksService.updateKanbanEvents(body, id).subscribe(res=> this.getKanban());
      })
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
    else {
      let arrayFrom;
      let arrayTo;
      let i, j;

      console.log(event);

      let index1 = event.previousContainer.data[0].statusId;
      arrayFrom = this.kanban[index1-1];
      i = index1-1;

      let index2;
      if(event.container.data.length !== 0){
        index2 = event.container.data[0].statusId;
        arrayTo = this.kanban[index2-1];
        j = index2-1;
      }
      else {
        this.kanban.forEach(array => {
          if(array.length === 0){
            for(let i=0; i<this.kanban.length; i++){
              if(event.container.id === `cdk-drop-list-${i}`){
                console.log(i);
                arrayTo = this.kanban[i];
                j = i;
              }
            }
           index2 = this.kanban.findIndex(this.findIndex);
           arrayTo = this.kanban[index2];
          }
        })
      }

      arrayFrom[event.previousIndex].statusId = j + 1;
      arrayFrom[event.previousIndex].index = event.currentIndex;

      for(let i = 0; i < arrayTo.length; i++){
        if(arrayTo[i].index >= event.currentIndex){
          arrayTo[i].index = arrayTo[i].index + 1;
        }
      }

      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);

      for(let i = 0; i < arrayFrom.length; i++){
        if(i >= event.previousIndex){
          arrayFrom[i].index = i;
        }
      }
      console.log(arrayTo);
      console.log(arrayFrom);
      console.log(event.previousIndex);
      console.log(event.currentIndex);

      arrayTo.forEach(data => {
        let id = data._id;
        let date = new Date().toISOString();
        let progressDate;
        if(data.index === event.currentIndex){
          if(event.previousIndex === 0){
            console.log(data);
            progressDate = new Date().toISOString();
            let body = { statusId: data.statusId, index: data.index, modifiedDate: date, closingDate: null, progressDate: progressDate };
            if(data.statusId === 4){
              body = { statusId: data.statusId, index: data.index, modifiedDate: date, closingDate: date, progressDate: progressDate };
            }
            console.log(body, id);
            this.tasksService.updateKanbanEvents(body, id).subscribe();
          }
          else{
            console.log(data);
            let body = { statusId: data.statusId, index: data.index, modifiedDate: date, closingDate: null };
            if(data.statusId === 4){
              body = { statusId: data.statusId, index: data.index, modifiedDate: date, closingDate: date };
            }
            console.log(body, id);
            this.tasksService.updateKanbanEvents(body, id).subscribe();
          }
        }
        else{
          console.log(data);
          let id = data._id;
          let body = { statusId: data.statusId, index: data.index };
          console.log(body, id);
          this.tasksService.updateKanbanEvents(body, id).subscribe();
        }
      });
      arrayFrom.forEach(data => {
        let id = data._id;
        let body = { statusId: data.statusId, index: data.index };
        console.log(body, id);
        this.tasksService.updateKanbanEvents(body, id).subscribe(res=> {
          this.getKanban();
        });
      });
    }
  }

  toggleRemove(){
    this.removeKanbanToggle = !this.removeKanbanToggle
  }

  removeKanban(lane){
    let statusID = lane.statusId;
    console.log(statusID);
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: {
        row: lane,
        action: 'deleteKanban'
      },
      disableClose: false,
      autoFocus: true,
      width: '30%',
      height: '200px',
    });
    dialogRef.afterClosed().subscribe(res=>{
      if(res === 'kanban'){
        this.refresh();
        this.removeKanbanToggle = false;
      }
    })
  }

  addNew(){
    const dialogRef = this.dialog.open(FormComponent, {
      disableClose: false,
      autoFocus: true,
      width: '35%',
      height: '475px',
      data: {
        action: 'new'
      }
    });
    dialogRef.afterClosed().subscribe(data =>
      {
        if(data === "added"){
          this.refresh();
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['./'], {
            relativeTo: this.route
          })
          this.showNotification(
            'snackbar-success',
            'Add Record Successfully...!!!',
            'bottom',
            'center'
          );
        }
      }
    )
  }

  refresh(){
    this.category = [];
    this.kanban = [];
    this.getKanban();
  }

  viewUserKanban(user){
    console.log(user);
    this.userCategory = []
    let min;
    let max = 0;
    this.tasksService.getKanbanData().subscribe(item => {
      console.log(item);
      item.forEach(res=>{
        if(res.name === user.userName){
          console.log(res);
          this.userCategory = res.kanbanFields
          res.kanbanFields.forEach(element => {
            min = element.statusId;
            if(min > max){
              max = min;
            }
          })
          console.log(max);
          console.log(this.userCategory);
          this.showUserKanbanToggle = true;
        }
      })
      this.tasksService.getKanbanEvents().subscribe(data => {
        this.userKanban = [];
        let events: kanbanEvents[] = data.filter(x => x.name === user.userName);
        events = events.filter(x => x.closingDate === null);
        if(events.length !== 0){
          for(let i = 1; i <= max; i++){
            let array = [];
            events.forEach(element => {
              if(element.statusId === i){
                array.push(element);
              }
            })
            this.userKanban.push(array);
            for(let i = 0; i < this.userKanban.length; i++){
              this.userKanban[i].sort((a,b) => a.index - b.index)
            }
            console.log(this.userKanban);
          }
        }
      })
    })
  }

  editData(data){
    console.log(data);
    const dialogRef = this.dialog.open(FormComponent, {
      disableClose: false,
      autoFocus: true,
      width: '35%',
      height: '450px',
      data: {
        action: 'edit',
        task: data
      }
    });
    dialogRef.afterClosed().subscribe(res=>{
      if(res === 'edit'){
        this.refresh();
          this.tasksService.kanbanForm.reset();
          this.showNotification(
            'black',
            'Edit Record Successfully...!!!',
            'bottom',
            'center'
          );
      }
      if(res === "task"){
        this.refresh();
        this.tasksService.tasksForm.reset();
      }
    })
  }

  viewData(data){
    console.log(data);
    const dialogRef = this.dialog.open(FormComponent, {
      disableClose: false,
      autoFocus: true,
      width: '40%',
      height: '490px',
      data: {
        action: 'view',
        task: data
      }
    });
    dialogRef.afterClosed().subscribe(res=>{
      if(res === 'closed'){
        this.refresh();
        this.showNotification(
          'snackbar-success',
          'Ticket Closed!',
          'bottom',
          'center'
        );
      }
    })
  }

  addNewKanban(){
    const dialogRef = this.dialog.open(FormComponent, {
      disableClose: false,
      autoFocus: true,
      width: '30%',
      height: '230px',
      data: {
        action: 'newKanban'
      }
    });
    dialogRef.afterClosed().subscribe(data =>
      {
        if(data === "added"){
          this.refresh();
          this.tasksService.kanbanForm.reset();
          this.showNotification(
            'snackbar-success',
            'Add Kanban Successfully...!!!',
            'bottom',
            'center'
          );
        }
      }
    )
  }

  findIndex(array){
    return array.length === 0;
  }

  getSharedSchedules(){
    this.tasksService.getKanbanData().subscribe(res=>{
      res.forEach(ele=>{
        if(ele.name === this.currUser.userName){
          this.sharedKanban = ele.sharedKanban;
          this.totalNotifications = this.sharedKanban.length
          console.log(this.sharedKanban);
        }
      })
    })
  }

  viewSharedKanban(kanban){
    console.log(kanban);
    const dialogRef = this.dialog.open(ViewKanbanComponent, {
      disableClose: false,
      autoFocus: true,
      width: '70%',
      height: '550px',
      data: {
        sharedUserId: kanban.statusId,
        sharedUserName: kanban.statusName,
        userId: kanban.userId
      }
    });
    dialogRef.afterClosed().subscribe(res=>{
      if(res === 'deleted'){
        this.showNotification(
          'snackbar-danger',
          'Shared Kanban Deleted Successfully!',
          'bottom',
          'center'
        );
        this.getSharedSchedules();
      }
    })
  }

  shareKanban(data){
    this.tasksService.getKanbanData().subscribe(res=>{
      res.forEach(ele=>{
        if(ele.name === data.userName){
          data.userId = ele._id;
          data.tid = ele._id;
        }
        if(ele.name === this.currUser.userName){
          data.statusId = ele._id;
          data.statusName = ele.name
        }
      })
      console.log(data);
      this.tasksService.addSharedKanban(data).subscribe(res=>{
        this.showNotification(
          'snackbar-success',
          'Kanban Shared Successfully...!!!',
          'bottom',
          'center'
        );
      })

    })
  }

  getKanban(){
    let min;
    let max = 0;
    this.tasksService.getKanbanData().subscribe(item => {
      console.log(item);
      let user = JSON.parse(localStorage.getItem('currUser'));
      item.forEach(res=>{
        if(res.name === user.userName){
          console.log(res);
          this.category = res.kanbanFields
          res.kanbanFields.forEach(element => {
            min = element.statusId;
            if(min > max){
              max = min;
            }
          })
          console.log(max);
          console.log(this.category);
        }
      })
      this.tasksService.getKanbanEvents().subscribe(data => {
        this.kanban = [];
        let events: kanbanEvents[] = data.filter(x => x.name === user.userName);
        events = events.filter(x => x.closingDate === null);
        if(events.length !== 0){
          for(let i = 1; i <= max; i++){
            let array = [];
            events.forEach(element => {
              if(element.statusId === i){
                array.push(element);
              }
            })
            this.kanban.push(array);
            for(let i = 0; i < this.kanban.length; i++){
              this.kanban[i].sort((a,b) => a.index - b.index)
            }
            console.log("kanaban data",this.kanban);
          }
        }
      })
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
