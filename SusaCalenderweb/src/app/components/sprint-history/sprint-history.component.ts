import { Component, OnInit, ViewChild } from '@angular/core';
import { Sprint, SprintService } from 'src/app/_services/sprint.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sprint-history',
  templateUrl: './sprint-history.component.html',
  styleUrls: ['./sprint-history.component.scss']
})
export class SprintHistoryComponent implements OnInit {
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
    if (this.sprintOwnerId) {
      this.sprintService.getSprintsByOwner(this.sprintOwnerId).subscribe(
        (data: Sprint[]) => {
          this.dataSource.data = data;
          console.log(data);
          this.dataSource.paginator = this.paginator;
        },
        error => {
          console.error('Error fetching sprints', error);
        }
      );
    } else {
      console.error('Sprint owner ID is not available');
    }
  }

  selectedSprintId: string | null = null;
  getTicketIds(sprint: any): void {
    this.selectedSprintId = sprint.sprintId; // Store sprintId in variable
    console.log('Selected SprintId:', this.selectedSprintId); // Log sprintId
  
    // Extract ticket IDs
    const ticketIds = sprint.tickets.map((ticket: any) => ticket._id);
  
    // Navigate with sprintId and ticketIds
    this.router.navigate(['/show-ticket-with-sprint', { sprintId: this.selectedSprintId, ids: JSON.stringify(ticketIds) }]);
  }
  
  


  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
