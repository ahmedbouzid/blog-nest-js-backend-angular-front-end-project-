import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
constructor(private service : AuthService) {}

login() {

this.service.login('ahmed22@gmail.com','123456789').subscribe(
  data => console.log('Success')

)

  }
}
