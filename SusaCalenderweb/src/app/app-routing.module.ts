import { UsersComponent } from './components/users/users.component';
import { StandUpsComponent } from './components/stand-ups/stand-ups.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KanbanComponent } from './components/kanban/kanban.component';
import { AuthGuard } from './_authguard/auth.guard';
import { KanbanHistoryComponent } from './components/kanban-history/kanban-history.component';
import { KanbanTableComponent } from './components/kanban-table/kanban-table.component';
import { ForgotpasswordComponent } from './components/forgotpassword/forgotpassword.component';
import { MessageComponent } from './mesage/message/message.component';
import { AllHistoryComponent } from './components/kanban-history/all-history/all-history.component';
import { CreatSprintComponent } from './components/creat-sprint/creat-sprint.component';
import { SprintHistoryComponent } from './components/sprint-history/sprint-history.component';
import { SprintHistoryManagerComponent } from './components/sprint-history-manager/sprint-history-manager.component';
import { BacklogsComponent } from './components/backlogs/backlogs.component';
import { ShowTicketWithSprintComponent } from './components/show-ticket-with-sprint/show-ticket-with-sprint.component';
import { UserAllHistoryComponent } from './components/kanban-history/user-all-history/user-all-history.component';
import { AdminKanbanComponent } from './components/admin-kanban/admin-kanban.component';
import { AllBacklogComponent } from './components/all-backlog/all-backlog.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'sign-in',
    pathMatch: 'full'
  },
  {
    path: 'sign-in',
    component: SignInComponent
  },
  {
    path: 'forgotpassword',
    component: ForgotpasswordComponent
  },
  {
    path: 'dashboard',
    component: CalendarComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'kanban',
    component: KanbanComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'kanban-history',
    component: KanbanHistoryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'Admin-kanban',
    component: AdminKanbanComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'All-history',
    component: AllHistoryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'user-All-history',
    component:  UserAllHistoryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'create-history',
    component: CreatSprintComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'sprint-history',
    component: SprintHistoryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'sprint-history-manager',
    component: SprintHistoryManagerComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'show-ticket-with-sprint',
    component: ShowTicketWithSprintComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'backlogs',
    component: BacklogsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'Allbacklogs',
    component: AllBacklogComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'kanban-table',
    component: KanbanTableComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'stand-ups',
    component: StandUpsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'messages',
    component: MessageComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
