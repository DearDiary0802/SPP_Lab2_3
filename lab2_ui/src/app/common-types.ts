export interface ToDoTask {
  id: number;
  name: string | undefined;
  description: string | undefined;
  status: TaskStatus | undefined;
  file: File | undefined;
  deadline: Date | undefined;
}

export enum TaskStatus {
    DONE = "Done",
    IN_PROGRESS = "In progress",
    EXPIRED = "Expired"
}

export interface User {
  login: string;
  password: string;
}
