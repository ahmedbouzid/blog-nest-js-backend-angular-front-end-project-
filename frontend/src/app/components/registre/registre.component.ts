import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { log } from 'console';
import { map } from 'rxjs';
import { AuthService, User } from '../../services/auth.service'; // Update the import path

@Component({
  selector: 'app-registre',
  templateUrl: './registre.component.html',
  styleUrls: ['./registre.component.scss']
})
export class RegistreComponent implements OnInit{

  registreForm !: FormGroup ;
  constructor (private service : AuthService ,
    private fb : FormBuilder ,
    private router : Router) {}
  ngOnInit(): void {

    this.registreForm = this.fb.group({
      name:[null , [Validators.required , ]],
      username : [null , [Validators.required]] ,
      email : [null , [Validators.required , Validators.email , Validators.minLength(6)]],
      password : [null , [Validators.required , Validators.minLength(3)]],
      passwordConfirm : [null , [Validators.required]]
    })
  }

  onSubmit() {
    if (this.registreForm.invalid) {
      return;
    }

    this.service.registre(this.registreForm.value).subscribe(
      (user: User) => {
        // Handle the registration response, e.g., navigate to login page
        console.log('Registration successful', user);
        this.router.navigate(['login']);
      },
      (error :any) => {
        // Handle registration error, if needed
        console.error('Registration error', error);
      }
    );
  }
}
