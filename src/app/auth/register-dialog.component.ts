import {Component} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material';


@Component({
  selector: 'register-dialog',
  templateUrl: 'register-dialog.component.html',
})
export class RegisterDialog {
  constructor(public dialogRef: MatDialogRef<RegisterDialog>) {}
}