import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BacklogService {
  private apiUrl = 'https://susacalenderandticket-central-deployement-865099120788.asia-south1.run.app/api/backlogs'; // Replace with your actual API base URL

  constructor(private http: HttpClient) {}

  // Get all backlog entries
  getAllBacklogs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/all`).pipe(
      catchError(this.handleError)
    );
  }

  // Get backlogs by ticketOwner (pass ownerId)
  getBacklogsByTicketOwner(ticketOwnerId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/ticketOwner/${ticketOwnerId}`);
  }

  // Handle any errors from HTTP requests
  private handleError(error: HttpErrorResponse) {
    console.error('Server Error:', error);
    return throwError('Something went wrong with the API request.');
  }
}
