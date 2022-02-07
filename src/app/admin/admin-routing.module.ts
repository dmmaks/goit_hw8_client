import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../admin/layout/layout.component';
import {UserListPageComponent} from "./user-list-page/user-list-page.component";

const routes: Routes = [{
  path:'', component:LayoutComponent,
  children: [
    {path: '', component: UserListPageComponent}
  ]


}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
