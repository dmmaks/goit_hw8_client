import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LayoutComponent} from "./layout/layout.component";
import {ManufacturerListPageComponent} from "./manufacturer-list-page/manufacturer-list-page.component";


const routes: Routes = [{
  path: '', component: LayoutComponent,
  children:[
     {path:'', component: ManufacturerListPageComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DishRoutingModule { }
