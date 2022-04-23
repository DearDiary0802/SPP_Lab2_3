import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "./common-types";
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class TodoUsersService {

  constructor(
    private http: HttpClient
  ) { }

  signIn(user: User): Observable<any> {
    const url = `http://localhost:3000/signIn`;
    return this.http.post<any>(url, user, {withCredentials: true});
  }

  signUp(user: User): Observable<any> {
    const url = `http://localhost:3000/signUp`;
    const headers = {
      "Accept": "application/json",
      "Content-Type": "application/json"
    };
    return this.http.post<any>(url, user, {headers: headers});
  }
}
