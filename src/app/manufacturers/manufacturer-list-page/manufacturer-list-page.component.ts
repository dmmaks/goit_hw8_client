import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {PageEvent} from "@angular/material/paginator";
import {Observable, ReplaySubject} from "rxjs";
import {AlertService, AuthService, IngredientService} from "../../_services";
import {ManufacturersService} from "../../_services/manufacturers.service";
import {Page} from "../../_models/page";
import {map, startWith, takeUntil} from "rxjs/operators";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import { Manufacturer } from 'src/app/_models/manufacturer';
import { IngredientFilter } from 'src/app/_models/_filters/ingredient.filter';
import { DishIngredientFilter } from 'src/app/_models/_filters/dish-ingredient-filter';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { SearchDishParams } from 'src/app/_models/search-dish-params';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { Sort, SortDirection } from '@angular/material/sort';
import { CreateManufacturerComponent } from '../create-manufacturer/create-manufacturer.component';
import { EditManufacturerComponent } from '../edit-manufacturer/edit-manufacturer.component';


@Component({
  selector: 'app-manufacturer-list-page',
  templateUrl: './manufacturer-list-page.component.html',
  styleUrls: ['./manufacturer-list-page.component.scss']
})
export class ManufacturerListPageComponent {
  pageContent: Page<Manufacturer>;
  searchForm: FormGroup;
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  columnsToDisplay = ['id', 'name'];
  pageSize: number = 12;
  currentPage: number;
  alertMessage: string;
  ingredientControl = new FormControl();
  separatorKeysCodes: number[] = [ENTER, COMMA];
  userRole?: string;
  isWithActions: string;
  sortOrder: SortDirection = 'asc';
  @ViewChild('ingredientInput') ingredientInput: ElementRef<HTMLInputElement>;

  constructor(
    private manufacturerService: ManufacturersService,
    private alertService: AlertService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
  }
  

  ngOnInit(): void {
    this.searchForm = this.createFormGroup();
    this.getBySearch();
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
    const filter: SearchDishParams = this.searchForm.value;
    filter.order = this.sortOrder;
    this.manufacturerService.getManufacturersBySearch(this.searchForm.value, this.pageSize)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: (response: Page<Manufacturer>) => {
          this.pageContent = response;
          this.currentPage = 0;
        },
        error: (error: any) => {
          this.displayError(error);
        }
      });
  }

  getManufacturersPage(pageIndex: number, pageSize: number): void {
    this.manufacturerService.getManufacturersByPageNum(pageIndex, pageSize)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: (response: Page<Manufacturer>) => {
          this.pageContent = response;
          this.currentPage = pageIndex;
          this.pageSize = pageSize;
        },
        error: (error: any) => {
          this.displayError(error);
        }
      });
  }


  paginationHandler(pageEvent: PageEvent): void {
      this.getManufacturersPage(pageEvent.pageIndex, pageEvent.pageSize);
  }


  confirmDelete(id: string): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent);
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.manufacturerService.deleteManufacturer(id)
      .pipe(takeUntil(this.destroy))
      .subscribe({
        next: () => {
          this.alertService.success("Manufacturer deleted",true,true);
          this.getManufacturersPage(this.currentPage, this.pageSize);
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

  addManufacturer() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    this.dialog.open(CreateManufacturerComponent, dialogConfig);
  }

  editManufacturer(manufacturer: Manufacturer){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    let dataDialog = Object.assign({}, manufacturer);
    dialogConfig.data = {
      manufacturer: dataDialog
    };
    const dialogRef = this.dialog.open(EditManufacturerComponent, dialogConfig);
    dialogRef.afterClosed().pipe(takeUntil(this.destroy)).subscribe((data: Manufacturer) => {
      if(data){
        manufacturer.name = data.name;
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

