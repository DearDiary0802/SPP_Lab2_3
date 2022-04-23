import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { TodoTableComponent } from './todo-table/todo-table.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTableModule} from "@angular/material/table";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSortModule} from "@angular/material/sort";
import { AddTaskComponent } from './add-task/add-task.component';
import {MatButtonModule} from "@angular/material/button";
import {HttpClientModule} from "@angular/common/http";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSelectModule} from "@angular/material/select";
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from "@angular-material-components/datetime-picker";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { TodoAuthorizationComponent } from './todo-authorization/todo-authorization.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatCardModule} from "@angular/material/card";

@NgModule({
  declarations: [
    AppComponent,
    TodoTableComponent,
    AddTaskComponent,
    TodoAuthorizationComponent
  ],
    imports: [
        BrowserModule,
        MatToolbarModule,
        MatIconModule,
        BrowserAnimationsModule,
        MatTableModule,
        MatInputModule,
        MatFormFieldModule,
        MatSortModule,
        MatButtonModule,
        HttpClientModule,
        MatPaginatorModule,
        MatSelectModule,
        NgxMatDatetimePickerModule,
        MatDatepickerModule,
        NgxMatNativeDateModule,
        ReactiveFormsModule,
        FormsModule,
        NgxMatTimepickerModule,
        MatProgressSpinnerModule,
        MatCardModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
