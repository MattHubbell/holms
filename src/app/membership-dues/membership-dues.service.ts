import { Injectable } from '@angular/core';

import { Setup, SetupService }                              from '../admin/setup';
import { MembershipDues }                                   from './membership-dues.model';
import { Member, MemberService }                            from '../members';
import { CashMaster, CashMasterService }                    from '../admin/cash-entry';
import { CashDetail, CashDetailService }                    from '../admin/cash-entry';
import { TransactionCode, TransactionCodeItemTypes }        from '../admin/transaction-codes';

@Injectable()
export class MembershipDuesService {

    constructor(
        private setupService: SetupService,
        private memberService: MemberService,
        private cashMasterService: CashMasterService,
        private cashDetailService: CashDetailService
    ) {}

    assignReceiptNo(setup: Setup): string {
        let receiptNo:string = setup.nextCashEntryReceiptNo.toString();
        setup.nextCashEntryReceiptNo += 1;
        this.setupService.updateItem(setup);
        return receiptNo;
    }

    public postCashEntry(item: MembershipDues, member: Member, setup: Setup, transactionCodes: TransactionCode[]): void {
        let memberModel:Member = Member.clone(member);
        let memberType:string = item.membershipTypeId;
    
        memberModel.lastDuesYear = setup.duesYear - 1 + item.duesQuantity;
        memberModel.memberType = memberType;
        memberModel.memberStatus = 'A';
        memberModel.paidThruDate = item.duesPaidThruDate;

        if (memberModel.anniversary === undefined) {
            const aniversary: Date = new Date();
            memberModel.anniversary = aniversary;
        }

        this.memberService.updateItem(member, memberModel);

        let receiptNo:string = this.assignReceiptNo(setup);
        let memberNo:string = memberModel.memberNo;
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
            let duesYear:string = memberModel.lastDuesYear.toString();
            this.createCashDetail(receiptNo, memberNo, tranCode, transDate, distQty, distAmt, duesCode, duesYear)
        }
        if (item.foundation > 0) {
            let tranCode:string = transactionCodes.filter(x => x.itemType == TransactionCodeItemTypes.Foundation)[0].id;
            let distAmt:number = item.foundation;
            let distQty:number = 1;
            let duesCode:string = '';
            let duesYear:string = '';
            this.createCashDetail(receiptNo, memberNo, tranCode, transDate, distQty, distAmt, duesCode, duesYear)
        }
        if (item.museum_library > 0) {
            let tranCode:string = transactionCodes.filter(x => x.itemType == TransactionCodeItemTypes.MuseumLibary)[0].id;
            let distAmt:number = item.museum_library;
            let distQty:number = 1;
            let duesCode:string = '';
            let duesYear:string = '';
            this.createCashDetail(receiptNo, memberNo, tranCode, transDate, distQty, distAmt, duesCode, duesYear)
        }
        if (item.scholarship > 0) {
            let tranCode:string = transactionCodes.filter(x => x.itemType == TransactionCodeItemTypes.ScholarshipFund)[0].id;
            let distAmt:number = item.scholarship;
            let distQty:number = 1;
            let duesCode:string = '';
            let duesYear:string = '';
            this.createCashDetail(receiptNo, memberNo, tranCode, transDate, distQty, distAmt, duesCode, duesYear)
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
