import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {User} from "../common-types";

@Component({
  selector: 'app-todo-authorization',
  templateUrl: './todo-authorization.component.html',
  styleUrls: ['./todo-authorization.component.css']
})
export class TodoAuthorizationComponent implements OnInit{

  @Output() onSignIn = new EventEmitter<User>();
  @Output() onSignUp = new EventEmitter<User>();

  signInLogin: string = "";
  signInPassword: string = "";
  signUpLogin: string = "";
  signUpPassword: string = "";

  constructor(
  ) { }

  ngOnInit(): void {
  }

  signIn(): void {
    console.log(this.signInLogin, this.signInPassword);
    let user: User = {
      login: this.signInLogin,
      password: this.signInPassword
    }
    this.onSignIn.emit(user);
  }

  signUp(): void {
    console.log(this.signUpLogin, this.signUpPassword);
    let user: User = {
      login: this.signUpLogin,
      password: this.signUpPassword
    }
    this.onSignUp.emit(user);
  }

}
