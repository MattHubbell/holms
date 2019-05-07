import { Component, Input } from '@angular/core';
import { CashMaster } from './cash-master.model';
import { Member } from '../../members/member.model';
import { CashDetail } from './cash-detail.model';
import { TransactionCode } from '../transaction-codes/transaction-code.model';
import { CashDetailService } from './cash-detail.service';
import { MemberTypeService } from '../member-types/member-type.service';
import { TransactionCodeService } from '../transaction-codes/transaction-code.service';
import { MatDialog } from '@angular/material';
import { MemberType } from '../member-types/member-type.model';
import { Subscription } from 'rxjs';

import * as wjcCore from '@grapecity/wijmo';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'cash-receipts-edit-list',
    templateUrl: './edit-list.component.html'
})

export class EditListComponent  {

    @Input() batchNo: string;
    @Input() cashMasters: CashMaster[];
    @Input() members: Member[];
    
    cashDetails: CashDetail[];
    memberTypes: MemberType[];
    transactionCodes: TransactionCode[];
    subscription: Array<Subscription>;

    constructor(
        private cashDetailService: CashDetailService, 
        private memberTypeService: MemberTypeService,
        private transactionCodeService: TransactionCodeService,
        public dialog: MatDialog
    ) {
        wjcCore.setLicenseKey(environment.wijmoDistributionKey);
        this.subscription = new Array<Subscription>();
    } 
    
    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.cashDetailService.getList();
        this.subscription.push(this.cashDetailService.list
            .subscribe(x => {
                this.cashDetails = x;
            })
        );
        this.memberTypeService.getList();
        this.subscription.push(this.memberTypeService.list
            .subscribe(x => {
                this.memberTypes = x;
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

    find(memberNo:string): Member {
        if (this.members) {
            let member:Member = this.members.find(x => x.memberNo == memberNo);
            return member;
        }
        return null;
    }
    
    findMemberType(id:string): MemberType {
        if (id.length == 0) {
            return null;
        }
        if (this.memberTypes) {
            let memberType:MemberType = this.memberTypes.find(x => x.id == id);
            if (!memberType) {
                memberType = new MemberType();
                if (id.length == 0) {
                    memberType.description = '';
                } else {
                    memberType.description = id;
                }
            }
            return memberType;
        }
        return null;
    }

    findTransactionCode(id:string): TransactionCode {
        if (this.transactionCodes) {
            let transactionCode:TransactionCode = this.transactionCodes.find(x => x.id == id);
            if (!transactionCode) {
                transactionCode = new TransactionCode();
                if (id.length == 0) {
                    transactionCode.description = '(Blank)';
                } else {
                    transactionCode.description = id;
                }
            }
            return transactionCode;
        }
        return null;
    }

    getBatchTotal(): number {
        let batchTotal:number = 0;
        this.cashMasters.forEach(x => batchTotal += +x.checkAmt);
        return batchTotal;
    }
}
