import { SignInService } from './../../_services/sign-in.service';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {
  username;
  isValidUser: boolean = false;
  user;
  pass = '';
  repass;
  email = "shivamsiddhapura3@gmail.com";
  showSuccessToggle: boolean = false;

  constructor(private signinService: SignInService, private snackbar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
  }

  verifyUsername(email){
    console.log(email);
    this.signinService.forgotpassword(email).subscribe((res)=>{
      console.log("working");
      this.showSuccessToggle = true;
      this.email = email;
      this.username = '';
      // this.signinService.getUsers().subscribe(res=>{
      //   res.forEach(user=>{
      //     if(user.email === email){
      //       this.user = user;
            
      //     }
      //   })
      //   if(this.user){
      //     this.isValidUser = true;
      //     console.log('Valid');
      //   }
      // })
    }, (err)=>{
      if(err){
        console.log("error");
        this.showNotification(
          'snackbar-danger',
          'Invalid Email!',
          'bottom',
          'center'
        )
        this.username = '';
      }
    })
    // this.signinService.getUsers().subscribe(res=>{
    //   res.forEach(user=>{
    //     if(user.userName === username){
    //       this.user = user;
    //     }
    //   })
    //   if(this.user){
    //     this.isValidUser = true;
    //     console.log('Valid');
    //   }
    //   else{
    //     this.showNotification(
    //       'snackbar-danger',
    //       'Invalid Username!',
    //       'bottom',
    //       'center'
    //     )
    //     this.username = '';
    //     console.log('Invalid');
    //   }
    // })
  }

  changePassword(password){
    console.log(password);
    let id = this.user._id;
    let body = { password: password };
    this.signinService.updatePassword(body, id).subscribe(res=>{
      console.log(res);
      this.showNotification(
        'snackbar-success',
        'Password Updated Successfully!',
        'bottom',
        'center'
      )
      this.router.navigateByUrl('/sign-in');
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
