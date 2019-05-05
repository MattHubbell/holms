import { Component, ViewChild, Input, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { CashDetail } from './cash-detail.model';
import { TransactionCode } from '../transaction-codes/transaction-code.model';

import * as wjcCore from '@grapecity/wijmo';
import { environment } from '../../../environments/environment';

@Component({
    templateUrl: './distribution-summary.modal.html',
    styleUrls: [ './distribution-summary.modal.css' ]
})

export class DistributionSummaryModalContent implements AfterViewInit {

    zoomLevels: wjcCore.CollectionView;
    @Input() batchNo: string;
    @Input() cashDetails: CashDetail[];
    @Input() transactionCodes: TransactionCode[];
    @ViewChild('zoomEle') zoomEle: ElementRef;
    viewsLoaded: number;
    
    constructor(
        public dialogRef: MatDialogRef<DistributionSummaryModalContent>
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
            title: "Distribution Register"
        });

        // add content to it
        var view = this.zoomEle.nativeElement;
        for (var i = 0; i < view.children.length; i++) {
            doc.append(view.children[i]);
        }
        // and print it
        doc.print();
    }

    onClose() {
        this.dialogRef.close();
    }
}
