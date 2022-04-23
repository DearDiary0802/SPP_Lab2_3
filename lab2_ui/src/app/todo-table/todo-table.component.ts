import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import {TodoTasksService} from "../todo-tasks.service";
import {TaskStatus, ToDoTask} from "../common-types";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort, Sort} from "@angular/material/sort";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-todo-table',
  templateUrl: './todo-table.component.html',
  styleUrls: ['./todo-table.component.css']
})
export class TodoTableComponent implements OnInit, AfterViewInit, OnChanges {

  // @ts-ignore
  @Input() data: ToDoTask[];
  @Output() onCompleteTask = new EventEmitter<number>();
  @Output() onDeleteTask = new EventEmitter<number>();
  @Output() onDownloadTask = new EventEmitter<{id: number; fileName: string}>();
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;

  TaskStatus = TaskStatus;
  displayedColumns = [
    "name",
    "description",
    "status",
    "deadline",
    "file",
    "settings"
  ];

  tasks = new MatTableDataSource<ToDoTask>();

  constructor(
    private todoTasksService: TodoTasksService,
    private _liveAnnouncer: LiveAnnouncer
  ) { }

  ngOnInit(): void {
    this.tasks.paginator = this.paginator;
    this.tasks.data = this.data;
  }

  ngAfterViewInit() {
    this.tasks.paginator = this.paginator;
    this.tasks.sortingDataAccessor = (item, property): string | number => {
      switch (property) {
        case 'deadline': // @ts-ignore
          return new Date(item.deadline).toISOString();
        default: // @ts-ignore
          return item[property];
      }
    };
    this.tasks.sort = this.sort;
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.tasks.data = this.data;
  }

  checkStatus(task: ToDoTask): boolean {
    return task.status !== TaskStatus.DONE;
  }

  deleteTask(id: number): void {
    this.onDeleteTask.emit(id);
  }

  completeTask(id: number): void {
    this.onCompleteTask.emit(id);
  }

  downloadFile(obj: {id: number; fileName: string}): void {
    this.onDownloadTask.emit(obj);
  }

}
