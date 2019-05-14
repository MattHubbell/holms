import { Component, Input, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { CashDetailHistory } from './cash-detail-history.model';
import { CashDetailHistoryService } from './cash-detail-history.service';
import { TransactionCode, TransactionCodeItemTypes } from '../transaction-codes';
import { MemberType, MemberTypeService } from '../member-types';

import { ConfirmResponses } from '../../shared/modal/confirm-btn-default';
import { Subscription } from 'rxjs';

@Component({
    selector: 'cash-detail-history-modal-content',
    templateUrl: './cash-detail-history.modal.html',
    styleUrls: [ './cash-detail-history.modal.css' ], 
    encapsulation: ViewEncapsulation.None
})
export class CashDetailHistoryModalContent implements OnInit, OnDestroy {

    @Input() selectedItem: any;
    @Input() model: CashDetailHistory;
    @Input() isNewItem: Boolean;
    @Input() transactionCodes: TransactionCode[];

    selectedTransactionCode = new TransactionCode;
    selectedMemberType = new MemberType;
    memberTypes: MemberType[];
    subscription: Array<Subscription>;
    errorChecker: any;
    
    constructor(
        private cashDetailService: CashDetailHistoryService,
        private memberTypeService: MemberTypeService,
        public dialogRef: MatDialogRef<CashDetailHistoryModalContent>
    ) {
        this.subscription = new Array<Subscription>();
        this.memberTypeService.getList();
        this.subscription.push(this.memberTypeService.list
            .subscribe(x => {
                this.memberTypes = x.sort(this.compareNumbersDescending);
            })
        );
    }

    ngOnInit() {
        if (!this.isNewItem) {
            this.findTransactionCode(this.model.tranCode);
        }
    }

    ngOnDestroy() {
        this.subscription.forEach(x => x.unsubscribe());
    }

    filter(tranCode: string): TransactionCode[] {
        if (tranCode) {
          const filterValue = tranCode.toLowerCase();
          return this.transactionCodes.filter(tranCode => tranCode.id.toString().toLowerCase().startsWith(filterValue));
        }
        return this.transactionCodes;
    }
    
    displayFn(id?: string): string | undefined {
        return id ? id : undefined;
    }

    onSubmit(isValid:boolean) {
        if(!isValid) {
            return;
        }
        if (this.isNewItem) {
            this.cashDetailService.addItem(this.model);
        } else {
            this.cashDetailService.updateItem(this.selectedItem, this.model);
        }
        this.dialogRef.close();
    }

    onClose() {
        this.dialogRef.close();
    }
    
    displayTranCode(tranCode?: string): string | undefined {
        return tranCode ? tranCode : undefined;
    }

    isMembership(): boolean {
        return this.selectedTransactionCode.itemType === TransactionCodeItemTypes.Membership;
    }

    findTransactionCode(tranCode: any) {
        this.selectedTransactionCode = null;
        let transactionCode:TransactionCode = this.transactionCodes.find(x => x.id == tranCode);
        if (transactionCode) {
            let transactionCodeModel:TransactionCode = TransactionCode.clone(transactionCode);
            this.selectedTransactionCode = transactionCodeModel;
        }
    }

    onTranCodeChange(tranCode:any) {
        if (!this.transactionCodes) {
            return;
        }
        this.findTransactionCode(tranCode); 
        if (this.selectedTransactionCode) {
            this.model.distAmt = +this.selectedTransactionCode.price;
            if (this.selectedTransactionCode.itemType === TransactionCodeItemTypes.Membership) {
                // this.model.duesYear = new Date().getFullYear();
                // this.model.duesCode = this.getMembershipTypeId();
                // this.model.distQty = 1;
            }
        }
    }

    onDuesCodeChange(duesCode:any) {
        if (!this.memberTypes) {
            return;
        } 
        let memberType:MemberType = this.memberTypes.find(x => x.id == duesCode);
        if (memberType) {
            let memberTypeModel:MemberType = MemberType.clone(memberType);
            this.selectedMemberType = memberTypeModel;
            // this.model.distAmt = +this.selectedMemberType.price;
        }
    }

    getMembershipTypeId(): string {
        if (this.memberTypes == undefined || this.model.distAmt == undefined) {
            return '';
        }
        let total:number = +this.model.distAmt;
        let memberTypes:MemberType[] = this.memberTypes.filter(x => total >= +x.price);
        return memberTypes[0].id;
    }

    compareNumbersDescending(a:MemberType,b:MemberType) {
        return +b.price - +a.price;
    }

}
