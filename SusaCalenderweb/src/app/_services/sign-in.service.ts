import { Auth } from '@angular/fire/auth';
import { User } from 'src/app/_models/user.model';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from } from 'rxjs';
import { createUserWithEmailAndPassword, deleteUser, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class SignInService {
  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient ,
    private fireauth: Auth
  ) { }

  signin(email: string, password: string){

    return from(signInWithEmailAndPassword(this.fireauth, email, password));
  }

  signupFirebase(email: string, password: string){
    return from(createUserWithEmailAndPassword(this.fireauth, email, password));
  }

  forgotpassword(email: string){
    return from(sendPasswordResetEmail(this.fireauth, email));
  }

  logout(){
    return from(this.fireauth.signOut());
  }

  signInForm: FormGroup = new FormGroup({
    userName: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  signUpForm: FormGroup = new FormGroup({
    userName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    isVerified: new FormControl(true)
  })


  logIn(cred){
    console.log(cred);
    return this.http.post("http://localhost:3000/api/user/login", cred);
  }

  signUp(cred){
    console.log(cred);
    return this.http.post("http://localhost:3000/api/user/signup", cred);
  }

  signInWithGoogle(idToken){
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=AIzaSyCm7AMjhPrNrfkFgB8611uw72RaftLTT5w`,
      {
        postBody:`id_token=${idToken}&providerId=google.com`,
        requestUri:'http://localhost:4200',
        returnIdpCredential:true,
        returnSecureToken:true
      }
    );
  }

  getUsers(){
    return this.http.get<User[]>("http://localhost:3000/api/user/getall");
  }

  verifyUser(data, id){
    return this.http.post(`http://localhost:3000/api/user/update?id=${id}`, data);
  }

  removeUser(data){
    return this.http.post("http://localhost:3000/api/user/remove", data);
  }

  updatePassword(data, id){
    return this.http.post(`http://localhost:3000/api/user/update?id=${id}`, data)
  }

  removeUserFirebase(email: User){
  }
}
