import { kanbanEvents } from './../_models/kanbanEvents.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Observable, throwError } from 'rxjs';
import { kanbanUrl, tasksUrl } from '../_config/api';
import { Kanban } from '../_models/kanban.model';
import { kanbanData } from '../_models/kanbanData.model';
import { Tasks } from '../_models/tasks.model';
import { catchError, take } from 'rxjs/operators';
import { background } from '../_models/background.model';
export interface Ticket {
  _id: string;
  name: string;
  statusId: number;
  index: number;
  title: string;
  description: string;
  priority: string;
  modifiedDate: string | null;
  closingDate: string | null;
  creationDate: string;
  progressDate: string | null;
  ticketId: string;
  projectOwner: string;
  projectName: string;
  tickethours: number;

  ticketowner: string;
  comment: any[]; // Adjust this type as needed
  projectID: string;
}

interface Reply {
  author: string;
  text: string;
  creationDate: string;
  userId: string;
  ticketId: string;
}
@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private http: HttpClient) { }

  kanbanForm: FormGroup = new FormGroup({
    id: new FormControl(null),
    statusId: new FormControl(null),
    statusName: new FormControl('', Validators.required)
  })

  backgroundAddFrom: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required)
  })

  tasksForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    name: new FormControl(''),
    imageURL: new FormControl(''),
    statusId: new FormControl(null),
    index: new FormControl(null),
    creationDate: new FormControl(''),
    closingDate: new FormControl(''),
    priority: new FormControl('', Validators.required),
    modifiedDate: new FormControl(''),
    progressDate: new FormControl(''),
    status: new FormControl('Open'),
    projectOwner: new FormControl(''),
    sprintId: new FormControl(''),
    projectId: new FormControl(''),
    selectedUsers:new FormControl(''),
    ticketowner: new FormControl(''),  // Assign user _id if available
    tickethours: new FormControl('')
  })
  private baseUrl = "http://localhost:3000/api/kanban";



  updateStatus(ticketId: string, newStatus: string): Observable<any> {
    const body = { status: newStatus };  // Status data to be updated
    return this.http.put(`${this.baseUrl}/update-status/${ticketId}`, body);
  }
  updateKanbanEvent(eventData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-event/${eventData._id}`, eventData);
  }

  getKanbanEventsByUser(userId: string) {
    return this.http.get<kanbanEvents[]>(`http://localhost:3000/api/kanban/events/user/${userId}`);
  }

  getTasks(): Observable<Tasks[]>{
    return this.http.get<Tasks[]>(tasksUrl);
  }

  updateTasks(data){
    return this.http.put(tasksUrl+'/'+data.id, data);
  }

  addTasks(data){
    return this.http.post(tasksUrl, data);
  }

  removeTask(data){
    return this.http.delete<Tasks[]>(tasksUrl+'/'+data.id);
  }

  getKanban(){
    return this.http.get<Kanban[]>("http://localhost:3000/api/kanban/getall");
  }

  getKanbanData(){
    return this.http.get<kanbanData[]>("http://localhost:3000/api/kanbandata/getall");
  }

  addKanbanData(data){
    return this.http.post<kanbanData>("http://localhost:3000/api/kanbandata/add", data);
  }

  getKanbanEvents(){
    return this.http.get<kanbanEvents[]>("http://localhost:3000/api/kanban/getall");
  }

  addKanbanEvents(data){
    return this.http.post("http://localhost:3000/api/kanban/add", data);
  }

  updateKanbanEvents(data, id){
    return this.http.post<kanbanEvents>(`http://localhost:3000/api/kanban/update?id=${id}`, data);
  }

  deleteKanbanEvents(data){
    return this.http.post("http://localhost:3000/api/kanban/remove", data);
  }

  addKanbanFields(data){
    return this.http.post("http://localhost:3000/api/kanbandata/addkanbanFields", data);
  }

  deleteKanbanFields(data){
    return this.http.post("http://localhost:3000/api/kanbandata/deletekanbanFields", data);
  }

  updateKanbanFieldStatusId(data){
    return this.http.post("http://localhost:3000/api/kanbandata/updatestatusIdkanbanFields", data);
  }

  addSharedKanban(data){
    return this.http.post("http://localhost:3000/api/kanbandata/addsharedKanban", data);
  }

  deleteSharedKanban(data){
    return this.http.post("http://localhost:3000/api/kanbandata/deletesharedKanban", data);
  }

  addKanban(data){
    return this.http.post(kanbanUrl, data);
  }

  removeKanban(data){
    return this.http.delete<Kanban[]>(kanbanUrl+'/'+data.id);
  }

  updateKanban(data){
    return this.http.put(kanbanUrl+'/'+data.id, data);
  }

  getBackgroundPictures(){
    return this.http.get<background[]>("http://localhost:3000/api/themes/getall");
  }

  deleteBackground(data){
    return this.http.post("http://localhost:3000/api/themes/remove", data);
  }

  addBackground(data){
    return this.http.post("http://localhost:3000/api/themes/add", data);
  }

  uploadImages(data): Observable<{}>{
    const formData = new FormData();
    formData.append("file", data);
    return this.http.post("http://localhost:3000/api/upload/addfiles", formData);
  }

  private apiUrl = 'http://localhost:3000/api/Kanban';
  getTicketsByOwner(ticketownerId: string): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}/detailsid/${ticketownerId}`).pipe(
        catchError(this.handleError) // Handle errors
    );
}

// Error handling method
private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
        // Client-side error
        console.error('An error occurred:', error.error.message);
    } else {
        // Server-side error
        console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    return throwError('Something went wrong; please try again later.');

}

addComment(ticketId: string, userId: string, userName: string, commentText: string, creationDate: string): Observable<any> {
  const commentData = {
    userId,
    userName,
    comment: commentText,
    creationDate
  };

  return this.http.post(`${this.apiUrl}/tickets/comment/${ticketId}`, commentData); // Removed headers
}

addReply(ticketId: string, userId: string, userName: string, commentId: string, replyText: string, creationDate: string): Observable<any> {
  const replyData = {
    userId,
    userName,
    reply: replyText,
    creationDate
  };

  const url = `${this.apiUrl}/tickets/${ticketId}/comment/${commentId}`;
  return this.http.post(url, replyData); // Removed headers property
}

}
