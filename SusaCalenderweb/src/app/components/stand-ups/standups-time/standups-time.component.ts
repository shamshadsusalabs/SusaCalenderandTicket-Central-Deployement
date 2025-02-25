import { StandupsService } from './../../../_services/standups.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-standups-time',
  templateUrl: './standups-time.component.html',
  styleUrls: ['./standups-time.component.scss']
})
export class StandupsTimeComponent implements OnInit {

  popupForm: FormGroup = new FormGroup({
    popupDate: new FormControl('', Validators.required)
  })

  constructor(
    public dialogRef: MatDialogRef<StandupsTimeComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private standupService: StandupsService
  ) { 
    console.log(data);
  }

  ngOnInit(): void {
  }

  onSubmit(time){
    time.popupDate = String(time.popupDate);
    console.log(time, this.data._id);
    this.standupService.updatePopupdate(time, this.data._id).subscribe(res=>{
      this.dialogRef.close('Updated');
    })
    
  }

}
