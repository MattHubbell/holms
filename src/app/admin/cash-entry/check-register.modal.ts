import { Component, ViewChild, Input, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { CashMaster } from './cash-master.model';
import { Member } from '../../members/member.model';

import * as wjcCore from '@grapecity/wijmo';
import { environment } from '../../../environments/environment';

@Component({
    templateUrl: './check-register.modal.html',
    styleUrls: [ './check-register.modal.css' ]
})

export class CheckRegisterModalContent implements AfterViewInit {

    zoomLevels: wjcCore.CollectionView;
    @Input() batchNo: string;
    @Input() cashMasters: CashMaster[];
    @Input() members: Member[];
    @ViewChild('zoomEle') zoomEle: ElementRef;
    viewsLoaded: number;

    constructor(
        public dialogRef: MatDialogRef<CheckRegisterModalContent>
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
        const doc = new wjcCore.PrintDocument({
            title: "Cash Receipts Check Register"
        });

        // add content to it
        const view = this.zoomEle.nativeElement;
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
