import { EventService } from './../../_services/event.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SignInService } from './../../_services/sign-in.service';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StandupsService } from 'src/app/_services/standups.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  loggedIn: boolean = false;
  currUser;
  share: boolean = false;
  showSchedules: boolean = false;
  totalNotifications: number;
  toggleMode: boolean = true;
  currRoute;
  shareKanban: boolean = false;
  standups: boolean = false;

  constructor(
    public signInService: SignInService,
    private router: Router,
    public eventService: EventService,
    private route: ActivatedRoute,
    public http : HttpClient,
    private standupService: StandupsService
    ) {

     

    this.signInService.loggedIn.subscribe(res=> {
      this.loggedIn = res;
      this.getCurrUserName();
      if(res === false){
        this.currUser = '';
      }
    })
    this.eventService.sharedScheduleLength.subscribe(res=> this.totalNotifications = res);
    this.eventService.share.subscribe(res=> this.share = res);
    this.eventService.showSchedule.subscribe(res=> this.showSchedules = res);
   }
  
  toggleShare(){
    this.share = !this.share;
    this.eventService.share.next(this.share);
  }

  toggleShowSchedules(){
    this.showSchedules = !this.showSchedules;
    this.eventService.showSchedule.next(this.showSchedules);
  }

  getCurrUserName(){
    if(localStorage.getItem('currUser')){
      let user = JSON.parse(localStorage.getItem('currUser'));
      this.currUser = user.userName;
    }
  }

  ngOnInit(): void {

  //   this.http.get('https://api.ipify.org/', {}).subscribe((result : any)=> {

  //   },
  // (err )=>{
  //   this.standupService.getid(err.error.text).subscribe(
  //     data=> {
  //       this.standupService.getdetails((data as any)[0].id).subscribe(
  //         data=>{
  //           localStorage.setItem('currUser', JSON.stringify(data));

            
  //         }
  //       )

  //     }
  //   )
  // })
   
  if(localStorage.getItem('currUser')){
    this.loggedIn = true;
  }
  this.getCurrUserName();
  this.getRoute();
  }

  getRoute(){
    this.router.events.subscribe((event)=>{
      if(event instanceof NavigationEnd){
        this.currRoute = (<NavigationEnd>event).url.split('/')[1];
        console.log(this.currRoute);
        if(this.currRoute === 'kanban'){
          this.toggleMode = false;
        }
        else{
          this.toggleMode = true;
        }
      }
    })
  }

  showSharedKanban(){}

  signOut(){
    this.currUser = ""
    this.signInService.logout().subscribe();
    localStorage.removeItem('currUser');
    this.signInService.loggedIn.next(false);
    this.getCurrUserName();
    this.router.navigateByUrl('/');
  }

}
