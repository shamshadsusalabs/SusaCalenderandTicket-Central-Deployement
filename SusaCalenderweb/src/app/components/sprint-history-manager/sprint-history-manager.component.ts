import { Component, OnInit, ViewChild } from '@angular/core';
import { Sprint, SprintService } from 'src/app/_services/sprint.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sprint-history-manager',
  templateUrl: './sprint-history-manager.component.html',
  styleUrls: ['./sprint-history-manager.component.scss']
})
export class SprintHistoryManagerComponent implements OnInit {



  displayedColumns: string[] = ['sprintName','Status', 'startDate', 'endDate', 'totalHours', 'tickets','resources'];
  dataSource = new MatTableDataSource<Sprint>();
  sprintOwnerId: string | null = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private sprintService: SprintService,private router: Router) {}

  ngOnInit(): void {
    this.loadSprintOwnerId();
    this.loadSprints();
  }

  loadSprintOwnerId(): void {
    const currUser = localStorage.getItem('currUser');
    if (currUser) {
      const user = JSON.parse(currUser);
      this.sprintOwnerId = user._id;
    }
  }

  loadSprints(): void {
    this.sprintService.getAllSprints().subscribe(
      (data: Sprint[]) => {
        this.dataSource.data = data;
        console.log('Fetched data:', data); // Log the fetched data
        this.dataSource.paginator = this.paginator;
      },
      error => {
        console.error('Error fetching sprints', error);
      }
    );
  }


  getTicketIds(sprint: any): void {
    const ticketIds = sprint.tickets.map((ticket: any) => ticket._id);
    this.router.navigate(['/show-ticket-with-sprint', { ids: JSON.stringify(ticketIds) }]);
  }


  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


}
