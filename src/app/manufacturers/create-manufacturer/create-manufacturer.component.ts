import {Component, Inject, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReplaySubject, takeUntil} from "rxjs";
import {AlertService} from "../../_services";
import {Manufacturer} from "../../_models/manufacturer";
import {ManufacturersService} from "../../_services/manufacturers.service";

@Component({
  selector: 'app-create-manufacturer',
  templateUrl: './create-manufacturer.component.html',
  styleUrls: ['./create-manufacturer.component.scss']
})
export class CreateManufacturerComponent implements OnDestroy {
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  form: FormGroup;
  alertMessage: string;
  categories: string[];

  constructor(
    public dialogRef: MatDialogRef<CreateManufacturerComponent>,
    @Inject(MAT_DIALOG_DATA) data: string[],
    public service: ManufacturersService,
    private formBuilder: FormBuilder,
    private alertService: AlertService
  ) {
    this.form = this.formBuilder.group({
      name: [null, [Validators.required]]
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    if (this.form.valid) {
      const manufacturer : Manufacturer = this.form.value;
      this.service.createManufacturer(manufacturer)
        .pipe(takeUntil(this.destroy))
        .subscribe({
          next: () => {
            this.alertService.success("Manufacturer successfully created.", true, true);
            this.dialogRef.close();
          },
          error: error => {
            this.alertService.error(error.error.message, false, false, "error-dialog");
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }
}
