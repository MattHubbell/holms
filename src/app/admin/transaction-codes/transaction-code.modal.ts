import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { MatDialogRef } from '@angular/material';
import { ConfirmResponses } from '../../shared/modal/confirm-btn-default';
import { Observable } from 'rxjs';

import { TransactionCode, TransactionCodeItemTypes } from './transaction-code.model';
import { TransactionCodeService } from './transaction-code.service';

@Component({
    selector: 'transaction-code-modal-content',
    templateUrl: './transaction-code.modal.html',
    styleUrls: [ './transaction-code.modal.css' ], 
    encapsulation: ViewEncapsulation.None
})
export class TransactionCodeModalContent implements OnInit {

    @Input() selectedItem: Observable<TransactionCode>;
    @Input() model: TransactionCode;
    @Input() isNewItem: Boolean;

    transactionCodeItemTypes: typeof TransactionCodeItemTypes = TransactionCodeItemTypes;
    tableName: string;

    constructor(
        private transactionCodeService: TransactionCodeService, 
        public snackBar: MatSnackBar, 
        public dialogRef: MatDialogRef<TransactionCode>
    ) {
    }

    ngOnInit() {
        this.tableName = TransactionCode.TableName();
    }

    onSubmit(isValid:boolean) {
        if(!isValid) {
            return;
        }
        if (this.isNewItem) {
            this.transactionCodeService.addItem(this.model);
            this.snackBar.open("Transaction Code added","", {
                duration: 2000,
            });          
        } else {
            this.transactionCodeService.updateItem(this.selectedItem, this.model);
            this.snackBar.open("Transaction Code updated","", {
                duration: 2000,
            });          
        }
        this.dialogRef.close();
    }

    onDelete($event:ConfirmResponses) {
        if ($event === ConfirmResponses.yes) {
            this.transactionCodeService.deleteItem(this.selectedItem);
            this.snackBar.open("Transaction Code deleted","", {
                duration: 2000,
            });          
            this.dialogRef.close();
        }
    }

    onClose($event:any) {
        this.dialogRef.close();
    }
}
