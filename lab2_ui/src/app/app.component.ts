import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {TodoTasksService} from "./todo-tasks.service";
import {ReplaySubject, takeUntil} from "rxjs";
import {TaskStatus, ToDoTask, User} from "./common-types";
import {saveAs} from 'file-saver';
import {TodoUsersService} from "./todo-users.service";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  destroy$: ReplaySubject<any> = new ReplaySubject<any>(1);
  tasks: ToDoTask[] = [];
  TaskStatus = TaskStatus;
  isAuthorized: boolean = false;

  constructor(
    private todoTasksService: TodoTasksService,
    private todoUsersService: TodoUsersService
  ) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  getAllTasks(): void {
    this.todoTasksService.getAllTasks()
      .pipe(takeUntil(this.destroy$))
      .subscribe((taskList: ToDoTask[]) => {
        if (taskList.length !== 0) {
          this.tasks = taskList;
        } else {
          const noResult = this.generateTaskForNoResult();
          this.tasks = [noResult];
        }
        console.dir(this.tasks);
      });
  }

  completeTask(id: number): void {
    this.todoTasksService.completeTask(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((taskList: ToDoTask[]) => {
        if (taskList.length !== 0) {
          this.tasks = taskList;
        } else {
          const noResult = this.generateTaskForNoResult();
          this.tasks = [noResult];
        }
      });
  }

  deleteTask(id: number): void {
    this.todoTasksService.deleteTask(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((taskList: ToDoTask[]) => {
        if (taskList.length !== 0) {
          this.tasks = taskList;
        } else {
          const noResult = this.generateTaskForNoResult();
          this.tasks = [noResult];
        }
      });
  }

  generateTaskForNoResult(): ToDoTask {
    const task: ToDoTask = {
      id: -1,
      name: "No tasks",
      description: "There is no tasks",
      status: undefined,
      deadline: undefined,
      file: undefined
    };
    return task;
  }

  // @ts-ignore
  addTask($event): void {
    this.todoTasksService.addTask($event.name, $event.description, $event.deadline, $event.file)
      .pipe(takeUntil(this.destroy$))
      .subscribe((taskList: ToDoTask[]) => {
        if (taskList.length !== 0) {
          this.tasks = taskList;
        } else {
          const noResult = this.generateTaskForNoResult();
          this.tasks = [noResult];
        }
      });
  }

  // @ts-ignore
  downloadFile($event): void {
    this.todoTasksService.downloadTaskFile($event.id, $event.fileName).pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        saveAs(data, $event.fileName);
      });

  }

  getFilteredTasks(status: TaskStatus): void {
    this.todoTasksService.getFilteredTasks(status)
      .pipe(takeUntil(this.destroy$))
      .subscribe((taskList: ToDoTask[]) => {
        if (taskList.length !== 0) {
          this.tasks = taskList;
        } else {
          const noResult = this.generateTaskForNoResult();
          this.tasks = [noResult];
        }
      });
  }

  signIn(user: User): void {
    this.todoUsersService.signIn(user)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.isAuthorized = true;
        this.ngOnInit();
        this.getAllTasks();
      });
  }

  signUp(user: User): void {
    this.todoUsersService.signUp(user)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.isAuthorized = true;
        this.ngOnInit();
        this.getAllTasks();
      });
  }
}
