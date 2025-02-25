import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/_models/user.model';
import { SignInService } from './../../_services/sign-in.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: User[] = []
  currUser;

  constructor(private signinService: SignInService, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.getCurrUser();
    this.getUsers();
  }

  getCurrUser(){
    this.currUser = JSON.parse(localStorage.getItem('currUser'));
  }

  getUsers(){
    this.signinService.getUsers().subscribe(res=>{
      this.users = res.filter(x => x.userName !== this.currUser.userName);
    })
  }

  verifyUser(user){
    console.log(user);
    let body = { isVerified: true };
    this.signinService.verifyUser(body, user._id).subscribe((res: User) =>{
      this.getUsers();
      this.showNotification(
        'snackbar-success',
        'User Verified!',
        'bottom',
        'center'
      );
    })
  }

  deleteUser(user){
    let body = { id: user._id };
    this.signinService.removeUser(body).subscribe(res=>{
      this.getUsers();
      this.showNotification(
        'snackbar-danger',
        'User Removed!',
        'bottom',
        'center'
      );
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
