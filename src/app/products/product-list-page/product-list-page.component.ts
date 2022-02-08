import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {PageEvent} from "@angular/material/paginator";
import {Observable, pipe, ReplaySubject} from "rxjs";
import {AlertService, AuthService} from "../../_services";
import {ProductsService} from "../../_services/products.service";
import {Page} from "../../_models/page";
import {map, startWith, takeUntil} from "rxjs/operators";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import { Product } from 'src/app/_models/product';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { Sort, SortDirection } from '@angular/material/sort';
import { Manufacturer } from 'src/app/_models/manufacturer';
import { ManufacturersService } from '../../_services/manufacturers.service';
import { SearchManufacturerParams } from 'src/app/_models/search-manufacturer-params';
import { SearchProductParams } from 'src/app/_models/search-product-params';
import { CreateProductComponent } from '../create-product/create-product.component';
import { EditProductComponent } from '../edit-product/edit-product.component';


@Component({
  selector: 'app-product-list-page',
  templateUrl: './product-list-page.component.html',
  styleUrls: ['./product-list-page.component.scss']
})
export class ProductListPageComponent {
  pageContent: Page<Product>;
  manufacturers: Manufacturer[] = [];
  selectedManufacturers: Manufacturer[] = [];
  selectedManufacturersIds: string[] = [];
  filteredManufacturers: Observable<Manufacturer[]>;
  searchForm: FormGroup;
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  columnsToDisplay = ['id', 'name', 'price'];
  pageSize: number = 12;
  currentPage: number;
  alertMessage: string;
  manufacturersControl = new FormControl();
  separatorKeysCodes: number[] = [ENTER, COMMA];
  isFilteredByStock: boolean;
  isFilteredByFavorite: boolean;
  userRole?: string;
  isWithActions: string;
  sortOrder: SortDirection = 'asc';
  @ViewChild('manufacturerInput') manufacturerInput: ElementRef<HTMLInputElement>;

  constructor(
    private manufacturersService: ManufacturersService,
    private productsService: ProductsService,
    private alertService: AlertService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
  }
  

  ngOnInit(): void {
    this.getManufacturers("");
    this.searchForm = this.createFormGroup();
    this.getBySearch();
    this.filteredManufacturers = this.manufacturersControl.valueChanges.pipe(
      startWith(null),
      map((manufacturer: string) => (manufacturer ? this.filterManufacturers(manufacturer) : this.manufacturers.slice())),
    );
    this.userRole = this.authService.accountValue?.role;
    if (this.userRole !== 'ROLE_USER') {
      this.columnsToDisplay.push('actions');
      this.isWithActions = 'with-actions';
    }
    else {
      this.isWithActions = 'without-actions';
    }
  }

  createFormGroup(): FormGroup {
    return this.formBuilder.group({
      name: ['']
    });
  }


  getBySearch(): void {
    const filter: SearchProductParams = this.searchForm.value;
    filter.order = this.sortOrder;
    filter.manufacturers = this.selectedManufacturersIds.toString();
    this.productsService.getProductsBySearch(this.searchForm.value, this.pageSize)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: (response: Page<Product>) => {
          this.pageContent = response;
          this.currentPage = 0;
        },
        error: (error: any) => {
          this.displayError(error);
        }
      });
  }

  getManufacturers(searchText: string) {
    this.manufacturers = [];
    const params: SearchManufacturerParams = {name: searchText, order: 'asc'};
    this.manufacturersService.getManufacturersBySearch(params, 10)
      .pipe(takeUntil(this.destroy))
      .subscribe(
        {next: response => {
          for (let manufacturer of response.content) {
            if(manufacturer.id !== undefined && !(this.selectedManufacturers.filter(i => i.id === manufacturer.id).length > 0)) {
              this.manufacturers.push({ name: manufacturer.name, id: manufacturer.id});
            }
          }
          },
          error: error => {
            this.displayError(error);
          }}
      )
  }

  getProductsPage(pageIndex: number, pageSize: number): void {
    this.productsService.getProductsByPageNum(pageIndex, pageSize)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: (response: Page<Product>) => {
          this.pageContent = response;
          this.currentPage = pageIndex;
          this.pageSize = pageSize;
        },
        error: (error: any) => {
          this.displayError(error);
        }
      });
  }

  filterManufacturers(value: string): Manufacturer[] {
    this.getManufacturers(String(value));

    return this.manufacturers;
  }

  paginationHandler(pageEvent: PageEvent): void {
      this.getProductsPage(pageEvent.pageIndex, pageEvent.pageSize);
  }

  removeManufacturerFromList(manufacturer: Manufacturer): void {
    const manufacturerIndex = this.selectedManufacturers.indexOf(manufacturer);
    const indexIdIndex = this.selectedManufacturersIds.indexOf(manufacturer.id);
    if (manufacturerIndex >= 0) {
      this.selectedManufacturers.splice(manufacturerIndex, 1);
    }
    if (indexIdIndex >= 0) {
      this.selectedManufacturersIds.splice(indexIdIndex, 1);
    }
  }

  onManufacturerSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectedManufacturers.push(event.option.value);
    this.selectedManufacturersIds.push(event.option.value.id);
    this.manufacturerInput.nativeElement.value = '';
    this.manufacturersControl.setValue(null);
  }

  confirmDelete(id: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent);
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.productsService.deleteProduct(id)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: () => {
          this.alertService.success("Product deleted",true,true);
          this.getProductsPage(this.currentPage, this.pageSize);
        },
        error: (error: any) => {
          this.displayError(error);
        }
      });
      }
    });
  }

  sortData(sortOrder: string) : void {
    sortOrder === 'desc' ? this.sortOrder = 'desc' : this.sortOrder = 'asc';
    this.getBySearch();
  }

  addProduct() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    this.dialog.open(CreateProductComponent, dialogConfig);
  }

  editProduct(product: Product){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    let dataDialog = Object.assign({}, product);
    dialogConfig.data = {
      product: dataDialog
    };
    const dialogRef = this.dialog.open(EditProductComponent, dialogConfig);
    dialogRef.afterClosed().pipe(takeUntil(this.destroy)).subscribe((data: Product) => {
      if(data){
        product.name = data.name;
      }
    })
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

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }
}

