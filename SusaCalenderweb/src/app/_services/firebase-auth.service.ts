import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';


import { Auth } from 'firebase/auth';
import { authState } from '@angular/fire/auth';
@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {


  constructor(private auth: AngularFireAuth) {
  }

  loginWithGoogle() {
    return this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  extractFireBaseUserInfo(user: firebase.User | null) {
    return {
      uid: user?.uid,
      displayName: user?.displayName,
      email: user?.email,
      photoUrl: user?.photoURL
    }
  }

  getFirebaseUserState() {
    return this.auth.authState;
  }




  logoutUser() {
    return this.auth.signOut();
  }

  registerWithEmailPassword(userInfo: { email: string, password: string }) {
    return this.auth.createUserWithEmailAndPassword(userInfo.email, userInfo.password);
  }

  loginWithEmailPassword(userInfo: { email: string, password: string }) {
    return this.auth.signInWithEmailAndPassword(userInfo.email, userInfo.password);
  }


}
