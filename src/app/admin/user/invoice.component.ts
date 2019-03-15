import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CashDetailHistory } from '../transaction-history/cash-detail-history.model';
import { TransactionCode } from '../transaction-codes/transaction-code.model';
import { CashMaster } from '../cash-entry';
import { Subscription } from 'rxjs';
import { CashDetailHistoryService } from '../transaction-history';
import { TransactionCodeService } from '../transaction-codes';
import { Member } from '../../members';

@Component({
    selector: 'invoice',
    templateUrl: './invoice.component.html'
})

export class InvoiceComponent implements OnInit, OnDestroy {

    @Input() member: Member;
    @Input() cashMaster: CashMaster;
    cashDetails: Array<CashDetailHistory>;
    transactionCodes: Array<TransactionCode>;
    subscription: Array<Subscription>;
    
    constructor(
        private cashDetailHistoryService: CashDetailHistoryService,
        private transactionCodeService: TransactionCodeService
    ) {
    }

    ngOnInit() {
        this.subscription = new Array<Subscription>();
        this.cashDetails = new Array<CashDetailHistory>();
        this.transactionCodes = new Array<TransactionCode>();
        console.log(this.cashMaster.receiptNo);
        this.cashDetailHistoryService.getListByReceiptNo(this.cashMaster.receiptNo);
        this.subscription.push(this.cashDetailHistoryService.list
            .subscribe(x => {
                this.cashDetails = x;
            })
        );
        this.transactionCodeService.getList();
        this.subscription.push(this.transactionCodeService.list
            .subscribe(x => {
                this.transactionCodes = x;
            })
        );
    }

    ngOnDestroy() {
        this.subscription.forEach(x => x.unsubscribe());
    }

    getTransactionCodeDescription(id: string): string {
        const transactionCode = this.transactionCodes.find(x => x.id == id);
        return ((transactionCode) ? transactionCode.description : '');
    }

    getBatchTotal(): number {
        let invoiceTotal:number = 0;
        this.cashDetails.forEach(x => {
            if (x.receiptNo == this.cashMaster.receiptNo) {
                invoiceTotal += ((x.distQty !=0 ) ? (x.distAmt * x.distQty) : x.distAmt);
            }
        });
        return invoiceTotal;
    }
}
