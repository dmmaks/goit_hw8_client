import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListPageComponent } from './product-list-page/product-list-page.component';
import {LayoutComponent} from "./layout/layout.component";
import {SharedModule} from "../shared/shared.module";
import {MatDialogModule} from "@angular/material/dialog";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { ProductRoutingModule } from './product-routing.module';
import { MatCardModule } from '@angular/material/card';
import { ProductInfoComponent } from './product-info/product-info.component';

@NgModule({
  declarations: [
    LayoutComponent,
    ProductListPageComponent,
    DeleteConfirmationComponent,
    CreateProductComponent,
    EditProductComponent,
    ProductInfoComponent
  ],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatCheckboxModule,
    SharedModule,
    ProductRoutingModule,
    MatDialogModule,
    MatCardModule
  ],
})
export class ProductModule { }
