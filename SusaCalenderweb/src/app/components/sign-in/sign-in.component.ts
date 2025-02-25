import { StandupsService } from './../../_services/standups.service';
import { User } from './../../_models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SignInService } from './../../_services/sign-in.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { TasksService } from 'src/app/_services/tasks.service';
import { ChatService } from 'src/app/_services/chat.service';
import { ProfileUser } from 'src/app/_models/Userprofile';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  togglePass: boolean = false;
  toggleSignIn: boolean = true;

  constructor(
    public signInService: SignInService,
    private socialAuthService: SocialAuthService,
    private router: Router,
    private snackbar: MatSnackBar,
    private taskService: TasksService,
    private standupService: StandupsService,
    private  chatService: ChatService
    ) { }

  ngOnInit(): void {
    if(localStorage.getItem('currUser')){
      this.router.navigateByUrl('/dashboard');
    }
  }

  onSignIn(user){
    console.log(user);
    let body = { email: user.userName }
    this.signInService.logIn(body).subscribe((res:User)=>{
      if(res.isVerified === true){
        this.signInService.signInForm.reset();
        localStorage.setItem('currUser', JSON.stringify(res));
        this.signInService.loggedIn.next(true);
        this.router.navigateByUrl('dashboard');
        this.showNotification(
          'snackbar-success',
          'Sign In Successfully...!!!',
          'bottom',
          'center'
        )
      }
      else{
        this.signInService.signInForm.reset();
        this.showNotification(
          'snackbar-danger',
          'Account is Not Yet Verified!',
          'bottom',
          'center'
        )
      }
    }, (err)=>{
      this.showNotification(
        'snackbar-danger',
        'Provided Credential is Invalid!',
        'bottom',
        'center'
      )
    })
    // this.signInService.signin(user.userName, user.password).subscribe(res=>{
    //   console.log(res);

    // }, (err)=>{
    //   console.log(err);
    //   this.signInService.signInForm.reset();
    //   this.showNotification(
    //     'snackbar-danger',
    //     'Provided Credentials is Invalid!',
    //     'bottom',
    //     'center'
    //   )
    // })
    // this.signInService.logIn(user).subscribe((res: User) =>{
    //   if(res.isVerified === true){
    //   }
    // }, (err) => {
    // })
  }

  onSignUp(user){
    console.log(user);
    this.signInService.signUp(user).subscribe((res:User) =>{
      console.log(res);
      this.signInService.signUpForm.reset();
      this.toggleSignIn = true;
      this.showNotification(
        'snackbar-success',
        'Sign Up Successfull!',
        'bottom',
        'center'
      )
      let standup = { name: res.userName, popupDate: "", tasks: [] };
      this.standupService.addStandups(standup).subscribe();
      let body = { name: res.userName, sharedKanban: [], sharedKanbanData: [], kanbanFields: [] }
      this.taskService.addKanbanData(body).subscribe((res)=>{},(err)=>console.log(err));
      this.signInService.signupFirebase(res.email, res.password).subscribe(User=>{
        console.log(User);
      })

      // const profile: ProfileUser = {

      //   email: res.email,
      //   displayName: res.userName,
      //   // or any other field
      // };

      // this.chatService.createUserProfile(profile).subscribe(() => {
      //   console.log('Profile created successfully');
      //   this.showNotification('snackbar-success', 'Sign Up Successful!', 'bottom', 'center');
      // });
    }, (err)=>{
      this.signInService.signUpForm.reset();
      this.showNotification(
        'snackbar-danger',
        'Provided Credentials is Invalid!',
        'bottom',
        'center'
      )
    })
  }

  async onGoogleSignIn(){
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(user=>{
       this.signInService.signInWithGoogle(user.idToken).subscribe(
        (res)=> {
          console.log(res);
          localStorage.setItem('originalUser', JSON.stringify(res));
          this.router.navigateByUrl('dashboard');
        },(err) => {
          console.log(err);
        }
      )
    });
  }

  togglePassVisibility(){
    this.togglePass = !this.togglePass;
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
