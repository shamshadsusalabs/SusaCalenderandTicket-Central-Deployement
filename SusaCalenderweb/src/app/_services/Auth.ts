import { Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
CurrentUser$ = authState(this.auth);

  constructor(private auth: Auth) {
  }

}
