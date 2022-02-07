import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LayoutComponent} from "./layout/layout.component";
import {ProductListPageComponent} from "./product-list-page/product-list-page.component";


const routes: Routes = [{
  path: '', component: LayoutComponent,
  children:[
     {path:'', component: ProductListPageComponent}
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DishRoutingModule { }
