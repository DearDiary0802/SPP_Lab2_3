import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ToDoTask} from "../common-types";

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {

  @ViewChild('picker') picker: any;
  @Output() onTaskAdd = new EventEmitter<ToDoTask>();

  taskName: string = "";
  taskDescription: string = "";
  taskDeadline?: Date;
  taskFile: File | undefined;
  fileName: string = "";

  constructor(){ }

  ngOnInit(): void {
  }

  addTask(): void {
    this.taskDeadline = this.picker._validSelected;
    const task: ToDoTask = {
      id: -1,
      name: this.taskName,
      description: this.taskDescription,
      deadline: this.taskDeadline,
      file: this.taskFile,
      status: undefined
    };
    this.onTaskAdd.emit(task);
  }

  // @ts-ignore
  onFileSelected($event): void {
    const file: File = $event.target.files[0];
    if (file) {
      this.fileName = file.name;
      this.taskFile = file;
    }
  }

}
