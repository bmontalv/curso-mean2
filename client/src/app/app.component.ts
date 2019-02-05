import { Component } from '@angular/core';
import * as $ from 'jquery';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  //styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Music WebApp';

  public user: User;
  public identity; //Loged user data
  public token;

  constructor() {
    this.user = new User('', '', '', '', '', 'ROLE_USER', ''); //Init the usuer
  }
}
