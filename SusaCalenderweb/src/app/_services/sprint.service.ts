// src/app/services/sprint.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface Ticket {
  ticketId: string;
  tickethours: number;
  title: string;
  _id: string;
}

export interface Sprint {
  sprintId: string;
  startDate: Date;
  endDate: Date;
  tickets: Ticket[];
  sprintOwnerId: string;
  totalHours?: number;
}

@Injectable({
  providedIn: 'root'
})
export class SprintService {
  private apiUrl = `http://localhost:3000/api/sprint`; // Adjust your API base URL here

  constructor(private http: HttpClient) {}


  updateSprints(sprintData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/updatesprintdata/${sprintData.sprintId}`, sprintData);
  }
  
  deleteTicket(sprintId: string, ticketId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${sprintId}/ticket/${ticketId}`);
  }


  postData(sprintId: string, eventId: string): Observable<any> {
    const payload = {
      sprintId,
      eventId
    };
    return this.http.post<any>(`${this.apiUrl}/pudatesprint`, payload);
  }

  addTicketToSprint(sprintId: string, ticketData: any, resourcesData: any): Observable<any> {
    const body = {
      ticketData,
      resourcesData
    };

    return this.http.post(`${this.apiUrl}/add-ticket/${sprintId}`, body);
  }

  getSprintsByOwner(sprintOwnerId: string): Observable<Sprint[]> {
    return this.http.get<Sprint[]>(`${this.apiUrl}/get?sprintOwnerId=${sprintOwnerId}`);
  }

  // CREATE: Add a new sprint
  createSprint(sprint: Sprint): Observable<Sprint> {
    return this.http.post<Sprint>(`${this.apiUrl}/add`, sprint);
  }

  // READ: Get all sprints
  getAllSprints(): Observable<Sprint[]> {
    return this.http.get<Sprint[]>(`${this.apiUrl}/getAll`);
  }

  // READ: Get a sprint by ID
  getSprintById(id: string): Observable<Sprint> {
    return this.http.get<Sprint>(`${this.apiUrl}/get/${id}`);
  }

  // UPDATE: Update a sprint by ID
  updateSprint(id: string, sprint: Sprint): Observable<Sprint> {
    return this.http.put<Sprint>(`${this.apiUrl}/update/${id}`, sprint);
  }

  // DELETE: Delete a sprint by ID
  deleteSprint(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove/${id}`);
  }


  getTicketsByIds(ticketIds: string[]): Observable<any[]> {
    return this.http.post<any[]>('http://localhost:3000/api/kanban/tickets/byIds', { ids: ticketIds });
  }
}
