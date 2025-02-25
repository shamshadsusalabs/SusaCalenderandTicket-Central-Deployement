 import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { kanbanEvents } from 'src/app/_models/kanbanEvents.model';
import { TasksService } from 'src/app/_services/tasks.service';
import { DeleteComponent } from '../delete/delete.component';
import { SprintService } from 'src/app/_services/sprint.service';
import { ProjectService } from 'src/app/_services/project.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
  action;
  photo;
  createdBy = ["Company", "Third-Party"];
  priorities = ["Minimal", "Normal", "Moderate", "High", "Critical"] ;
  dialogTitle;
  tasksForm = this.tasksService.tasksForm;
  selectedSprintId:any;
  selectedProjectId:any;
  constructor(
    private snackbar: MatSnackBar,
    public dialogRef: MatDialogRef<FormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public tasksService: TasksService,
    private dialog: MatDialog,
    private sprintService:SprintService,
    private projectService:ProjectService
  ) {
    this.action = data.action;
    if(this.action === 'view'){
      this.dialogTitle = data.task.title;
      console.log(data);

    }
    if(this.action === 'new'){
      this.dialogTitle = "New Record"
      this.tasksService.tasksForm.reset();
    }
    if(this.action === 'edit'){
      this.dialogTitle = data.task.title;

      this.tasksService.tasksForm.get('projectOwner').setValue(data.task.projectOwner)

      this.tasksService.tasksForm.get('title').setValue(data.task.title)
      this.tasksService.tasksForm.get('index').setValue(data.task.index)
      this.tasksService.tasksForm.get('statusId').setValue(data.task.statusId)
      this.tasksService.tasksForm.get('description').setValue(data.task.description)
      this.tasksService.tasksForm.get('imageURL').setValue(data.task.imageURL)
      this.photo = data.task.imageURL;
      this.tasksService.tasksForm.get('name').setValue(data.task.name);
      this.tasksService.tasksForm.get('priority').setValue(data.task.priority);
      this.tasksService.tasksForm.get('creationDate').setValue(data.task.creationDate);
      this.tasksService.tasksForm.get('closingDate').setValue(data.task.closingDate);
      this.tasksService.tasksForm.get('modifiedDate').setValue(data.task.modifiedDate);
      this.tasksService.tasksForm.get('progressDate').setValue(data.task.progressDate);
    }
    console.log(tasksService.tasksForm);
   }

  ngOnInit(): void {
    this.getAllsprint();
    this.getAllproject();
  }
  sprints: any[] = [];
  onSprintSelect(event: any) {
     this.selectedSprintId = event.value; // Get the selected sprintId
    console.log('Selected Sprint ID:', this.selectedSprintId);

    // Perform any logic with the selected sprintId (e.g., send it to an API)

  }

  getAllsprint() {
    this.sprintService.getAllSprints().subscribe({
      next: (data) => {
        this.sprints = data;
        console.log("sprint data",this.sprints);
        // Logs the sprints data in reverse order as expected
      },
      error: (err) => {
        console.error('Error fetching sprints:', err); // Logs any errors that occur
      }
    });
  }
  projects: any[] = [];
  getAllproject(){
    this.projectService.getAllProjects().subscribe((data)=>{
      this.projects = data;
      console.log("project",data);
    })
  }
  selectedUsers: any[] = [];
  onprojectSelect(event: any): void {
    // Get the selected projectID from the event
    this.selectedProjectId = event.value; // This is the selected projectID

    console.log('Selected Project ID:', this.selectedProjectId);

    // Find the selected project using the projectID
    const selectedProject = this.projects.find(project => project.projectID === this.selectedProjectId);

    // If the project is found, get the selectedUsers array
    if (selectedProject) {
      this.selectedUsers = selectedProject.selectedUsers;  // Store the selected users in the selectedUsers array
      console.log('Selected Users:', this.selectedUsers);   // Log the selected users
    } else {
      console.log('Project not found');
    }

    // Now you can perform any additional logic with the selected users if necessary
  }


  onSubmit(data) {
    const currUser = JSON.parse(localStorage.getItem('currUser')); // Retrieve currUser from localStorage
    const userId = currUser._id;
    const userName = currUser.userName;

    if (this.action === 'newKanban') {
      console.log(data);
      let min;
      let max = 0;
      this.tasksService.getKanbanData().subscribe(item => {
        console.log(item);
        item.forEach(res => {
          if (res.name === userName) {
            console.log(res);
            res.kanbanFields.forEach(element => {
              min = element.statusId;
              if (min > max) {
                max = min;
              }
            });
            data.statusId = max + 1;

            this.tasksService.getKanbanData().subscribe(res => {
              res.forEach(ele => {
                if (ele.name === userName) {
                  let body = { tid: ele._id, statusId: data.statusId, statusName: data.statusName };
                  console.log(body);
                  this.tasksService.addKanbanFields(body).subscribe((res: any) => {
                    this.dialogRef.close('added');
                  });
                }
              });
            });
          }
        });
      });
    }

    if (this.action === 'edit') {
      console.log(data);
      this.tasksService.updateKanbanEvents(data, this.data.task._id).subscribe(data => {
        this.dialogRef.close("edit");
      });
    }

    if (this.action === 'new') {
      console.log(data);

      data.statusId = 1;
      let lastItem = [];
      this.tasksService.getKanbanEvents().subscribe(array => {
        array.forEach(element => {
          if (element.name === userName && element.statusId === 1) {
            lastItem.push(element.index);
          }
        });

        let maxItem = 0;
        for (let i = 0; i < lastItem.length; i++) {
          if (lastItem[i] > maxItem) {
            maxItem = lastItem[i];
          }
        }

        console.log(maxItem);
        data.index = maxItem + 1;
        data.name = userName;
        data.ticketowner = userId;
        data.selectedUsers=this.selectedUsers,
        data.creationDate = new Date().toISOString();
        console.log("data", data);

        this.tasksService.addKanbanEvents(data).subscribe((fields: any) => {
          console.log("ticket id", this.selectedSprintId);
          console.log("response data", fields);

          const ticketData = {
            ticketId: fields.ticketId,
            title: fields.title,
            tickethours: fields.tickethours,
            _id: fields._id
          };

          const resourcesData = {
            name: userName,
            _id: userId
          };
      console.log("resourcesData", resourcesData );
          this.sprintService.addTicketToSprint(this.selectedSprintId, ticketData ,resourcesData).subscribe(
            (response) => {
              console.log("Ticket added to sprint:", response.sprint);

              // Reset form and close dialog on success
              this.tasksService.tasksForm.reset();
              this.dialogRef.close("added");
            },
            (error) => {
              if (error.status === 500) {
                alert("You can only add tickets up to 48 hours. Please reduce the hours or choose a different ticket.");
              } else {
                console.error("Error adding ticket to sprint:", error);
              }
            }


          );

          this.tasksService.tasksForm.reset();
          this.dialogRef.close("added");
        });
      });
    }
  }


  closeTicket(data) {
    let date = new Date().toISOString();
    console.log(data);
    let body = { closingDate: date, index: null ,status:'Closed'};
    let closedStatusId = data.statusId;
    let closedIndex = data.index;
    console.log(closedStatusId, closedIndex);
    let user = JSON.parse(localStorage.getItem('currUser'));

    this.tasksService.getKanbanEvents().subscribe(datas => {
        let events: kanbanEvents[] = datas.filter(x => x.name === user.userName);
        events = events.filter(x => x.statusId === closedStatusId);
        console.log(events);

        if (events.length !== 0) {
            events.forEach(event => {
                if (event.index > closedIndex) {
                    let body = { index: event.index - 1 };
                    this.tasksService.updateKanbanEvents(body, event._id).subscribe(res => {
                        // Close dialog after updating events
                        this.dialogRef.close('closed');
                    });
                }
            });
        } else {
            this.dialogRef.close('closed');
        }

        // Update the current ticket status
        this.tasksService.updateKanbanEvents(body, data._id).subscribe(res => {
            // Refresh the page after updating
            window.location.reload();
        });
    });
}


  deleteRecord(){
    console.log(this.data.task);
    const dialogRef = this.dialog.open(DeleteComponent, {
      data: {
        row: this.data.task,
        action: 'deleteRecord'
      },
      disableClose: false,
      autoFocus: true,
      width: '30%',
      height: '250px',
    });
    dialogRef.afterClosed().subscribe(res=>{
      console.log(res);
      if(res === 'task'){
        this.dialogRef.close("task");
      }
    })
  }

  uploadImage(event){
    console.log(event.target.files[0]);
    this.tasksService.uploadImages(event.target.files[0]).subscribe(res=>{
      let photo: any = res;
      this.photo = photo.longUrl;
      console.log(this.photo);
      this.tasksService.tasksForm.get('imageURL').setValue(photo.longUrl);
    })
  }

  openImage(url){
    window.open(url);
  }


}
