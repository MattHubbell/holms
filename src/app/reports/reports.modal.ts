import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'report-options-dialog',
    templateUrl: './reports.modal.html',
    styleUrls: [ './reports.modal.css' ], 
    encapsulation: ViewEncapsulation.None
})
export class ReportOptionsDialog {

constructor(
    public dialogRef: MatDialogRef<ReportOptionsDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onNoClick(): void {
        this.dialogRef.close();
    }
}

export interface DialogData {
    useDateRange: boolean;
    startDate: Date;
    endDate: Date;
    useSelectedYear: boolean;
    selectedYear: Date;
    useTotalsOnly: boolean;
    isTotalsOnly: boolean;
}
  