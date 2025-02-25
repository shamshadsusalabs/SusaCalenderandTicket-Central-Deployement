import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { kanbanEvents } from 'src/app/_models/kanbanEvents.model';
import { TasksService } from 'src/app/_services/tasks.service';
import { MatDialog } from '@angular/material/dialog';
import { CommentComponent } from '../kanban-table/comment/comment.component';
import { BacklogService } from 'src/app/_services/backlog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SprintService } from 'src/app/_services/sprint.service';
import { CommentdialogeComponent } from '../kanban-history/commentdialoge/commentdialoge.component';
interface Comment {
  _id?: string;
  author: string;
  text: string;
  creationDate: string;
  replies: Array<{ author: string; text: string; creationDate: string, _id?: string; }>;
  ticketId: string;

}
@Component({
  selector: 'app-backlogs',
  templateUrl: './backlogs.component.html',
  styleUrls: ['./backlogs.component.scss']
})
export class BacklogsComponent implements OnInit {
  
  sprintOwnerId: string | null = null;
 

  

 

 

  
  
showUserKanbanToggle: boolean = false;
kanban = [];
userKanban = [];

category = [];
userCategory = [];
currUser;
selectedKanbanEvent: any = null; // Holds the selected event data
statuses = ['To Do', 'In Progress', 'Completed'];
kanbanEvents = [];
dataSource: MatTableDataSource<kanbanEvents>;
displayedColumns = ["srno", "sprintId","projectId","ticektno", "title", "description", "name", "creationDate", "ModifiedDate", "closingDate", "priority","tickethours","Status","Action"]
selectedEvent: any;
// To store the selected event, including sprintId
selectedSprintDetails: any = null;
@ViewChild('editModal') editModal: TemplateRef<any>;
@ViewChild(MatPaginator) paginator: MatPaginator;
@ViewChild(MatSort) sort: MatSort;
@ViewChild('commentTemplate') commentTemplate!: TemplateRef<any>;

comments: Comment[] = [];
newCommentText: string = '';
replyText: { [key: string]: string } = {}; // Correct initialization
currentTicketId: string | undefined;
searchKey: string;

constructor(private tasksService: TasksService,private dialog: MatDialog,private tskservice:TasksService,
  private router: Router,
  private route: ActivatedRoute,
  private snackbar: MatSnackBar,
  private sprintService:SprintService,
  private backlogService: BacklogService


) { }

ngOnInit(): void {
  this.getCurrentUser();
  this.getKanbanEvents();
  this.  getAllsprint();
  this.  sprintChanges();
  this.loadSprintOwnerId(); // Load sprintOwnerId first
  this.getKanbanEvents(); 
}

sprints: any[] = [];
getAllsprint() {
  this.sprintService.getAllSprints().subscribe({
    next: (data) => {
      this.sprints = data;
      console.log("sprint data",this.sprints);
      // Logs the sprints data in reverse order as expected
    },
    error: (err) => {
      console.error('Error fetching sprints:', err); // Logs any errors that occur
    }
  });
}

sprintIdselected: any;

onSprintIdChange() {
  // Fetch the selected sprint based on sprintId
  const selectedSprint = this.sprints.find(sprint => sprint.sprintId === this.selectedEvent.sprintId);

  // Log only the sprintId
  if (selectedSprint) {
    this. sprintIdselected = selectedSprint.sprintId; // Assign only the sprintId
    console.log('Selected Sprint ID:', this. sprintIdselected);
  } else {
    console.log('Sprint not found for the selected sprintId');
  }
}






getCurrentUser(){
  this.currUser = JSON.parse(localStorage.getItem('currUser'));
}

loadSprintOwnerId(): void {
  const currUser = localStorage.getItem('currUser');
  if (currUser) {
    const user = JSON.parse(currUser);
    this.sprintOwnerId = user._id;
    console.log("Sprint Owner ID:", this.sprintOwnerId);
  }
}

getKanbanEvents(): void {
  if (!this.sprintOwnerId) {
    console.error('Sprint Owner ID is not set.');
    return;
  }

  this.kanbanEvents = [];
  this.backlogService.getBacklogsByTicketOwner(this.sprintOwnerId).subscribe(res => {
    console.log('API Response:', res);
    
    // Check if the response contains the 'kanbanData' array
    if (Array.isArray(res.kanbanData)) {
      this.kanbanEvents = res.kanbanData;  // Access the kanbanData array
      this.dataSource = new MatTableDataSource(this.kanbanEvents);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else {
      console.error('Expected an array for kanbanData, but got:', res.kanbanData);
    }
  }, error => {
    console.error('Error fetching Kanban events:', error);
  });
}


selectedEventId: string | undefined;

// Other properties and methods...
ticketsprintId:any;
openEditModal(event: any): void {
  this.selectedEvent = { ...event };

  this.selectedEventId = this.selectedEvent._id;

  this.ticketsprintId = this.selectedEvent.sprintId;
  console.log('Selected Event sprintId:', this.ticketsprintId);
  console.log('Selected Event _id:', this.selectedEventId);

  // Open the edit modal
  this.dialog.open(this.editModal);
}



closeDialog1(): void {
  this.dialog.closeAll();
}

onSaveChanges(): void {
  // Create a constant to hold all the data you want to log
  const updatedEvent = {
    _id: this.selectedEventId,  // Use the correct selected event ID
    sprintId: this.sprintIdselected ? this.sprintIdselected : this.selectedEvent.sprintId, // Choose sprintId based on condition
    projectOwner: this.selectedEvent.projectOwner,
    title: this.selectedEvent.title,   // Set project owner
    description: this.selectedEvent.description,  // Set description
   tickethours: this.selectedEvent.tickethours,  // Set ticket hours
  };

  // Log the entire object
  console.log('Updated Event Data:', updatedEvent);

  // Call the update method from the service with the updated event
  this.tasksService.updateKanbanEvent(updatedEvent).subscribe({
    next: (response) => {
      console.log('Updated Event Response:', response);
      this.snackbar.open('Event updated successfully!', 'Close', {
        duration: 3000,
      });
    },
    error: (err) => {
      console.error('Error updating event:', err);
      this.snackbar.open('Error updating event.', 'Close', {
        duration: 3000,
      });
    }
  });
}


sprintChanges() {
const ticketData = {
ticketId:this.selectedEventId,
title: this.selectedEvent?.title,
tickethours: this.selectedEvent?.tickethours,

  };
  console.log("dhgdf",ticketData);

}


// Toggles the editing state of the status field when user clicks on the status text
// Toggles the editing state of the status field when user clicks on the status text
toggleStatusEdit(element: any): void {
element.isEditingStatus = !element.isEditingStatus; // Toggle the state to show/hide the dropdown
}

// Handles the status change event when the user selects a new status
onStatusChange(event: any, element: any): void {
const newStatus = event.target.value;

// Check if the selected status is "Dependency"
if (newStatus === 'Dependency') {
  // Check if the comment exists and is a string before calling trim
  if (!element.comment || typeof element.comment !== 'string' || element.comment.trim() === '') {
    // Open the dialog to ask if the user has already commented
    const dialogRef = this.dialog.open(CommentdialogeComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // User clicked "Already Commented", proceed with the status change
        this.updateStatus(element, newStatus);
      } else {
        // User clicked "Cancel", don't proceed
        return;
      }
    });
  } else {
    // If a comment already exists, proceed with the status change
    this.updateStatus(element, newStatus);
  }
} else {
  // If it's not "Dependency", directly update the status
  this.updateStatus(element, newStatus);
}
}

updateStatus(element: any, newStatus: string): void {
// Update the status in the element
element.status = newStatus;
element.isEditingStatus = false; // Exit edit mode after selection

console.log('Selected status:', newStatus); // Log the selected status

// Call the service to update the status on the backend
this.tskservice.updateStatus(element._id, newStatus).subscribe(
  (response) => {
    console.log('Status updated successfully:', response);
    this.snackbar.open('Status updated successfully!', 'Close', {
      duration: 3000,
    });
  },
  (error) => {
    console.error('Error updating status:', error);
  }
);
}

onSearchClear(){
  this.searchKey = "";
  this.applyFilter();
}

applyFilter(){
  this.dataSource.filter = this.searchKey.trim().toLowerCase();
}


viewComment(ticket: any): void {
  console.log('Viewing ticket:', ticket);

  // Determine currentTicketId
  if (typeof ticket === 'string') {
      this.currentTicketId = ticket;
  } else if (ticket && ticket.ticketId) {
      this.currentTicketId = ticket.ticketId;
  } else {
      console.error('Invalid ticket format received:', ticket);
      return;
  }

  console.log('Current Ticket ID set to:', this.currentTicketId);

  // Extract the ticket data from the dataSource
  const ticketData = this.dataSource.data.find(t => t._id === this.currentTicketId);

  if (ticketData) {
      // Map comments and ensure _id is included, along with replies
      if (ticketData.comment && Array.isArray(ticketData.comment)) {
          this.comments = ticketData.comment.map((commentItem: any) => ({
              _id: commentItem._id, // Use _id from commentItem
              author: commentItem.userName, // Assuming commentItem.userName contains the author's name
              text: commentItem.comment, // Assuming commentItem.comment contains the text of the comment
              creationDate: commentItem.creationDate,
              replies: commentItem.replies.map((replyItem: any) => ({
                  _id: replyItem._id, // Unique ID for the reply
                  userId: replyItem.userId, // User ID of the reply author
                  author: replyItem.userName, // Name of the reply author
                  text: replyItem.reply, // The reply text
                  creationDate: replyItem.creationDate // Date of the reply
              })) || [], // Include replies if they exist, default to an empty array if not
              ticketId: this.currentTicketId // Make sure to include ticketId here
          }));
          console.log("Loaded comments:", this.comments);
      } else {
          this.comments = [];
          console.log("No comments found for this ticket.");
      }
  } else {
      console.error('Ticket data not found for ID:', this.currentTicketId);
  }

  // Open comments dialog
  this.dialog.open(this.commentTemplate, { data: { ticketId: this.currentTicketId, comments: this.comments } });
}



showCommentInput: boolean = false;

showCommentInputreply: boolean = false;

addComment(): void {
    // After adding the comment, reset input and hide it
    this.showCommentInput = true;
  const currUser = JSON.parse(localStorage.getItem('currUser') || '{}');
  const userName = currUser.userName || 'Guest';
  const userId = currUser._id;

  console.log('Current Ticket ID:', this.currentTicketId); // Log currentTicketId

  if (this.newCommentText.trim()) {
    const newComment: Comment = {
      _id: Date.now().toString(), // If you want to use server-generated IDs, you can remove this
      author: userName,
      text: this.newCommentText,
      creationDate: new Date().toISOString(),
      replies: [],
      ticketId: this.currentTicketId // Use currentTicketId set in viewComment
    };

    console.log('New Comment Added:', newComment);

    // Call the service to add the comment to the backend
    this.tskservice.addComment(this.currentTicketId, userId, userName, this.newCommentText, newComment.creationDate)
      .subscribe(
        (response) => {
          console.log('Comment successfully added to the server:', response);
          this.comments.push(newComment); // Add the comment locally only after successful response
          this.newCommentText = '';
          this.showCommentInput = false; // Reset the input field
        },
        (error) => {
          console.error('Error adding comment:', error);
        }
      );
  }
}
addReply(commentId: string): void {
  this.showCommentInputreply = true;
  const currUser = JSON.parse(localStorage.getItem('currUser') || '{}');
  const userName = currUser.userName || 'Guest';
  const userId = currUser._id;

  const replyText = this.replyText[commentId]?.trim();

  if (replyText && userId) {
      const comment = this.comments.find(c => c._id === commentId);

      if (comment) {
          // Create a new reply object with the correct structure
          const newReply = {
              author: userName,  // Use 'author' instead of 'userName'
              text: replyText,   // Use 'text' instead of 'reply'
              creationDate: new Date().toISOString(),
              userId: userId,    // Optionally keep userId if needed for future use
              ticketId: this.currentTicketId // Assuming ticketId is needed for the backend
          };

          // Call the RepliesService to add the reply
          this.tskservice.addReply(this.currentTicketId, userId, userName, commentId, replyText, newReply.creationDate).subscribe(
              (response) => {
                  console.log('Reply successfully added to the server:', response);
                  if (!comment.replies) {
                      comment.replies = []; // Initialize replies if not present
                  }
                  comment.replies.push(newReply); // Push the reply only after successful response
                  this.replyText[commentId] = ''; // Clear input
                  console.log(`New Reply Added to Comment ID: ${commentId}`, newReply);
                  console.log(`Updated Comment ID: ${commentId}`, comment);
                  this.showCommentInputreply = false;
              },
              (error) => {
                  console.error('Error adding reply:', error);
              }
          );
      } else {
          console.error('Comment not found for ID:', commentId);
      }
  } else {
      console.warn('Reply text is empty or user is not authenticated. Comment ID:', commentId);
  }
}


closeDialog(): void {
  this.dialog.closeAll();
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




