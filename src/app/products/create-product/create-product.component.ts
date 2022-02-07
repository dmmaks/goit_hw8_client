import {Component, ElementRef, Inject, OnDestroy, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReplaySubject, takeUntil} from "rxjs";
import {AlertService} from "../../_services";
import {Manufacturer} from "../../_models/manufacturer";
import {ManufacturersService} from "../../_services/manufacturers.service";
import { ProductsService } from 'src/app/_services/products.service';
import { Product } from 'src/app/_models/product';
import { SearchManufacturerParams } from 'src/app/_models/search-manufacturer-params';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent implements OnDestroy {
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  form: FormGroup;
  alertMessage: string;
  manufacturers: Manufacturer[] = [];
  @ViewChild('manufacturerInput') manufacturerInput: ElementRef<HTMLInputElement>;

  constructor(
    public dialogRef: MatDialogRef<CreateProductComponent>,
    @Inject(MAT_DIALOG_DATA) data: string[],
    public productsService: ProductsService,
    public manufacturersService: ManufacturersService,
    private formBuilder: FormBuilder,
    private alertService: AlertService
  ) {
    this.form = this.formBuilder.group({
      name: [null, [Validators.required]],
      price: [null, [Validators.required]],
      manufacturerId: [null, [Validators.required]]
    });
  }

  ngOnInit() {
    this.getManufacturers("");
  }

  private getManufacturers(searchText: string) : void {
    const params: SearchManufacturerParams = {name: searchText, order: "asc"};
    this.manufacturersService.getManufacturersBySearch(params, 10)
      .pipe(takeUntil(this.destroy))
      .subscribe(
        {next: response => {
          response.content.forEach( x => {
            this.manufacturers.push(x);
          })
          },
          error: error => {
            this.displayError(error);
          }}
      )
  }

  displayError(error: any) : void {
    switch (error.status) {
      case 400:
        this.alertMessage = "Something went wrong";
        break;
      case 404:
        this.alertMessage = error.error.message;
        break;
      default:
        this.alertMessage = "There was an error on the server, please try again later."
        break;
    }
    this.alertService.error(this.alertMessage,true,true);
  }

  close(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    if (this.form.valid) {
      const product : Product = this.form.value;
      this.productsService.createProduct(product)
        .pipe(takeUntil(this.destroy))
        .subscribe({
          next: () => {
            this.alertService.success("Product successfully created.", true, true);
            this.dialogRef.close();
          },
          error: error => {
            this.alertService.error(error.error.message, false, false, "error-dialog");
          }
        });
    }
  }

  public onManufacturerSearchChange(): void {
    this.manufacturers = [];
    this.getManufacturers(this.manufacturerInput.nativeElement.value);
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }
}
