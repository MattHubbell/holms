import { Component, Input, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material';

import { CashDetail } from './cash-detail.model';
import { CashDetailService } from './cash-detail.service';
import { TransactionCode, TransactionCodeItemTypes } from '../transaction-codes';
import { MemberType, MemberTypeService } from '../member-types';

import { ConfirmResponses } from '../../shared/modal/confirm-btn-default';
import { JQueryService }  from '../../shared/jquery.service';
import { Subscription } from 'rxjs';
import * as f from '../../shared/functions';

@Component({
    selector: 'cash-detail-modal-content',
    templateUrl: './cash-detail.modal.html',
    styleUrls: [ './cash-detail.modal.css' ], 
    encapsulation: ViewEncapsulation.None
})
export class CashDetailModalContent implements OnInit, OnDestroy {

    @Input() selectedItem: any;
    @Input() model: CashDetail;
    @Input() isNewItem: Boolean;
    @Input() transactionCodes: TransactionCode[];

    selectedTransactionCode = new TransactionCode;
    selectedMemberType = new MemberType;
    memberTypes: MemberType[];
    subscription: Array<Subscription>;
    errorChecker: any;
    
    constructor(
        private cashDetailService: CashDetailService,
        private memberTypeService: MemberTypeService,
        private jQueryService: JQueryService,
        public dialogRef: MatDialogRef<CashDetailModalContent>
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

    onDelete($event: ConfirmResponses) {
        if ($event === ConfirmResponses.yes) {
            this.cashDetailService.deleteItem(this.selectedItem);
            this.dialogRef.close();
        }
    }

    onClose() {
        this.dialogRef.close();
    }

	toUppercase(value:any, model:any, field:string) {
        f.toUppercase(value, model, field);
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
            let transactionCodeModel:TransactionCode = this.jQueryService.cloneObject(transactionCode);
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
                this.model.duesYear = new Date().getFullYear();
                this.model.duesCode = this.getMembershipTypeId();
                this.model.distQty = 1;
            }
        }
    }

    onDuesCodeChange(duesCode:any) {
        if (!this.memberTypes) {
            return;
        } 
        let memberType:MemberType = this.memberTypes.find(x => x.id == duesCode);
        if (memberType) {
            let memberTypeModel:MemberType = this.jQueryService.cloneObject(memberType);
            this.selectedMemberType = memberTypeModel;
            this.model.distAmt = +this.selectedMemberType.price;
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
