import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReplaySubject, takeUntil} from "rxjs";
import {AlertService} from "../../_services";
import {Manufacturer} from "../../_models/manufacturer";
import {ManufacturersService} from "../../_services/manufacturers.service";

@Component({
  selector: 'app-edit-manufacturer',
  templateUrl: './edit-manufacturer.component.html',
  styleUrls: ['./edit-manufacturer.component.scss']
})
export class EditManufacturerComponent implements OnInit, OnDestroy {
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  form: FormGroup;
  manufacturer: Manufacturer;
  alertMessage: string;
  categories: string[];

  constructor(
    public dialogRef: MatDialogRef<EditManufacturerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public service: ManufacturersService,
    private formBuilder: FormBuilder,
    private alertService: AlertService
  ) {
  }

  ngOnInit(): void {
    this.manufacturer = this.data.manufacturer;
    this.form = this.formBuilder.group({
      id: [this.data.manufacturer.id],
      name: [this.data.manufacturer.name, [Validators.required, Validators.pattern('^([A-Z a-z]){1,35}$')]]
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  public editManufacturer(): void {
    if (this.form.valid) {
      const manufacturer : Manufacturer = this.form.value;
      this.service.editManufacturer(manufacturer)
        .pipe(takeUntil(this.destroy))
        .subscribe({
          next: () => {
            this.alertService.success("Manufacturer successfully updated.", true, true);
            this.dialogRef.close(manufacturer);
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

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }
}
