import { Component, ViewChild, Input, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { CashDetailHistory } from '../transaction-history/cash-detail-history.model';
import { TransactionCode } from '../transaction-codes/transaction-code.model';

import * as wjcCore from 'wijmo/wijmo';
import { environment } from '../../../environments/environment';
import { CashMaster } from '../cash-entry';
import { Member } from 'src/app/members';

@Component({
    templateUrl: './invoice.modal.html',
    styleUrls: [ './invoice.modal.css' ]
})

export class InvoiceModalContent implements AfterViewInit {

    zoomLevels: wjcCore.CollectionView;
    @Input() member: Member;
    @Input() cashMaster: CashMaster;
    @Input() cashDetails: CashDetailHistory[];
    @Input() transactionCodes: TransactionCode[];
    @ViewChild('zoomEle') zoomEle: ElementRef;
    viewsLoaded: number;
    
    constructor(
        public dialogRef: MatDialogRef<InvoiceModalContent>
    ) {
        wjcCore.setLicenseKey(environment.wijmoDistributionKey);
        // zoom levels
        this.zoomLevels = new wjcCore.CollectionView([
            { header: '25%', value: 0.25 },
            { header: '50%', value: 0.5 },
            { header: '75%', value: 0.75 },
            { header: '100%', value: 1 },
            { header: '125%', value: 1.25 }
        ], {
             currentChanged: (s, e)=> {
                 var view = this.zoomEle.nativeElement;
                 if (view) {                     
                     view.style.zoom = s.currentItem.value;
                 }                 
              }
         });
    }

    ngAfterViewInit() {
        this.zoomLevels.moveCurrentToPosition(3);
    }

    // commands
    print() {
        
        // create document
        var doc = new wjcCore.PrintDocument({
            title: "Invoice"
        });

        // add content to it
        var view = this.zoomEle.nativeElement;
        for (var i = 0; i < view.children.length; i++) {
            doc.append(view.children[i]);
        }
        // and print it
        setTimeout( () => {
            doc.print();
            }, 250
        );
    }

    onClose() {
        this.dialogRef.close();
    }
}
