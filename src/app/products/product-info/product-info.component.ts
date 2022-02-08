import {Component, OnDestroy, OnInit} from '@angular/core';
import {ReplaySubject, takeUntil} from 'rxjs';
import {ActivatedRoute, Router} from "@angular/router";
import { AlertService } from '../../_services';
import { ProductsService } from 'src/app/_services/products.service';
import { ManufacturersService } from 'src/app/_services/manufacturers.service';
import { Product } from 'src/app/_models/product';
import { Manufacturer } from 'src/app/_models/manufacturer';

@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.scss'],
})
export class ProductInfoComponent implements OnInit {

  productInfo: Product;
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  isNotFound: boolean = false;
  manufacturer: Manufacturer;

  constructor(private manufacturersService: ManufacturersService, private productService: ProductsService, private route: ActivatedRoute, private alertService: AlertService, private router: Router) {
  }

  ngOnInit(): void {
    const id: string | null = this.route.snapshot.paramMap.get('id');
    if (id && Number(id)) {
      this.getProductInfo(id);
    }
    else {
      this.router.navigateByUrl("/products");
    }
  }

  private getProductInfo(id: string) : void {
    this.productService.getProductById(id)
      .pipe(takeUntil(this.destroy))
      .subscribe(
        {next: response => {
          this.productInfo = response;
          this.getManufacturerInfo(this.productInfo.manufacturerId);
          },
          error: error => {
            this.displayError(error);
          }}
      )
  }

  private getManufacturerInfo(id: string) : void {
    this.manufacturersService.getManufacturerById(id)
      .pipe(takeUntil(this.destroy))
      .subscribe(
        {next: response => {
          this.manufacturer = response;
          },
          error: error => {
            this.displayError(error);
          }}
      )
  }
  
  displayError(error: any) : void {
    switch (error.status) {
      case 400:
        this.alertService.error("Something went wrong",true,true);
        break;
      case 404:
        this.isNotFound = true;
        break;
      default:
        this.alertService.error("There was an error on the server, please try again later.",true,true);
        break;
    }
    
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }

}
