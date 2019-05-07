import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { CashMasterHistoryService, CashDetailHistory, CashDetailHistoryService } from "../../admin/transaction-history"
import { Member, MemberService } from "../../members";
import { MemberType, MemberTypeService } from "../../admin/member-types";
import { TransactionCode, TransactionCodeService } from "../../admin/transaction-codes";

import { MatDialog } from '@angular/material';
import { ReportOptionsDialog } from '../reports.modal';

import * as wjcCore from '@grapecity/wijmo';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'cash-receipts-distribution-history',
    templateUrl: './cash-receipts-distribution-history.component.html'
})

export class CashReceiptsDistributionHistory implements OnInit, OnDestroy {

    cashMasterHistory: wjcCore.CollectionView;
    cashDetailHistory: CashDetailHistory[];
    members: Member[];
    memberTypes: MemberType[];
    transactionCodes: TransactionCode[];
    today = new Date();
    subscription: Array<Subscription>;
    startDate: Date;
    endDate: Date;
    
    public reportOptions: boolean = true;

    constructor(
        private cashMasterHistoryService: CashMasterHistoryService, 
        private cashDetailHistoryService: CashDetailHistoryService, 
        private memberService: MemberService,
        private memberTypeService: MemberTypeService,
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
            data: { useDateRange: true, startDate: this.startDate, endDate: this.endDate }
        });
        dialogRef.afterClosed().subscribe(result => {
            this.loadData(result.startDate, result.endDate);
        });
    }

    loadData(startDate: Date, endDate: Date) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.cashMasterHistoryService.getList();
        this.subscription.push(this.cashMasterHistoryService.list
            .subscribe(x => {
                this.loadCashMastHistory(x.filter(y => new Date(y.transDate) >= startDate && new Date(y.transDate) <= endDate));
            })
        );
        this.cashDetailHistoryService.getList();
        this.subscription.push(this.cashDetailHistoryService.list
            .subscribe(x => {
                this.cashDetailHistory = x.filter(y => new Date(y.transDate) >= startDate && new Date(y.transDate) <= endDate);
            })
        );
        this.memberService.getList();
        this.subscription.push(this.memberService.list
            .subscribe(x => {
                this.members = x;
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

    loadCashMastHistory(cashMasterHistory: any) {
        this.cashMasterHistory = new wjcCore.CollectionView(cashMasterHistory, {
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

    findMember(memberNo:string): Member {
        if (this.members) {
            let member:Member = this.members.find(x => x.memberNo == memberNo);
            if (!member) {
                member = new Member();
                if (memberNo.length == 0) {
                    member.memberNo = '(Blank)';
                } else {
                    member.memberNo = memberNo;
                }
            }
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

    getBatchTotal(batchNo: string): number {
        let batchTotal:number = 0;
        this.cashMasterHistory.items.forEach(x => {
            if (x.batchNo == batchNo) {
                batchTotal += +x.checkAmt;
            }
        });
        return batchTotal;
    }

    getReportTotal(): number {
        let batchTotal:number = 0;
        this.cashMasterHistory.items.forEach(x => batchTotal += +x.checkAmt);
        return batchTotal;
    }

}
