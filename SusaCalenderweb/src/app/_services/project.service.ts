import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define the Project interface
export interface Project {
  _id?: string; // Optional, as it won't be available when creating a new project
  projectName: string;
  projectOwner: string;

projectID?:string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'https://susacalenderandticket-central-deployement-865099120788.asia-south1.run.app/api/Project'; // Base URL for the API

  constructor(private http: HttpClient) {}

  // Create a new project
  createProject(project: Project): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}/Createprojects`, project);
  }

  // Get all projects
  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/getAll`);
  }

  // Get a project by ID
  getProjectById(id: string): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.apiUrl}/projects/owner/${id}`);
  }

  // Update a project by ID
  updateProject(id: string, project: Project): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${id}`, project);
  }

  // Delete a project by ID
  deleteProject(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}
