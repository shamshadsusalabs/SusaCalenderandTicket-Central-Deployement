import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SprintService } from 'src/app/_services/sprint.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { TasksService } from 'src/app/_services/tasks.service';
import { kanbanEvents } from 'src/app/_models/kanbanEvents.model';

interface Comment {
  _id?: string;
  author: string;
  text: string;
  creationDate: string;
  replies: Array<{ author: string; text: string; creationDate: string, _id?: string; }>;
  ticketId: string;

}

@Component({
  selector: 'app-show-ticket-with-sprint',
  templateUrl: './show-ticket-with-sprint.component.html',
  styleUrls: ['./show-ticket-with-sprint.component.scss']
})
export class ShowTicketWithSprintComponent implements OnInit {



  comments: Comment[] = [];
  newCommentText: string = '';
  replyText: { [key: string]: string } = {}; // Correct initialization
  currentTicketId: string | undefined;

  constructor(private route: ActivatedRoute, private ticketService: SprintService, private dialog: MatDialog,private tskservice:TasksService) {}

  ngOnInit(): void {
    const ticketIds = JSON.parse(this.route.snapshot.paramMap.get('ids') || '[]');
    console.log(ticketIds);
    this.fetchTickets(ticketIds);
  }

  fetchTickets(ticketIds: string[]): void {
    this.ticketService.getTicketsByIds(ticketIds).subscribe(
      (res) => {

        this.kanbanEvents = res;
        console.log(this.kanbanEvents);
        this.dataSource = new MatTableDataSource(this.kanbanEvents);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => console.error('Error fetching tickets:', error)
    );
  }




  showUserKanbanToggle: boolean = false;
  kanban = [];
  userKanban = [];

  category = [];
  userCategory = [];
  currUser;
  kanbanEvents = [];
  dataSource: MatTableDataSource<kanbanEvents>;
  displayedColumns = ["srno", "ticektno", "title", "description", "name", "creationDate", "closingDate", "priority","tickethours","Action"]

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('commentTemplate') commentTemplate!: TemplateRef<any>;


  searchKey: string;







  getCurrentUser(){
    this.currUser = JSON.parse(localStorage.getItem('currUser'));
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





}
