import { Injectable } from '@angular/core';
import { FirebaseService } from '../firebase';
import { Observable } from 'rxjs';

import { Setup, SetupService } from '../admin/setup';
import { GiftMembership } from './gift-membership.model';
import { Member } from '../members';
import { CashMaster, CashMasterService } from '../admin/cash-entry';
import { CashDetail, CashDetailService } from '../admin/cash-entry';
import { TransactionCode, TransactionCodeItemTypes } from '../admin/transaction-codes';

@Injectable()
export class GiftMembershipService {

    list: Observable<GiftMembership[]>;
    
    constructor(
        private fs: FirebaseService,
        private setupService: SetupService,
        private cashMasterService: CashMasterService,
        private cashDetailService: CashDetailService
    ) {}

    getList() {
        this.list = this.fs.getItems(GiftMembership.TableName(), 'memberNo');
    }

    getItemByGiftMembershipID(equalTo:string): any {
        return this.fs.getItems(GiftMembership.TableName(), 'memberNo', equalTo);
    }

    getItemByKey(key:any): any {
        return this.fs.getItemByKey(GiftMembership.TableName(), key);
    }

    addItem(model: GiftMembership) { 
        let data = GiftMembership.setData(model);
        this.fs.addItem(GiftMembership.TableName(), data);
    }
    
    updateItem(item:any, model: GiftMembership) {
        let data = GiftMembership.setData(model);
        this.fs.updateItem(GiftMembership.TableName(), item.key, data);
    }

    updateObject(key:string, model: GiftMembership) {
        let data = GiftMembership.setData(model);
        this.fs.updateObject(GiftMembership.TableName() + '/' + key, data);
    }

    deleteItem(item:any) {
        this.fs.deleteItem(GiftMembership.TableName(), item.key);
    }

    deleteAllItems() {
        this.fs.deleteAllItems(GiftMembership.TableName());
    }

    assignReceiptNo(setup: Setup): string {
        let receiptNo:string = setup.nextCashEntryReceiptNo.toString();
        setup.nextCashEntryReceiptNo += 1;
        this.setupService.updateItem(setup);
        return receiptNo;
    }

    public postCashEntry(item: GiftMembership, member: Member, setup: Setup, transactionCodes: TransactionCode[]): void {
        let receiptNo:string = this.assignReceiptNo(setup);
        let memberNo:string = member.memberNo;
        let transDate:Date = new Date();
        let checkNo:string = item.checkNo;
        let checkDate:Date = item.checkDate;
        let checkAmt:number = item.membershipTotal;
        let comments:string = item.comments;

        this.createCashMaster(receiptNo, memberNo, transDate, checkDate, checkNo, checkAmt, comments)

        if (item.duesAmount > 0) {
            let tranCode:string = transactionCodes.filter(x => x.itemType == TransactionCodeItemTypes.Membership)[0].id;
            let distAmt:number = item.duesAmount;
            let distQty:number = item.duesQuantity;
            let duesCode:string = item.membershipTypeId;
            let duesYear:string = member.lastDuesYear.toString();
            this.createCashDetail(receiptNo, memberNo, tranCode, transDate, distQty, distAmt, duesCode, duesYear)
        }

        if (item.merchandisePackageAmount > 0) {
            const giftItems: TransactionCode[] = transactionCodes.filter(x => x.isGiftItem == true);
            const giftDistAmt: number = item.merchandisePackageAmount / giftItems.length;
            giftItems.forEach((transactionCode: TransactionCode) => {
                let tranCode:string = transactionCode.id;
                let distAmt:number = giftDistAmt;
                let distQty:number = 1;
                let duesCode:string = '';
                let duesYear:string = '';
                this.createCashDetail(receiptNo, memberNo, tranCode, transDate, distQty, distAmt, duesCode, duesYear);
            });
        }
        if (item.shippingCharges > 0) {
            let tranCode:string = transactionCodes.filter(x => x.itemType == TransactionCodeItemTypes.Shipping)[0].id;
            let distAmt:number = item.shippingCharges;
            let distQty:number = 1;
            let duesCode:string = '';
            let duesYear:string = '';
            this.createCashDetail(receiptNo, memberNo, tranCode, transDate, distQty, distAmt, duesCode, duesYear);
        }
    }
    
    createCashMaster(receiptNo: string, memberNo: string, transDateTime: Date, checkDate: Date, checkNo: string, checkAmt: number, comments: string) {
        let cashMaster: CashMaster = new CashMaster();
        cashMaster.receiptNo = receiptNo;
        cashMaster.memberNo = memberNo;
        cashMaster.transDate = transDateTime;
        cashMaster.checkDate = checkDate;
        cashMaster.checkNo = checkNo;
        cashMaster.currencyCode = 'USD';
        cashMaster.checkAmt = checkAmt;
        cashMaster.comments = comments;
        this.cashMasterService.addItem(cashMaster);
    }

    createCashDetail(receiptNo: string, memberNo: string, tranCode: string, transDate: Date, distQty: number, distAmt: number, duesCode: string, duesYear: string) {
        let cashDetail: CashDetail = new CashDetail();
        cashDetail.receiptNo = receiptNo;
        cashDetail.memberNo = memberNo;
        cashDetail.duesCode = duesCode;
        cashDetail.distQty = distQty;
        cashDetail.distAmt = distAmt;
        cashDetail.duesYear = duesYear;
        cashDetail.tranCode = tranCode;
        cashDetail.transDate = transDate;
        this.cashDetailService.addItem(cashDetail);
    }
}
