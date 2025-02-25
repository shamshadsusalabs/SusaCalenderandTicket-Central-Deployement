import { TasksService } from './../../../_services/tasks.service';
import { Component, OnInit } from '@angular/core';
import { background } from 'src/app/_models/background.model';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})
export class BackgroundComponent implements OnInit {
  backgrounds: background[] = [];
  currImage;
  previewImage;
  deleteBackgroundToggle: boolean = false;
  addBackgroundToggle: boolean = false;

  constructor(public tasksService: TasksService, public dialogRef: MatDialogRef<BackgroundComponent>) { }

  ngOnInit(): void {
    this.tasksService.getBackgroundPictures().subscribe(res=>{
      this.backgrounds = res;
    })
  }

  selectPhoto(photo){
    this.currImage = photo.name;
  }

  deleteBackground(){
    this.deleteBackgroundToggle = !this.deleteBackgroundToggle
  }

  removeBackground(background){
    console.log(background);
    let id = { id: background._id };
    this.tasksService.deleteBackground(id).subscribe(res=>{
      this.dialogRef.close('deleted');
    })
  }

  addBackground(){
    this.addBackgroundToggle = !this.addBackgroundToggle
  }

  addBack(data){
    console.log(data);
    this.tasksService.addBackground(data).subscribe(res=>{
      this.dialogRef.close('added');
    })
  }
}

