import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Project, ProjectService } from 'src/app/_services/project.service';
import { SprintService } from 'src/app/_services/sprint.service';
import { TasksService, Ticket } from 'src/app/_services/tasks.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SignInService } from 'src/app/_services/sign-in.service';

@Component({
  selector: 'app-creat-sprint',
  templateUrl: './creat-sprint.component.html',
  styleUrls: ['./creat-sprint.component.scss']
})
export class CreatSprintComponent implements OnInit {
  successMessage: string | null = null;
  sprintForm: FormGroup;
  tickets: Ticket[] = [];
  ticketOwnerId: string | null = null;
  fetchedTickets: Ticket[] = [];
  totalHours: number = 0;
  projects: Project[] = [];
users:any=[];
  constructor(
    private fb: FormBuilder,
    private ticketService: TasksService,
    private sprintService: SprintService,
    private projectService: ProjectService,
    private snackBar: MatSnackBar,
    private signInService:SignInService,

  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getCurrentUser();
    this.getProjectsByUserId();
    this.getUser();

    // Subscribe to changes in selected tickets to calculate total hours
    this.sprintForm.get('tickets')?.valueChanges.subscribe(selectedTickets => {
      this.calculateTotalHours(selectedTickets);
    });
  }

  // Initialize the sprint form
  initializeForm(): void {
    this.sprintForm = this.fb.group({
      project: ['', Validators.required], // Select project from dropdown
      // sprintName: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', [Validators.required, this.dateValidator.bind(this)]],
      tickets: new FormControl([]) ,
    // Initialize tickets as an empty array
    });
  }

  // Fetch projects associated with the current user
  getProjectsByUserId(): void {
    const currUser = localStorage.getItem('currUser');
    const userId = currUser ? JSON.parse(currUser)._id : null;

    if (userId) {
      this.projectService.getProjectById(userId).subscribe(
        (data) => {
          this.projects = data;
          console.log('Projects:', data);
        },
        (error) => {
          console.error('Error fetching projects:', error);
        }
      );
    }
  }

  getUser(){
    this.signInService.getUsers().subscribe((data)=>{
   this.users = data;
   console.log(data);
    })
  }

  // Custom validator for the end date
  dateValidator(control: FormControl): { [key: string]: boolean } | null {
    const startDate = this.sprintForm?.get('startDate')?.value;
    const endDate = control.value;
    const today = new Date();

    if (endDate && new Date(endDate) < today) {
      return { endDatePast: true };
    }
    return startDate && endDate && new Date(startDate) > new Date(endDate) ? { endDateInvalid: true } : null;
  }

  // Calculate total hours based on selected tickets
  calculateTotalHours(selectedTicketIds: string[]): void {
    this.totalHours = selectedTicketIds?.reduce((acc, ticketId) => {
      const ticket = this.fetchedTickets.find(t => t.ticketId === ticketId);
      return ticket ? acc + ticket.tickethours : acc;
    }, 0);
  }

  // Submit the sprint form data
  onSubmit(): void {
    if (this.sprintForm.valid) {
        const currUser = localStorage.getItem('currUser');
        const userId = currUser ? JSON.parse(currUser)._id : null;
        const userName = currUser ? JSON.parse(currUser).userName:null;

        const selectedTicketIds = this.sprintForm.value.tickets;
        const selectedTickets = this.fetchedTickets.filter(ticket =>
            selectedTicketIds.includes(ticket.ticketId)
        );

        const resourcesData = {
          name: userName,
          id: userId
        };
        const sprintData = {
            ...this.sprintForm.value,
            sprintOwnerId: userId,

            resources: resourcesData,



            tickets: selectedTickets.map(ticket => ({
                _id: ticket._id,
                ticketId: ticket.ticketId,
                title: ticket.title,
                tickethours: ticket.tickethours
            }))
        };

 console.log(sprintData);
        this.sprintService.createSprint(sprintData).subscribe(
            (response) => {
                this.sprintForm.reset(); // Reset form
                this.totalHours = 0; // Reset total hours
                this.fetchedTickets = []; // Clear fetched tickets

                // Show success message in SnackBar
                this.snackBar.open('Sprint created successfully!', 'Close', {
                    duration: 3000,
                    panelClass: ['snackbar-success'], // Add custom class
                    horizontalPosition: 'center', // Position horizontally
                    verticalPosition: 'top', // Position vertically
                });

                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            },
            (error) => {
                console.error('Error creating sprint:', error);
                this.snackBar.open('Failed to create sprint. Please try again.', 'Close', {
                    duration: 3000,
                    panelClass: ['snackbar-error'], // Optionally customize error snack bar
                    horizontalPosition: 'center',
                    verticalPosition: 'top',
                });
            }
        );
    } else {
        console.error('Form is not valid');
    }
}
private mapResourceIdsToNames(resourceIds: string[]): any[] {
  return resourceIds.map(id => {
    const user = this.users.find(user => user._id === id);
    return user ? { id: user._id, name: user.userName } : null;
  }).filter(user => user !== null);
}


  // Reset the sprint form and other related data


  // Get current user and fetch tickets for them
  getCurrentUser(): void {
    const currUser = localStorage.getItem('currUser');
    if (currUser) {
      const userObject = JSON.parse(currUser);
      this.ticketOwnerId = userObject._id;
      console.log('Current User Object:', userObject);
      this.getTickets();
    } else {
      console.error('No current user found in local storage');
    }
  }

  // Fetch tickets owned by the current user
  getTickets(): void {
    if (this.ticketOwnerId) {
      this.ticketService.getTicketsByOwner(this.ticketOwnerId).subscribe(
        (data) => {
          this.fetchedTickets = data;
          console.log('Fetched Tickets:', this.fetchedTickets);
        },
        (error) => {
          console.error('Error fetching tickets:', error);
        }
      );
    } else {
      console.error('No ticket owner ID found');
    }
  }
}
