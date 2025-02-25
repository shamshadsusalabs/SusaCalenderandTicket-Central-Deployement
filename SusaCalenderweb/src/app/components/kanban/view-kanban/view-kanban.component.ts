import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { kanbanEvents } from 'src/app/_models/kanbanEvents.model';
import { TasksService } from 'src/app/_services/tasks.service';

@Component({
  selector: 'app-view-kanban',
  templateUrl: './view-kanban.component.html',
  styleUrls: ['./view-kanban.component.scss']
})
export class ViewKanbanComponent implements OnInit {
  kanban = [];
  category = [];
  sharedKanban = [];

  constructor(
    public dialogRef: MatDialogRef<ViewKanbanComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private taskService: TasksService
  ) {
    console.log(data);
   }

  ngOnInit(): void {
    this.getKanban();
  }

  deleteKanban(){
    this.taskService.getKanbanData().subscribe(res=>{
      res.forEach(ele=>{
        if(ele._id === this.data.userId){
          const id = ele._id;
          ele.sharedKanban.forEach(shared=>{
            if(shared.statusId === this.data.sharedUserId){
              console.log(shared);
              let body = { sid: shared.sid, id: id }
              console.log(body);
              this.taskService.deleteSharedKanban(body).subscribe(res=>{
                this.dialogRef.close('deleted');
              })
            }
          })
        }
      })
    })
    
  }

  getKanban(){
    let min;
    let max = 0;
    this.taskService.getKanbanData().subscribe(item => {
      item.forEach(res=>{
        if(res._id === this.data.sharedUserId){
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
      this.taskService.getKanbanEvents().subscribe(data => {   
        this.kanban = []; 
        let events: kanbanEvents[] = data.filter(x => x.name === this.data.sharedUserName);
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
            console.log(this.kanban);
          }
        }
      })
    })
  }

}
