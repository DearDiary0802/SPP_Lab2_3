import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {TaskStatus, ToDoTask} from "./common-types";
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class TodoTasksService {

  constructor(
    private http: HttpClient
  ) {
  }

  getAllTasks(): Observable<ToDoTask[]> {
    const url = "http://localhost:3000/tasks";
    return this.http.get<ToDoTask[]>(url, {withCredentials: true});
  }

  downloadTaskFile(id: number, filename: string): Observable<any> {
    const url = `http://localhost:3000/download/${id}/${filename}`;
    return this.http.get(url, {responseType: "blob", headers: {'Accept': 'application/json', 'Content-Type': 'multipart/form-data'}, withCredentials: true});
  }

  getFilteredTasks(filter: TaskStatus | null): Observable<ToDoTask[]> {
    const url = `http://localhost:3000/tasks/${filter}`;
    return this.http.get<ToDoTask[]>(url, {withCredentials: true});
  }

  addTask(name: string, description: string, deadline?: Date, file?: File): Observable<ToDoTask[]> {
    const formData = new FormData();
    if (name)
      formData.append("name", name);
    if (description)
      formData.append("description", description);
    if (deadline) {
      formData.append("deadline", deadline.toISOString());
    }
    if (file)
      formData.append("task-file", file);

    const formDataHeader = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'multipart/form-data',
      })
    };

    const url = `http://localhost:3000/tasks`;
    // @ts-ignore
    return this.http.post<ToDoTask[]>(url, formData, {headers: formDataHeader, withCredentials: true});
  }

  completeTask(id: number): Observable<ToDoTask[]> {
    const url = `http://localhost:3000/tasks/complete/${id}`;
    return this.http.put<ToDoTask[]>(url, {id: id}, {withCredentials: true});
  }

  deleteTask(id: number): Observable<ToDoTask[]> {
    const url = `http://localhost:3000/tasks/${id}`;
    return this.http.delete<ToDoTask[]>(url, {withCredentials: true});
  }

}
