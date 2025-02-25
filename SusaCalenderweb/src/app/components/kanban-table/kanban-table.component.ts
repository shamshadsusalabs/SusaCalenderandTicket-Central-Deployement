import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { kanbanEvents } from 'src/app/_models/kanbanEvents.model';
import { TasksService } from 'src/app/_services/tasks.service';
import { CommentComponent } from './comment/comment.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-kanban-table',
  templateUrl: './kanban-table.component.html',
  styleUrls: ['./kanban-table.component.scss']
})
export class KanbanTableComponent implements OnInit {
  currUser;
  kanbanEvents = [];
  dataSource: MatTableDataSource<kanbanEvents>;
  displayedColumns = ["srno", "ticektno", "title", "description", "name", "creationDate", "closingDate", "priority","tickethours","Action"]

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  searchKey: string;

  constructor(private tasksService: TasksService,public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getCurrentUser();
    this.getKanbanEvents();
  }

  isCommentsVisible: { [ticketId: string]: boolean } = {};

  // Function to toggle comments visibility
  toggleComments(ticketId: string) {
    this.isCommentsVisible[ticketId] = !this.isCommentsVisible[ticketId];
  }

  getCurrentUser(){
    this.currUser = JSON.parse(localStorage.getItem('currUser'));
  }

  getKanbanEvents(){
    this.kanbanEvents = [];
    this.tasksService.getKanbanEvents().subscribe(res=>{
      this.kanbanEvents = res;
      console.log(this.kanbanEvents);
      this.dataSource = new MatTableDataSource(this.kanbanEvents);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }


  onSearchClear(){
    this.searchKey = "";
    this.applyFilter();
  }

  applyFilter(){
    this.dataSource.filter = this.searchKey.trim().toLowerCase();
  }


  openCommentModal(ticketId: string): void {
    const dialogRef = this.dialog.open(CommentComponent, {
      width: '400px',
      data: { ticketId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Call the API to add the comment to the ticket
        // this.tasksService.addComment(ticketId, result).subscribe(response => {
        //   console.log('Comment added:', response);
        //   this.getKanbanEvents();
        //   // Optionally, refresh the kanban events or handle the response
        // }, error => {
        //   console.error('Error adding comment:', error);
        // });
      }
    });
  }}

