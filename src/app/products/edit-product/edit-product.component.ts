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
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnDestroy {
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  form: FormGroup;
  alertMessage: string;
  product: Product;
  manufacturers: Manufacturer[] = [];
  initialManufacturer: Manufacturer;
  @ViewChild('manufacturerInput') manufacturerInput: ElementRef<HTMLInputElement>;

  constructor(
    public dialogRef: MatDialogRef<EditProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
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
    this.product = this.data.product;
    this.manufacturersService.getManufacturerById(this.product.manufacturerId)
      .pipe(takeUntil(this.destroy))
      .subscribe(
        {next: response => {
            this.initialManufacturer = response;
          },
          error: error => {
            this.displayError(error);
          }}
      )
    this.getManufacturers("");
    this.form = this.formBuilder.group({
      id: [this.data.product.id],
      price: [this.data.product.price],
      manufacturerId: [this.data.product.manufacturerId],
      name: [this.data.product.name, [Validators.required, Validators.pattern('^([A-Z a-z 0-9]){1,35}$')]]
    });
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

  public editProduct(): void {
    if (this.form.valid) {
      const product : Product = this.form.value;
      this.productsService.editProduct(product)
        .pipe(takeUntil(this.destroy))
        .subscribe({
          next: () => {
            this.alertService.success("Product successfully updated.", true, true);
            this.dialogRef.close(product);
          },
          error: error => {
            switch(error.status){
              case 404:
                this.alertService.error(error.error.message, false, false, "error-dialog");
                break;
              default:
                this.alertService.error("unexpected error, try later", false, false, "error-dialog");
                break;
            }
            this.alertService.error(this.alertMessage);
          }});
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
