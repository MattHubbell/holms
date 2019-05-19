import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';

import { CashDetailHistoryService, CashDetailHistory } from "../../admin/transaction-history"
import { TransactionCode, TransactionCodeService } from "../../admin/transaction-codes";

import { MatDialog } from '@angular/material';
import { ReportOptionsDialog, DialogData } from '../reports.modal';


import * as wjcCore from '@grapecity/wijmo';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'cash-receipts-distribution-summary',
    templateUrl: './cash-receipts-distribution-summary.component.html'
})

export class CashReceiptsDistributionSummary implements OnInit, OnDestroy {

    cashDetailHistory: wjcCore.CollectionView;
    transactionCodes: Array<TransactionCode>;
    today = new Date();
    subscription: Array<Subscription>;
    startDate: Date;
    endDate: Date;
    isTotalsOnly: boolean;
    
    public reportOptions: boolean = true;
    @Output() loaded = new EventEmitter<boolean>();
    
    constructor(
        private cashDetailHistoryService: CashDetailHistoryService, 
        private transactionCodeService: TransactionCodeService,
        public dialog: MatDialog
    ) {
        wjcCore.setLicenseKey(environment.wijmoDistributionKey);
        this.subscription = new Array<Subscription>();
    } 
    
    ngOnInit() {
        setTimeout(() => {
            this.setReportOptions();
        });
    }

    setReportOptions() {
        const dialogRef = this.dialog.open(ReportOptionsDialog, {
            data: { useDateRange: true, startDate: this.startDate, endDate: this.endDate, useTotalsOnly: true, isTotalsOnly: this.isTotalsOnly }
        });
        dialogRef.afterClosed().subscribe(result => {
            this.getData(result);
        });
    }

    getData(data: DialogData) {
        this.loaded.emit(false);
        this.startDate = data.startDate;
        this.endDate = data.endDate;
        this.isTotalsOnly = data.isTotalsOnly;
        this.cashDetailHistoryService.getListByDateRange(data.startDate, data.endDate);
        this.subscription.push(this.cashDetailHistoryService.list
            .subscribe(x => {
                this.loadData(x);
            })
        );
    }

    loadData(x:any) {
        this.loadCashDetailHistory(x);
        this.transactionCodes = new Array<TransactionCode>();
        this.transactionCodeService.getList();
        this.subscription.push(this.transactionCodeService.list
            .subscribe(x => {
                this.loadTransactionCodes(x);
            })
        );
    }

    loadTransactionCodes(x:any) {
        x.forEach((y:TransactionCode) => {
            if (this.cashDetailHistory.items.find((z:CashDetailHistory) => z.tranCode == y.id)) {
                this.transactionCodes.push(y);
            }
        });
        this.loaded.emit(true);
    }

    ngOnDestroy() {
        this.subscription.forEach(x => x.unsubscribe());
    }

    loadCashDetailHistory(cashDetailHistory: any) {
        this.cashDetailHistory = new wjcCore.CollectionView(cashDetailHistory, {
            groupDescriptions: [
                new wjcCore.PropertyGroupDescription('batchNo',
                    (item, propName) => {
                        var value = item[propName];
                        return value;
                    }
                )
            ],
            sortDescriptions: ['batchNo']
        });
    }

    calculateCount(tranCode:string, batchNo:string): number {
        let count:number = 0;
        this.cashDetailHistory.items.forEach(x => {
            if (x.tranCode == tranCode && x.batchNo == batchNo) {
                count += +x.distQty
            }
        });
        return count;
    }

    calculateAmount(tranCode:string, batchNo:string): number {
        let amount:number = 0;
        this.cashDetailHistory.items.forEach(x => {
            if (x.tranCode == tranCode && x.batchNo == batchNo) {
                amount += ((+x.distQty != 0) ? (+x.distAmt * +x.distQty) : +x.distAmt);
            }
        });
        return amount;
    }

    getBatchTotal(batchNo:string): number {
        let total:number = 0;
        if (this.cashDetailHistory) {
            this.cashDetailHistory.items.forEach(x => {
                if (x.batchNo == batchNo) {
                    total += ((+x.distQty != 0) ? (+x.distAmt * +x.distQty) : +x.distAmt);
                }
            });
        }
        return total;
    }

    getTransactionCodeCount(tranCode:string): number {
        let count:number = 0;
        this.cashDetailHistory.items.forEach(x => {
            if (x.tranCode == tranCode) {
                count += +x.distQty
            }
        });
        return count;
    }

    getTransactionCodeAmount(tranCode:string): number {
        let amount:number = 0;
        this.cashDetailHistory.items.forEach(x => {
            if (x.tranCode == tranCode ) {
                amount += ((+x.distQty != 0) ? (+x.distAmt * +x.distQty) : +x.distAmt);
            }
        });
        return amount;
    }

    getReportTotal(): number {
        let total:number = 0;
        this.cashDetailHistory.items.forEach(x => total += ((+x.distQty != 0) ? (+x.distAmt * +x.distQty) : +x.distAmt));
        return total;
    }

}
