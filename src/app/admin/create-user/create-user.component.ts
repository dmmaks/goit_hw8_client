import {Component, Inject, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {AdminService} from "../../_services/admin.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReplaySubject, takeUntil} from "rxjs";
import {AlertService} from "../../_services";
import {AccountInList} from "../../_models/account-in-list";

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnDestroy {
  destroy: ReplaySubject<any> = new ReplaySubject<any>();
  form: FormGroup;
  alertMessage: string;
  hide: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<CreateUserComponent>,
    public service: AdminService,
    private formBuilder: FormBuilder,
    private alertService: AlertService
  ) {
    this.form = this.formBuilder.group({
      firstName: [null, [Validators.required, Validators.pattern('^([A-Z a-z]){3,35}$')]],
      lastName: [null, [Validators.required, Validators.pattern('^([A-Z a-z]){3,35}$')]],
      birthDate: ['', Validators.required],
      email: ['', Validators.email],
      gender: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  public confirmAdd(): void {
    if (this.form.valid) {
      const account: AccountInList = this.form.value;
      this.service.addUser(account)
        .pipe(takeUntil(this.destroy))
        .subscribe({
          next: () => {
            this.alertService.success("User created.", true, true);
            this.dialogRef.close();
          },
          error: error => {
            switch(error.status){
              case 403:
                this.alertService.error(error.error.message, false, false, "error-dialog");
                break;
              case 409:
                this.alertService.error(error.error.message, false, false, "error-dialog");
                break;
              default:
                this.alertService.error("There was an error on the server, please try again later.", false, false, "error-dialog");
                break;
            }
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy.next(null);
    this.destroy.complete();
  }
}
