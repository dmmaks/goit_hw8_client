import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DishRoutingModule} from "./manufacturer-routing.module";
import { ManufacturerListPageComponent } from './manufacturer-list-page/manufacturer-list-page.component';
import {LayoutComponent} from "./layout/layout.component";
import {SharedModule} from "../shared/shared.module";
import {MatDialogModule} from "@angular/material/dialog";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import { DeleteConfirmationComponent } from './delete-confirmation/delete-confirmation.component';



@NgModule({
  declarations: [
    LayoutComponent,
    ManufacturerListPageComponent,
    DeleteConfirmationComponent,
  ],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatCheckboxModule,
    SharedModule,
    DishRoutingModule,
    MatDialogModule
  ],
})
export class ManufacturerModule { }
