import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm !: FormGroup ;
constructor(private service : AuthService ,
  private router :Router) {}
  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email, Validators.minLength(6)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(3)])
    });
  }
  onSubmit() {
    if (this.loginForm.invalid) {
      return
    }
    this.service.login(this.loginForm.value).pipe(
      map(token=> this.router.navigate(['admin']))
    ).subscribe()
  }

login() {

/* this.service.login('ahmed22@gmail.com','123456789').subscribe(
  data => console.log('Success')

) */

  }
}
