import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { use } from 'passport';

import { Observable, map } from 'rxjs';
export interface LoginForm {
  email: string;
  password: string;
}
export interface User {
  name : string ;
  username:string ;
  email : string ;
  password : string ;
  passwordConfirm : string ;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http : HttpClient) { }
  login(loginForm : LoginForm) {
   return this.http.post<any>('/api/users/login' , {email :loginForm.email ,password : loginForm.password}).pipe(
    map((token)=> {
      console.log(token.access_token.access_token);

      localStorage.setItem('blog-token' , token.access_token.access_token);
      return token
    })
   )
  }
  registre(user: User): Observable<User> { // Change the return type to Observable<User>
    return this.http.post<User>('/api/users/', user);
  }
}
