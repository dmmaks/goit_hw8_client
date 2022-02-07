import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { UserListPageComponent } from './user-list-page/user-list-page.component';

import {SharedModule} from "../shared/shared.module";
import { CreateUserComponent } from './create-user/create-user.component';
import {MatDialogModule} from "@angular/material/dialog";
import {EditUserComponent} from "./edit-user/edit-user.component";


@NgModule({
  declarations: [
    LayoutComponent,
    UserListPageComponent,
    CreateUserComponent,
    EditUserComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatDialogModule,
    SharedModule
  ]
})
export class AdminModule { }
