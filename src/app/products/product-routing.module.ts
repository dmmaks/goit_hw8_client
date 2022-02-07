import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LayoutComponent} from "./layout/layout.component";
import { ProductInfoComponent } from './product-info/product-info.component';
import {ProductListPageComponent} from "./product-list-page/product-list-page.component";


const routes: Routes = [{
  path: '', component: LayoutComponent,
  children:[
     {path:'', component: ProductListPageComponent},
     {path:':id', component: ProductInfoComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
