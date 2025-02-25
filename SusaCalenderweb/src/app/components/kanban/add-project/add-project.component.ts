import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProjectService } from 'src/app/_services/project.service';
import { SignInService } from 'src/app/_services/sign-in.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent implements OnInit {
  addProjectForm: FormGroup;
  users: any[] = [];
  selectedUsers: string[] = []; // Stores selected user IDs
  projectOwner: string | null = null; 
  constructor(
    public dialogRef: MatDialogRef<AddProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private projectService: ProjectService,
    private signInService: SignInService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getAllUsers();
    const currUser = localStorage.getItem('currUser');
    if (currUser) {
      const user = JSON.parse(currUser);
      this.projectOwner = user._id; // Extract _id for projectOwner
    }
    // Initialize the form
    this.addProjectForm = this.fb.group({
      projectName: ['', Validators.required],
      selectedUsers: [[]] // Array to hold selected users
    });
  }

  getAllUsers(): void {
    this.signInService.getUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.addProjectForm.valid) {
      const projectData = {
        projectName: this.addProjectForm.value.projectName,
        projectOwner: this.projectOwner,
        selectedUsers: this.addProjectForm.value.selectedUsers
      };
console.log(projectData);
      this.projectService.createProject(projectData).subscribe((data) => {
        console.log(data);
      });

      this.dialogRef.close(projectData); // Close dialog and send project data
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onUserSelect(userId: string): void {
    const selectedUsers = this.addProjectForm.get('selectedUsers')?.value as string[];
    if (selectedUsers.includes(userId)) {
      this.addProjectForm.patchValue({
        selectedUsers: selectedUsers.filter(id => id !== userId)
      });
    } else {
      this.addProjectForm.patchValue({
        selectedUsers: [...selectedUsers, userId]
      });
    }
  }
}