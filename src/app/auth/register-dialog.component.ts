import { Component, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { NewRegistration } from '../admin/new-registrations';

@Component({
  selector: 'register-dialog',
  templateUrl: 'register-dialog.component.html',
  styleUrls: [ './register-dialog.component.css' ],
  encapsulation: ViewEncapsulation.None
})
export class RegisterDialog {
  constructor(public dialogRef: MatDialogRef<RegisterDialog>,
              @Inject(MAT_DIALOG_DATA) public data: NewRegistration) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
