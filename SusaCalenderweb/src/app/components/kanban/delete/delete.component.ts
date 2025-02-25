import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TasksService } from 'src/app/_services/tasks.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {
  action;
  currUser;

  constructor(
    public dialogRef: MatDialogRef<DeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackbar: MatSnackBar,
    private tasksService: TasksService,
  ) {
      this.action = data.action
      console.log(this.action);
      console.log(data);
   }

  ngOnInit(): void {
    this.currUser = JSON.parse(localStorage.getItem('currUser'));
  }

  deleteKanban(){
    console.log(this.data);
    this.tasksService.getKanbanData().subscribe(res=>{
      res.forEach(ele=>{
        if(ele.name === this.currUser.userName){
          let body = { id: ele._id, sid: this.data.row.sid };
          console.log(body);
          this.tasksService.deleteKanbanFields(body).subscribe(res=>{
            this.showNotification(
              'snackbar-danger',
              'Delete Kanban Successfully...!!!',
              'bottom',
              'center'
            );
            const currUser = JSON.parse(localStorage.getItem('currUser'));
            this.tasksService.getKanbanData().subscribe(kanban => {
            kanban.forEach(item => {
              if(item.name === currUser.userName){
                let bool = false;
                item.kanbanFields.forEach(field => {
                  if(field.statusId > this.data.row.statusId){
                    bool = true;
                    field.statusId = field.statusId - 1;
                    let body = { id: item._id, sid: field.sid, statusId: field.statusId }
                    this.tasksService.updateKanbanFieldStatusId(body).subscribe(res=>{
                      this.dialogRef.close("kanban");
                    });
                  }
                  else{
                    this.dialogRef.close('kanban');
                  }
                })
              }
            })
          })
        })
        }
      })
    })
  }

  deleteTask(){
    console.log(this.data.row);
    let body = { id: this.data.row._id }
    
    this.tasksService.deleteKanbanEvents(body).subscribe(data => {
        this.showNotification(
          'snackbar-danger',
          'Delete Record Successfully...!!!', 
          'bottom',
          'center'
      );
      this.tasksService.getKanbanEvents().subscribe(res=>{
        res.forEach(element => {
          if(element.name === this.currUser.userName){
            if(element.statusId === this.data.row.statusId){
              if(element.index > this.data.row.index){
                element.index = element.index - 1;
                let body = { index: element.index };
                this.tasksService.updateKanbanEvents(body, element._id).subscribe(res=>{
                  this.dialogRef.close('task');
                  this.showNotification(
                    'snackbar-success',
                    'All Records Updated!', 
                    'bottom',
                    'center'
                  );
                });
              }
            }
          }
          else{
            this.dialogRef.close('task');
          }
        })
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
