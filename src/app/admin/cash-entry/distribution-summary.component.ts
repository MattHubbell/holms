import { Component, Input } from '@angular/core';
import { CashDetail } from './cash-detail.model';
import { TransactionCode } from '../transaction-codes/transaction-code.model';

@Component({
    selector: 'distribution-summary',
    templateUrl: './distribution-summary.component.html'
})

export class DistributionSummaryComponent  {

    @Input() batchNo: string;
    @Input() cashDetails: CashDetail[];
    @Input() transactionCodes: TransactionCode[];
    
    calculateCount(transCode:string): number {
        let count:number = 0;
        this.cashDetails.forEach(x => {
            if (x.tranCode == transCode && x.batchNo == this.batchNo) {
                count += +x.distQty
            }
        });
        return count;
    }

    calculateAmount(transCode:string): number {
        let amount:number = 0;
        this.cashDetails.forEach(x => {
            if (x.tranCode == transCode && x.batchNo == this.batchNo) {
                amount += (+x.distAmt * +x.distQty)
            }
        });
        return amount;
    }

    getBatchTotal(): number {
        let batchTotal:number = 0;
        this.cashDetails.forEach(x => {
            if (x.batchNo == this.batchNo) {
                batchTotal += (+x.distAmt * +x.distQty)
            }
        });
        return batchTotal;
    }
}
