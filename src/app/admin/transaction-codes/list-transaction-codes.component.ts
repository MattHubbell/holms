import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { TitleService } from '../../title.service';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';

import { TransactionCode, TransactionCodeItemTypes } from './transaction-code.model';
import { TransactionCodeService } from './transaction-code.service';
import { TransactionCodeModalContent } from './transaction-code.modal';

@Component({
    templateUrl: './list-transaction-codes.component.html',
    styleUrls: [ './list-transaction-codes.component.css' ]
})

export class ListTransactionCodeComponent implements OnInit, OnDestroy{

    subscription: Subscription;
    dataSource: MatTableDataSource<TransactionCode> = new MatTableDataSource<TransactionCode>();
    displayedColumns = ['id', 'description', 'quantityRequired', 'isGiftItem', 'itemType', 'price'];
    dialogConfig: MatDialogConfig;
    modalRef: MatDialogRef<any,any>;
    transactionCodeItemTypes: typeof TransactionCodeItemTypes = TransactionCodeItemTypes;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private TransactionCodeService: TransactionCodeService, 
        private titleService: TitleService,
        private modalService: MatDialog
    ) {
        this.titleService.selector = 'list-transaction-codes';
    }

    ngOnInit() {
        this.TransactionCodeService.getList();
        this.subscription = this.TransactionCodeService.list.subscribe(list => {
            this.dataSource = new MatTableDataSource<TransactionCode>(list);
            this.dataSource.paginator = this.paginator;
        });
        this.dialogConfig = new MatDialogConfig();
        this.dialogConfig.disableClose = true;
        this.dialogConfig.autoFocus = true;
    }
    
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    
    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toUpperCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    addNew() {
        this.modalRef = this.modalService.open(TransactionCodeModalContent, this.dialogConfig);
        this.modalRef.componentInstance.isNewItem = true;
        this.modalRef.componentInstance.model = new TransactionCode();
    }

    edit(object:any) {        
        this.modalRef = this.modalService.open(TransactionCodeModalContent, this.dialogConfig);
        this.modalRef.componentInstance.isNewItem = false;
        this.modalRef.componentInstance.selectedItem = object;
        this.modalRef.componentInstance.model = TransactionCode.clone(object);
   }
}
